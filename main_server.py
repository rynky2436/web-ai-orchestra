"""
AI Desktop Platform - Core Server
Main server application that handles all AI processing and module management
"""

import asyncio
import logging
import os
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

# Core imports
from fastapi import FastAPI, WebSocket, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn

# Internal imports
from core.ai_provider_manager import AIProviderManager
from core.module_manager import ModuleManager
from core.permission_manager import PermissionManager
from core.session_manager import SessionManager
from core.config_manager import ConfigManager


class AIPlatformServer:
    """Main server class for the AI Desktop Platform"""
    
    def __init__(self, config_path: str = "config/server_config.json"):
        self.config = ConfigManager(config_path)
        self.app = FastAPI(title="AI Desktop Platform", version="1.0.0")
        
        # Core managers
        self.ai_provider_manager = AIProviderManager()
        self.module_manager = ModuleManager()
        self.permission_manager = PermissionManager()
        self.session_manager = SessionManager()
        
        # Active connections
        self.active_connections: List[WebSocket] = []
        
        # Setup logging
        self.setup_logging()
        
        # Setup FastAPI app
        self.setup_app()
        
        self.logger = logging.getLogger("AIPlatformServer")
        self.logger.info("AI Desktop Platform Server initialized")
    
    def setup_logging(self):
        """Setup logging configuration"""
        log_level = self.config.get("log_level", "INFO")
        
        logging.basicConfig(
            level=getattr(logging, log_level),
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.StreamHandler(),
                logging.FileHandler('ai_platform.log')
            ]
        )
    
    def setup_app(self):
        """Setup FastAPI application with routes and middleware"""
        
        # CORS middleware
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # Configure appropriately for production
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        # Serve static files (React frontend)
        frontend_path = Path("server/frontend/ai-platform-frontend/dist")
        if frontend_path.exists():
            self.app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")
        
        # Setup routes
        self.setup_routes()
    
    def setup_routes(self):
        """Setup API routes"""
        
        @self.app.get("/")
        async def root():
            """Serve the main React application"""
            frontend_path = Path("server/frontend/ai-platform-frontend/dist/index.html")
            if frontend_path.exists():
                with open(frontend_path, 'r') as f:
                    return HTMLResponse(content=f.read())
            return {"message": "AI Desktop Platform API", "status": "running"}
        
        @self.app.get("/api/health")
        async def health_check():
            """Health check endpoint"""
            return {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "version": "1.0.0",
                "modules_loaded": len(self.module_manager.loaded_modules),
                "active_sessions": len(self.session_manager.active_sessions)
            }
        
        @self.app.post("/api/chat")
        async def chat_endpoint(request: dict):
            """Main chat endpoint for AI interactions"""
            try:
                user_id = request.get("user_id", "anonymous")
                message = request.get("message", "")
                session_id = request.get("session_id")
                provider = request.get("provider", "openai")
                
                # Get or create session
                session = await self.session_manager.get_or_create_session(user_id, session_id)
                
                # Check permissions
                permissions = await self.permission_manager.get_user_permissions(user_id)
                
                # Process the request
                response = await self.process_ai_request(
                    message=message,
                    session=session,
                    provider=provider,
                    permissions=permissions
                )
                
                return {
                    "success": True,
                    "response": response,
                    "session_id": session.id,
                    "timestamp": datetime.now().isoformat()
                }
                
            except Exception as e:
                self.logger.error(f"Chat endpoint error: {str(e)}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/api/modules")
        async def list_modules():
            """List available modules"""
            return {
                "modules": self.module_manager.get_available_modules(),
                "loaded": list(self.module_manager.loaded_modules.keys())
            }
        
        @self.app.post("/api/modules/{module_name}/enable")
        async def enable_module(module_name: str, user_id: str = "anonymous"):
            """Enable a specific module for a user"""
            try:
                # Check permissions
                permissions = await self.permission_manager.get_user_permissions(user_id)
                if not permissions.can_manage_modules:
                    raise HTTPException(status_code=403, detail="Insufficient permissions")
                
                success = await self.module_manager.enable_module(module_name, user_id)
                return {"success": success, "module": module_name}
                
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/api/providers")
        async def list_ai_providers():
            """List available AI providers"""
            return {
                "providers": self.ai_provider_manager.get_available_providers(),
                "status": self.ai_provider_manager.get_provider_status()
            }
        
        @self.app.post("/api/providers/configure")
        async def configure_provider(config: dict):
            """Configure AI provider settings"""
            try:
                provider_name = config.get("provider")
                api_key = config.get("api_key")
                settings = config.get("settings", {})
                
                success = await self.ai_provider_manager.configure_provider(
                    provider_name, api_key, settings
                )
                
                return {"success": success, "provider": provider_name}
                
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.websocket("/ws/{user_id}")
        async def websocket_endpoint(websocket: WebSocket, user_id: str):
            """WebSocket endpoint for real-time communication"""
            await self.connect_websocket(websocket, user_id)
            
            try:
                while True:
                    data = await websocket.receive_text()
                    message_data = json.loads(data)
                    
                    # Process WebSocket message
                    response = await self.process_websocket_message(message_data, user_id)
                    
                    # Send response
                    await websocket.send_text(json.dumps(response))
                    
            except Exception as e:
                self.logger.error(f"WebSocket error for user {user_id}: {str(e)}")
            finally:
                await self.disconnect_websocket(websocket)
    
    async def connect_websocket(self, websocket: WebSocket, user_id: str):
        """Handle new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.logger.info(f"WebSocket connected for user: {user_id}")
        
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "connection",
            "message": "Connected to AI Desktop Platform",
            "user_id": user_id,
            "timestamp": datetime.now().isoformat()
        }))
    
    async def disconnect_websocket(self, websocket: WebSocket):
        """Handle WebSocket disconnection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        self.logger.info("WebSocket disconnected")
    
    async def process_ai_request(self, message: str, session: Any, provider: str, permissions: Any) -> Dict[str, Any]:
        """Process an AI request through the appropriate provider and modules"""
        
        # Get AI provider
        ai_provider = await self.ai_provider_manager.get_provider(provider)
        if not ai_provider:
            raise Exception(f"AI provider '{provider}' not available")
        
        # Analyze the request to determine required modules
        required_modules = await self.analyze_request_modules(message, permissions)
        
        # Load required modules
        for module_name in required_modules:
            await self.module_manager.ensure_module_loaded(module_name)
        
        # Build context from session history
        context = await self.build_request_context(session, permissions)
        
        # Process through AI provider
        ai_response = await ai_provider.process_request(message, context)
        
        # Execute any actions through modules
        action_results = await self.execute_module_actions(ai_response, permissions)
        
        # Update session
        await self.session_manager.update_session(session, message, ai_response, action_results)
        
        return {
            "message": ai_response.get("message", ""),
            "actions": action_results,
            "modules_used": required_modules,
            "provider": provider
        }
    
    async def analyze_request_modules(self, message: str, permissions: Any) -> List[str]:
        """Analyze the request to determine which modules are needed"""
        required_modules = []
        message_lower = message.lower()
        
        # Basic keyword analysis (can be enhanced with AI)
        if any(word in message_lower for word in ["code", "program", "website", "app"]):
            if permissions.can_use_coding_agent:
                required_modules.append("coding_agent")
        
        if any(word in message_lower for word in ["browser", "website", "social media", "email"]):
            if permissions.can_use_browser_automation:
                required_modules.append("browser_automation")
        
        if any(word in message_lower for word in ["file", "folder", "organize", "clean"]):
            if permissions.can_access_files:
                required_modules.append("file_manager")
        
        if any(word in message_lower for word in ["voice", "speak", "say"]):
            if permissions.can_use_voice:
                required_modules.append("voice_interface")
        
        return required_modules
    
    async def build_request_context(self, session: Any, permissions: Any) -> Dict[str, Any]:
        """Build context for the AI request"""
        return {
            "session_history": session.get_recent_messages(10),
            "user_permissions": permissions.to_dict(),
            "available_modules": list(self.module_manager.loaded_modules.keys()),
            "timestamp": datetime.now().isoformat()
        }
    
    async def execute_module_actions(self, ai_response: Dict[str, Any], permissions: Any) -> List[Dict[str, Any]]:
        """Execute actions through appropriate modules"""
        actions = ai_response.get("actions", [])
        results = []
        
        for action in actions:
            module_name = action.get("module")
            if module_name in self.module_manager.loaded_modules:
                module = self.module_manager.loaded_modules[module_name]
                
                # Check permissions for this action
                if await self.permission_manager.can_execute_action(action, permissions):
                    try:
                        result = await module.execute_action(action)
                        results.append({
                            "action": action,
                            "result": result,
                            "success": True
                        })
                    except Exception as e:
                        results.append({
                            "action": action,
                            "error": str(e),
                            "success": False
                        })
                else:
                    results.append({
                        "action": action,
                        "error": "Permission denied",
                        "success": False
                    })
        
        return results
    
    async def process_websocket_message(self, message_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Process a WebSocket message"""
        message_type = message_data.get("type", "chat")
        
        if message_type == "chat":
            # Handle chat message
            session = await self.session_manager.get_or_create_session(user_id)
            permissions = await self.permission_manager.get_user_permissions(user_id)
            
            response = await self.process_ai_request(
                message=message_data.get("message", ""),
                session=session,
                provider=message_data.get("provider", "openai"),
                permissions=permissions
            )
            
            return {
                "type": "chat_response",
                "data": response,
                "timestamp": datetime.now().isoformat()
            }
        
        elif message_type == "module_action":
            # Handle direct module action
            return await self.handle_module_action(message_data, user_id)
        
        elif message_type == "voice_input":
            # Handle voice input
            return await self.handle_voice_input(message_data, user_id)
        
        else:
            return {
                "type": "error",
                "message": f"Unknown message type: {message_type}",
                "timestamp": datetime.now().isoformat()
            }
    
    async def handle_module_action(self, message_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Handle direct module action"""
        # Implementation for direct module actions
        return {
            "type": "module_response",
            "message": "Module action processed",
            "timestamp": datetime.now().isoformat()
        }
    
    async def handle_voice_input(self, message_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Handle voice input processing"""
        # Implementation for voice input
        return {
            "type": "voice_response",
            "message": "Voice input processed",
            "timestamp": datetime.now().isoformat()
        }
    
    async def broadcast_to_connections(self, message: Dict[str, Any]):
        """Broadcast message to all active WebSocket connections"""
        if self.active_connections:
            message_text = json.dumps(message)
            for connection in self.active_connections.copy():
                try:
                    await connection.send_text(message_text)
                except Exception as e:
                    self.logger.error(f"Error broadcasting to connection: {str(e)}")
                    self.active_connections.remove(connection)
    
    def run(self, host: str = "0.0.0.0", port: int = 7777):
        """Run the server"""
        self.logger.info(f"Starting AI Desktop Platform Server on {host}:{port}")
        uvicorn.run(self.app, host=host, port=port, log_level="info")


# Server startup
if __name__ == "__main__":
    server = AIPlatformServer()
    server.run(port=7777)  # Explicitly set port 7777
