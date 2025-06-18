"""
Session Manager - Handles user sessions and conversation context
"""

import asyncio
import logging
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict


@dataclass
class Message:
    """Individual message in a session"""
    id: str
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata
        }


@dataclass
class Session:
    """User session containing conversation history and context"""
    id: str
    user_id: str
    created_at: datetime
    last_activity: datetime
    messages: List[Message]
    context: Dict[str, Any]
    is_active: bool = True
    
    def __post_init__(self):
        if not self.messages:
            self.messages = []
        if not self.context:
            self.context = {}
    
    def add_message(self, role: str, content: str, metadata: Dict[str, Any] = None) -> Message:
        """Add a message to the session"""
        message = Message(
            id=str(uuid.uuid4()),
            role=role,
            content=content,
            timestamp=datetime.now(),
            metadata=metadata or {}
        )
        
        self.messages.append(message)
        self.last_activity = datetime.now()
        
        return message
    
    def get_recent_messages(self, count: int = 10) -> List[Dict[str, Any]]:
        """Get recent messages as dictionaries"""
        recent = self.messages[-count:] if count > 0 else self.messages
        return [msg.to_dict() for msg in recent]
    
    def update_context(self, key: str, value: Any):
        """Update session context"""
        self.context[key] = value
        self.last_activity = datetime.now()
    
    def get_context(self, key: str, default: Any = None) -> Any:
        """Get value from session context"""
        return self.context.get(key, default)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert session to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "last_activity": self.last_activity.isoformat(),
            "messages": [msg.to_dict() for msg in self.messages],
            "context": self.context,
            "is_active": self.is_active
        }


class SessionManager:
    """Manages user sessions and conversation context"""
    
    def __init__(self, session_timeout_hours: int = 24):
        self.active_sessions: Dict[str, Session] = {}
        self.user_sessions: Dict[str, List[str]] = {}  # user_id -> session_ids
        self.session_timeout = timedelta(hours=session_timeout_hours)
        self.logger = logging.getLogger("SessionManager")
        
        # Start cleanup task
        self._start_cleanup_task()
    
    def _start_cleanup_task(self):
        """Start background task to cleanup expired sessions"""
        async def cleanup_expired_sessions():
            while True:
                try:
                    await self._cleanup_expired_sessions()
                    await asyncio.sleep(3600)  # Run every hour
                except Exception as e:
                    self.logger.error(f"Error in session cleanup: {str(e)}")
                    await asyncio.sleep(3600)
        
        asyncio.create_task(cleanup_expired_sessions())
    
    async def get_or_create_session(self, user_id: str, session_id: Optional[str] = None) -> Session:
        """Get existing session or create new one"""
        
        # If session_id provided, try to get existing session
        if session_id and session_id in self.active_sessions:
            session = self.active_sessions[session_id]
            if session.user_id == user_id and session.is_active:
                session.last_activity = datetime.now()
                return session
        
        # Create new session
        session_id = str(uuid.uuid4())
        session = Session(
            id=session_id,
            user_id=user_id,
            created_at=datetime.now(),
            last_activity=datetime.now(),
            messages=[],
            context={}
        )
        
        # Store session
        self.active_sessions[session_id] = session
        
        # Track user sessions
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = []
        self.user_sessions[user_id].append(session_id)
        
        self.logger.info(f"Created new session {session_id} for user {user_id}")
        return session
    
    async def get_session(self, session_id: str) -> Optional[Session]:
        """Get session by ID"""
        return self.active_sessions.get(session_id)
    
    async def update_session(self, session: Session, user_message: str, ai_response: Dict[str, Any], action_results: List[Dict[str, Any]]):
        """Update session with new message exchange"""
        
        # Add user message
        session.add_message("user", user_message)
        
        # Add AI response
        ai_message = ai_response.get("message", "")
        ai_metadata = {
            "provider": ai_response.get("provider", ""),
            "model": ai_response.get("model", ""),
            "actions": action_results,
            "usage": ai_response.get("usage", {})
        }
        session.add_message("assistant", ai_message, ai_metadata)
        
        # Update context with action results
        if action_results:
            session.update_context("last_actions", action_results)
        
        self.logger.debug(f"Updated session {session.id} with message exchange")
    
    async def get_user_sessions(self, user_id: str, active_only: bool = True) -> List[Session]:
        """Get all sessions for a user"""
        if user_id not in self.user_sessions:
            return []
        
        sessions = []
        for session_id in self.user_sessions[user_id]:
            if session_id in self.active_sessions:
                session = self.active_sessions[session_id]
                if not active_only or session.is_active:
                    sessions.append(session)
        
        # Sort by last activity (most recent first)
        sessions.sort(key=lambda s: s.last_activity, reverse=True)
        return sessions
    
    async def end_session(self, session_id: str) -> bool:
        """End a session"""
        if session_id not in self.active_sessions:
            return False
        
        session = self.active_sessions[session_id]
        session.is_active = False
        
        self.logger.info(f"Ended session {session_id}")
        return True
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete a session completely"""
        if session_id not in self.active_sessions:
            return False
        
        session = self.active_sessions[session_id]
        user_id = session.user_id
        
        # Remove from active sessions
        del self.active_sessions[session_id]
        
        # Remove from user sessions
        if user_id in self.user_sessions:
            if session_id in self.user_sessions[user_id]:
                self.user_sessions[user_id].remove(session_id)
        
        self.logger.info(f"Deleted session {session_id}")
        return True
    
    async def _cleanup_expired_sessions(self):
        """Clean up expired sessions"""
        current_time = datetime.now()
        expired_sessions = []
        
        for session_id, session in self.active_sessions.items():
            if current_time - session.last_activity > self.session_timeout:
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            await self.delete_session(session_id)
        
        if expired_sessions:
            self.logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
    
    async def get_session_stats(self) -> Dict[str, Any]:
        """Get session statistics"""
        total_sessions = len(self.active_sessions)
        active_sessions = sum(1 for s in self.active_sessions.values() if s.is_active)
        total_users = len(self.user_sessions)
        
        # Calculate average messages per session
        total_messages = sum(len(s.messages) for s in self.active_sessions.values())
        avg_messages = total_messages / total_sessions if total_sessions > 0 else 0
        
        return {
            "total_sessions": total_sessions,
            "active_sessions": active_sessions,
            "total_users": total_users,
            "total_messages": total_messages,
            "average_messages_per_session": round(avg_messages, 2)
        }
    
    async def export_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Export session data"""
        if session_id not in self.active_sessions:
            return None
        
        session = self.active_sessions[session_id]
        return session.to_dict()
    
    async def import_session(self, session_data: Dict[str, Any]) -> bool:
        """Import session data"""
        try:
            # Create session from data
            session = Session(
                id=session_data["id"],
                user_id=session_data["user_id"],
                created_at=datetime.fromisoformat(session_data["created_at"]),
                last_activity=datetime.fromisoformat(session_data["last_activity"]),
                messages=[],
                context=session_data.get("context", {}),
                is_active=session_data.get("is_active", True)
            )
            
            # Import messages
            for msg_data in session_data.get("messages", []):
                message = Message(
                    id=msg_data["id"],
                    role=msg_data["role"],
                    content=msg_data["content"],
                    timestamp=datetime.fromisoformat(msg_data["timestamp"]),
                    metadata=msg_data.get("metadata", {})
                )
                session.messages.append(message)
            
            # Store session
            self.active_sessions[session.id] = session
            
            # Track user sessions
            user_id = session.user_id
            if user_id not in self.user_sessions:
                self.user_sessions[user_id] = []
            if session.id not in self.user_sessions[user_id]:
                self.user_sessions[user_id].append(session.id)
            
            self.logger.info(f"Imported session {session.id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error importing session: {str(e)}")
            return False
    
    async def search_sessions(self, user_id: str, query: str, limit: int = 10) -> List[Session]:
        """Search sessions by content"""
        if user_id not in self.user_sessions:
            return []
        
        matching_sessions = []
        query_lower = query.lower()
        
        for session_id in self.user_sessions[user_id]:
            if session_id in self.active_sessions:
                session = self.active_sessions[session_id]
                
                # Search in messages
                for message in session.messages:
                    if query_lower in message.content.lower():
                        matching_sessions.append(session)
                        break
        
        # Sort by last activity and limit results
        matching_sessions.sort(key=lambda s: s.last_activity, reverse=True)
        return matching_sessions[:limit]
    
    async def get_conversation_summary(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get a summary of the conversation"""
        if session_id not in self.active_sessions:
            return None
        
        session = self.active_sessions[session_id]
        
        # Count messages by role
        user_messages = sum(1 for msg in session.messages if msg.role == "user")
        assistant_messages = sum(1 for msg in session.messages if msg.role == "assistant")
        
        # Get first and last message timestamps
        first_message = session.messages[0] if session.messages else None
        last_message = session.messages[-1] if session.messages else None
        
        # Calculate duration
        duration = None
        if first_message and last_message:
            duration = (last_message.timestamp - first_message.timestamp).total_seconds()
        
        return {
            "session_id": session_id,
            "user_id": session.user_id,
            "created_at": session.created_at.isoformat(),
            "last_activity": session.last_activity.isoformat(),
            "total_messages": len(session.messages),
            "user_messages": user_messages,
            "assistant_messages": assistant_messages,
            "duration_seconds": duration,
            "is_active": session.is_active,
            "context_keys": list(session.context.keys())
        }

