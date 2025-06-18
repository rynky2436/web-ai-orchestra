"""
AI Desktop System - Memory System Module

This module implements the hierarchical memory architecture that provides storage,
organization, and retrieval capabilities for all types of system information.

Author: Manus AI
Date: June 17, 2025
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Any, Set, Tuple
from datetime import datetime, timedelta
import json
import uuid
import hashlib
import sqlite3
import pickle
import numpy as np
from collections import defaultdict


class MemoryType(Enum):
    """Types of memory storage"""
    WORKING = "working"
    EPISODIC = "episodic"
    SEMANTIC = "semantic"
    PROCEDURAL = "procedural"


class AccessPattern(Enum):
    """Memory access patterns"""
    SEQUENTIAL = "sequential"
    RANDOM = "random"
    ASSOCIATIVE = "associative"
    TEMPORAL = "temporal"


@dataclass
class MemoryItem:
    """Base class for memory items"""
    id: str
    content: Any
    memory_type: MemoryType
    created_at: datetime = field(default_factory=datetime.now)
    last_accessed: datetime = field(default_factory=datetime.now)
    access_count: int = 0
    importance_score: float = 0.5
    tags: Set[str] = field(default_factory=set)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'content': self.content,
            'memory_type': self.memory_type.value,
            'created_at': self.created_at.isoformat(),
            'last_accessed': self.last_accessed.isoformat(),
            'access_count': self.access_count,
            'importance_score': self.importance_score,
            'tags': list(self.tags),
            'metadata': self.metadata
        }


@dataclass
class EpisodicMemory(MemoryItem):
    """Memory of specific experiences and events"""
    context: Dict[str, Any] = field(default_factory=dict)
    participants: List[str] = field(default_factory=list)
    outcome: Optional[str] = None
    lessons_learned: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        self.memory_type = MemoryType.EPISODIC


@dataclass
class SemanticMemory(MemoryItem):
    """Memory of facts, concepts, and general knowledge"""
    concept: str = ""
    relationships: Dict[str, List[str]] = field(default_factory=dict)
    confidence_score: float = 1.0
    source: Optional[str] = None
    
    def __post_init__(self):
        self.memory_type = MemoryType.SEMANTIC


@dataclass
class WorkingMemory(MemoryItem):
    """Temporary memory for current operations"""
    task_id: Optional[str] = None
    expiry_time: Optional[datetime] = None
    priority: int = 5
    
    def __post_init__(self):
        self.memory_type = MemoryType.WORKING
        if self.expiry_time is None:
            self.expiry_time = datetime.now() + timedelta(hours=1)


class MemoryStore(ABC):
    """Abstract base class for memory storage"""
    
    def __init__(self, store_type: MemoryType):
        self.store_type = store_type
        self.logger = logging.getLogger(f"MemoryStore.{store_type.value}")
    
    @abstractmethod
    async def store(self, item: MemoryItem) -> bool:
        """Store a memory item"""
        pass
    
    @abstractmethod
    async def retrieve(self, item_id: str) -> Optional[MemoryItem]:
        """Retrieve a memory item by ID"""
        pass
    
    @abstractmethod
    async def search(self, query: Dict[str, Any]) -> List[MemoryItem]:
        """Search for memory items"""
        pass
    
    @abstractmethod
    async def delete(self, item_id: str) -> bool:
        """Delete a memory item"""
        pass
    
    @abstractmethod
    async def update(self, item: MemoryItem) -> bool:
        """Update a memory item"""
        pass


class SQLiteMemoryStore(MemoryStore):
    """SQLite-based memory storage implementation"""
    
    def __init__(self, store_type: MemoryType, db_path: str):
        super().__init__(store_type)
        self.db_path = db_path
        self._init_database()
    
    def _init_database(self):
        """Initialize the SQLite database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create memory items table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS memory_items (
                id TEXT PRIMARY KEY,
                content BLOB,
                memory_type TEXT,
                created_at TEXT,
                last_accessed TEXT,
                access_count INTEGER,
                importance_score REAL,
                tags TEXT,
                metadata TEXT
            )
        ''')
        
        # Create indexes for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_memory_type ON memory_items(memory_type)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_created_at ON memory_items(created_at)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_importance ON memory_items(importance_score)')
        
        conn.commit()
        conn.close()
    
    async def store(self, item: MemoryItem) -> bool:
        """Store a memory item in SQLite"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO memory_items 
                (id, content, memory_type, created_at, last_accessed, access_count, 
                 importance_score, tags, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                item.id,
                pickle.dumps(item.content),
                item.memory_type.value,
                item.created_at.isoformat(),
                item.last_accessed.isoformat(),
                item.access_count,
                item.importance_score,
                json.dumps(list(item.tags)),
                json.dumps(item.metadata)
            ))
            
            conn.commit()
            conn.close()
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to store memory item {item.id}: {str(e)}")
            return False
    
    async def retrieve(self, item_id: str) -> Optional[MemoryItem]:
        """Retrieve a memory item by ID"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM memory_items WHERE id = ?', (item_id,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return self._row_to_memory_item(row)
            return None
            
        except Exception as e:
            self.logger.error(f"Failed to retrieve memory item {item_id}: {str(e)}")
            return None
    
    async def search(self, query: Dict[str, Any]) -> List[MemoryItem]:
        """Search for memory items"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Build query
            where_clauses = []
            params = []
            
            if 'memory_type' in query:
                where_clauses.append('memory_type = ?')
                params.append(query['memory_type'])
            
            if 'min_importance' in query:
                where_clauses.append('importance_score >= ?')
                params.append(query['min_importance'])
            
            if 'tags' in query:
                # Simple tag search (can be improved with full-text search)
                for tag in query['tags']:
                    where_clauses.append('tags LIKE ?')
                    params.append(f'%"{tag}"%')
            
            if 'created_after' in query:
                where_clauses.append('created_at > ?')
                params.append(query['created_after'].isoformat())
            
            # Build SQL query
            sql = 'SELECT * FROM memory_items'
            if where_clauses:
                sql += ' WHERE ' + ' AND '.join(where_clauses)
            
            # Add ordering
            sql += ' ORDER BY importance_score DESC, last_accessed DESC'
            
            # Add limit
            limit = query.get('limit', 100)
            sql += f' LIMIT {limit}'
            
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            conn.close()
            
            return [self._row_to_memory_item(row) for row in rows]
            
        except Exception as e:
            self.logger.error(f"Failed to search memory items: {str(e)}")
            return []
    
    async def delete(self, item_id: str) -> bool:
        """Delete a memory item"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM memory_items WHERE id = ?', (item_id,))
            deleted = cursor.rowcount > 0
            
            conn.commit()
            conn.close()
            
            return deleted
            
        except Exception as e:
            self.logger.error(f"Failed to delete memory item {item_id}: {str(e)}")
            return False
    
    async def update(self, item: MemoryItem) -> bool:
        """Update a memory item"""
        return await self.store(item)  # SQLite INSERT OR REPLACE handles updates
    
    def _row_to_memory_item(self, row) -> MemoryItem:
        """Convert database row to MemoryItem"""
        (id, content_blob, memory_type, created_at, last_accessed, 
         access_count, importance_score, tags_json, metadata_json) = row
        
        # Determine specific memory item type
        memory_type_enum = MemoryType(memory_type)
        
        if memory_type_enum == MemoryType.EPISODIC:
            item = EpisodicMemory(
                id=id,
                content=pickle.loads(content_blob),
                created_at=datetime.fromisoformat(created_at),
                last_accessed=datetime.fromisoformat(last_accessed),
                access_count=access_count,
                importance_score=importance_score,
                tags=set(json.loads(tags_json)),
                metadata=json.loads(metadata_json)
            )
        elif memory_type_enum == MemoryType.SEMANTIC:
            item = SemanticMemory(
                id=id,
                content=pickle.loads(content_blob),
                created_at=datetime.fromisoformat(created_at),
                last_accessed=datetime.fromisoformat(last_accessed),
                access_count=access_count,
                importance_score=importance_score,
                tags=set(json.loads(tags_json)),
                metadata=json.loads(metadata_json)
            )
        elif memory_type_enum == MemoryType.WORKING:
            item = WorkingMemory(
                id=id,
                content=pickle.loads(content_blob),
                created_at=datetime.fromisoformat(created_at),
                last_accessed=datetime.fromisoformat(last_accessed),
                access_count=access_count,
                importance_score=importance_score,
                tags=set(json.loads(tags_json)),
                metadata=json.loads(metadata_json)
            )
        else:
            item = MemoryItem(
                id=id,
                content=pickle.loads(content_blob),
                memory_type=memory_type_enum,
                created_at=datetime.fromisoformat(created_at),
                last_accessed=datetime.fromisoformat(last_accessed),
                access_count=access_count,
                importance_score=importance_score,
                tags=set(json.loads(tags_json)),
                metadata=json.loads(metadata_json)
            )
        
        return item


class MemoryRetrieval:
    """Intelligent memory retrieval system"""
    
    def __init__(self, stores: Dict[MemoryType, MemoryStore]):
        self.stores = stores
        self.logger = logging.getLogger("MemoryRetrieval")
        self.retrieval_history: List[Dict[str, Any]] = []
    
    async def retrieve_by_context(self, context: Dict[str, Any], memory_types: Optional[List[MemoryType]] = None) -> List[MemoryItem]:
        """Retrieve memories based on context"""
        if memory_types is None:
            memory_types = list(self.stores.keys())
        
        all_results = []
        
        for memory_type in memory_types:
            if memory_type in self.stores:
                store = self.stores[memory_type]
                
                # Build search query based on context
                query = self._build_context_query(context, memory_type)
                
                # Search store
                results = await store.search(query)
                
                # Update access information
                for item in results:
                    item.last_accessed = datetime.now()
                    item.access_count += 1
                    await store.update(item)
                
                all_results.extend(results)
        
        # Sort by relevance and importance
        all_results.sort(key=lambda x: (x.importance_score, -x.access_count), reverse=True)
        
        # Record retrieval
        retrieval_record = {
            'timestamp': datetime.now().isoformat(),
            'context': context,
            'memory_types': [mt.value for mt in memory_types],
            'results_count': len(all_results)
        }
        self.retrieval_history.append(retrieval_record)
        
        return all_results
    
    async def retrieve_similar(self, reference_item: MemoryItem, similarity_threshold: float = 0.7) -> List[MemoryItem]:
        """Retrieve memories similar to a reference item"""
        store = self.stores.get(reference_item.memory_type)
        if not store:
            return []
        
        # Get all items of the same type
        all_items = await store.search({'memory_type': reference_item.memory_type.value})
        
        # Calculate similarity scores
        similar_items = []
        for item in all_items:
            if item.id != reference_item.id:
                similarity = self._calculate_similarity(reference_item, item)
                if similarity >= similarity_threshold:
                    similar_items.append((item, similarity))
        
        # Sort by similarity
        similar_items.sort(key=lambda x: x[1], reverse=True)
        
        return [item for item, _ in similar_items]
    
    async def retrieve_by_association(self, seed_concepts: List[str], max_depth: int = 3) -> List[MemoryItem]:
        """Retrieve memories through associative connections"""
        visited_concepts = set(seed_concepts)
        current_concepts = set(seed_concepts)
        all_results = []
        
        for depth in range(max_depth):
            if not current_concepts:
                break
            
            # Search for items related to current concepts
            depth_results = []
            
            for memory_type, store in self.stores.items():
                query = {
                    'tags': list(current_concepts),
                    'limit': 50
                }
                
                results = await store.search(query)
                depth_results.extend(results)
            
            # Extract new concepts from results
            new_concepts = set()
            for item in depth_results:
                new_concepts.update(item.tags)
                
                # Extract concepts from content (simplified)
                if isinstance(item.content, str):
                    words = item.content.lower().split()
                    new_concepts.update(word for word in words if len(word) > 3)
            
            # Update for next iteration
            current_concepts = new_concepts - visited_concepts
            visited_concepts.update(new_concepts)
            all_results.extend(depth_results)
        
        # Remove duplicates and sort
        unique_results = {item.id: item for item in all_results}
        sorted_results = list(unique_results.values())
        sorted_results.sort(key=lambda x: x.importance_score, reverse=True)
        
        return sorted_results
    
    def _build_context_query(self, context: Dict[str, Any], memory_type: MemoryType) -> Dict[str, Any]:
        """Build search query from context"""
        query = {'memory_type': memory_type.value}
        
        # Add context-specific filters
        if 'keywords' in context:
            query['tags'] = context['keywords']
        
        if 'time_range' in context:
            time_range = context['time_range']
            if 'start' in time_range:
                query['created_after'] = time_range['start']
        
        if 'importance_threshold' in context:
            query['min_importance'] = context['importance_threshold']
        
        if 'limit' in context:
            query['limit'] = context['limit']
        else:
            query['limit'] = 50
        
        return query
    
    def _calculate_similarity(self, item1: MemoryItem, item2: MemoryItem) -> float:
        """Calculate similarity between two memory items"""
        similarity = 0.0
        
        # Tag overlap
        if item1.tags and item2.tags:
            tag_overlap = len(item1.tags & item2.tags) / len(item1.tags | item2.tags)
            similarity += tag_overlap * 0.4
        
        # Content similarity (simplified - could use embeddings)
        if isinstance(item1.content, str) and isinstance(item2.content, str):
            words1 = set(item1.content.lower().split())
            words2 = set(item2.content.lower().split())
            if words1 and words2:
                word_overlap = len(words1 & words2) / len(words1 | words2)
                similarity += word_overlap * 0.4
        
        # Temporal proximity
        time_diff = abs((item1.created_at - item2.created_at).total_seconds())
        time_similarity = max(0.0, 1.0 - (time_diff / (30 * 24 * 3600)))  # 30 days max
        similarity += time_similarity * 0.2
        
        return min(1.0, similarity)


class MemoryConsolidation:
    """Memory consolidation and management system"""
    
    def __init__(self, stores: Dict[MemoryType, MemoryStore]):
        self.stores = stores
        self.logger = logging.getLogger("MemoryConsolidation")
        self.consolidation_rules = self._load_consolidation_rules()
    
    def _load_consolidation_rules(self) -> Dict[str, Any]:
        """Load memory consolidation rules"""
        return {
            'working_memory_ttl': timedelta(hours=24),
            'importance_threshold_for_longterm': 0.7,
            'access_count_threshold': 5,
            'consolidation_interval': timedelta(hours=6),
            'max_working_memory_items': 1000,
            'forgetting_curve_factor': 0.1
        }
    
    async def consolidate_memories(self) -> Dict[str, int]:
        """Perform memory consolidation"""
        self.logger.info("Starting memory consolidation")
        
        stats = {
            'working_to_episodic': 0,
            'working_to_semantic': 0,
            'expired_removed': 0,
            'duplicates_merged': 0,
            'importance_updated': 0
        }
        
        # Process working memory
        if MemoryType.WORKING in self.stores:
            working_store = self.stores[MemoryType.WORKING]
            
            # Get all working memory items
            working_items = await working_store.search({'memory_type': MemoryType.WORKING.value})
            
            for item in working_items:
                # Check if expired
                if isinstance(item, WorkingMemory) and item.expiry_time and datetime.now() > item.expiry_time:
                    # Decide whether to consolidate or delete
                    if await self._should_consolidate(item):
                        consolidated = await self._consolidate_to_longterm(item)
                        if consolidated:
                            if consolidated.memory_type == MemoryType.EPISODIC:
                                stats['working_to_episodic'] += 1
                            elif consolidated.memory_type == MemoryType.SEMANTIC:
                                stats['working_to_semantic'] += 1
                    
                    # Remove from working memory
                    await working_store.delete(item.id)
                    stats['expired_removed'] += 1
        
        # Update importance scores
        await self._update_importance_scores()
        stats['importance_updated'] = 1
        
        # Merge duplicates
        merged_count = await self._merge_duplicates()
        stats['duplicates_merged'] = merged_count
        
        self.logger.info(f"Memory consolidation completed: {stats}")
        return stats
    
    async def _should_consolidate(self, item: MemoryItem) -> bool:
        """Determine if a memory item should be consolidated to long-term memory"""
        rules = self.consolidation_rules
        
        # Check importance threshold
        if item.importance_score >= rules['importance_threshold_for_longterm']:
            return True
        
        # Check access frequency
        if item.access_count >= rules['access_count_threshold']:
            return True
        
        # Check if it contains valuable information (simplified heuristic)
        if isinstance(item.content, str) and len(item.content) > 100:
            return True
        
        return False
    
    async def _consolidate_to_longterm(self, item: MemoryItem) -> Optional[MemoryItem]:
        """Consolidate a memory item to long-term storage"""
        # Determine target memory type
        if self._is_experiential(item):
            target_type = MemoryType.EPISODIC
            target_store = self.stores.get(MemoryType.EPISODIC)
            
            # Create episodic memory
            consolidated = EpisodicMemory(
                id=f"episodic_{uuid.uuid4().hex[:8]}",
                content=item.content,
                created_at=item.created_at,
                last_accessed=item.last_accessed,
                access_count=item.access_count,
                importance_score=item.importance_score,
                tags=item.tags,
                metadata=item.metadata,
                context=item.metadata.get('context', {}),
                participants=item.metadata.get('participants', []),
                outcome=item.metadata.get('outcome'),
                lessons_learned=item.metadata.get('lessons_learned', [])
            )
        else:
            target_type = MemoryType.SEMANTIC
            target_store = self.stores.get(MemoryType.SEMANTIC)
            
            # Create semantic memory
            consolidated = SemanticMemory(
                id=f"semantic_{uuid.uuid4().hex[:8]}",
                content=item.content,
                created_at=item.created_at,
                last_accessed=item.last_accessed,
                access_count=item.access_count,
                importance_score=item.importance_score,
                tags=item.tags,
                metadata=item.metadata,
                concept=item.metadata.get('concept', ''),
                relationships=item.metadata.get('relationships', {}),
                confidence_score=item.metadata.get('confidence_score', 1.0),
                source=item.metadata.get('source')
            )
        
        if target_store:
            success = await target_store.store(consolidated)
            if success:
                return consolidated
        
        return None
    
    def _is_experiential(self, item: MemoryItem) -> bool:
        """Determine if a memory item represents an experience"""
        # Simple heuristics to classify as experiential
        experiential_indicators = [
            'task_execution', 'user_interaction', 'decision_made',
            'problem_solved', 'error_encountered', 'learning_event'
        ]
        
        return any(indicator in item.metadata.get('type', '') for indicator in experiential_indicators)
    
    async def _update_importance_scores(self):
        """Update importance scores based on access patterns and age"""
        for memory_type, store in self.stores.items():
            if memory_type == MemoryType.WORKING:
                continue  # Skip working memory
            
            items = await store.search({'memory_type': memory_type.value, 'limit': 1000})
            
            for item in items:
                # Calculate new importance score
                new_score = self._calculate_importance(item)
                
                if abs(new_score - item.importance_score) > 0.1:
                    item.importance_score = new_score
                    await store.update(item)
    
    def _calculate_importance(self, item: MemoryItem) -> float:
        """Calculate importance score for a memory item"""
        base_score = 0.5
        
        # Access frequency factor
        access_factor = min(1.0, item.access_count / 10.0) * 0.3
        
        # Recency factor
        days_old = (datetime.now() - item.last_accessed).days
        recency_factor = max(0.0, 1.0 - (days_old / 365.0)) * 0.2
        
        # Content richness factor
        content_factor = 0.0
        if isinstance(item.content, str):
            content_factor = min(1.0, len(item.content) / 1000.0) * 0.2
        
        # Tag richness factor
        tag_factor = min(1.0, len(item.tags) / 10.0) * 0.1
        
        # Metadata richness factor
        metadata_factor = min(1.0, len(item.metadata) / 5.0) * 0.2
        
        total_score = base_score + access_factor + recency_factor + content_factor + tag_factor + metadata_factor
        return min(1.0, total_score)
    
    async def _merge_duplicates(self) -> int:
        """Merge duplicate memory items"""
        merged_count = 0
        
        for memory_type, store in self.stores.items():
            items = await store.search({'memory_type': memory_type.value, 'limit': 1000})
            
            # Group items by content hash
            content_groups = defaultdict(list)
            for item in items:
                content_hash = hashlib.md5(str(item.content).encode()).hexdigest()
                content_groups[content_hash].append(item)
            
            # Merge groups with multiple items
            for content_hash, group in content_groups.items():
                if len(group) > 1:
                    # Keep the item with highest importance
                    group.sort(key=lambda x: x.importance_score, reverse=True)
                    primary_item = group[0]
                    
                    # Merge information from duplicates
                    for duplicate in group[1:]:
                        primary_item.access_count += duplicate.access_count
                        primary_item.tags.update(duplicate.tags)
                        primary_item.metadata.update(duplicate.metadata)
                        
                        # Update last accessed to most recent
                        if duplicate.last_accessed > primary_item.last_accessed:
                            primary_item.last_accessed = duplicate.last_accessed
                        
                        # Delete duplicate
                        await store.delete(duplicate.id)
                        merged_count += 1
                    
                    # Update primary item
                    await store.update(primary_item)
        
        return merged_count


class MemorySystem:
    """Main memory management system"""
    
    def __init__(self, data_dir: str = "data/memory"):
        self.logger = logging.getLogger("MemorySystem")
        self.data_dir = data_dir
        
        # Initialize memory stores
        self.stores = {
            MemoryType.WORKING: SQLiteMemoryStore(MemoryType.WORKING, f"{data_dir}/working.db"),
            MemoryType.EPISODIC: SQLiteMemoryStore(MemoryType.EPISODIC, f"{data_dir}/episodic.db"),
            MemoryType.SEMANTIC: SQLiteMemoryStore(MemoryType.SEMANTIC, f"{data_dir}/semantic.db")
        }
        
        # Initialize subsystems
        self.retrieval = MemoryRetrieval(self.stores)
        self.consolidation = MemoryConsolidation(self.stores)
        
        # Start background tasks
        self._consolidation_task = None
        self._start_background_tasks()
    
    def _start_background_tasks(self):
        """Start background memory management tasks"""
        async def consolidation_loop():
            while True:
                try:
                    await asyncio.sleep(6 * 3600)  # Every 6 hours
                    await self.consolidation.consolidate_memories()
                except Exception as e:
                    self.logger.error(f"Consolidation error: {str(e)}")
        
        self._consolidation_task = asyncio.create_task(consolidation_loop())
    
    async def store_memory(self, content: Any, memory_type: MemoryType, **kwargs) -> str:
        """Store a new memory item"""
        # Create appropriate memory item
        item_id = f"{memory_type.value}_{uuid.uuid4().hex[:8]}"
        
        if memory_type == MemoryType.WORKING:
            item = WorkingMemory(
                id=item_id,
                content=content,
                task_id=kwargs.get('task_id'),
                expiry_time=kwargs.get('expiry_time'),
                priority=kwargs.get('priority', 5),
                importance_score=kwargs.get('importance_score', 0.5),
                tags=set(kwargs.get('tags', [])),
                metadata=kwargs.get('metadata', {})
            )
        elif memory_type == MemoryType.EPISODIC:
            item = EpisodicMemory(
                id=item_id,
                content=content,
                context=kwargs.get('context', {}),
                participants=kwargs.get('participants', []),
                outcome=kwargs.get('outcome'),
                lessons_learned=kwargs.get('lessons_learned', []),
                importance_score=kwargs.get('importance_score', 0.5),
                tags=set(kwargs.get('tags', [])),
                metadata=kwargs.get('metadata', {})
            )
        elif memory_type == MemoryType.SEMANTIC:
            item = SemanticMemory(
                id=item_id,
                content=content,
                concept=kwargs.get('concept', ''),
                relationships=kwargs.get('relationships', {}),
                confidence_score=kwargs.get('confidence_score', 1.0),
                source=kwargs.get('source'),
                importance_score=kwargs.get('importance_score', 0.5),
                tags=set(kwargs.get('tags', [])),
                metadata=kwargs.get('metadata', {})
            )
        else:
            item = MemoryItem(
                id=item_id,
                content=content,
                memory_type=memory_type,
                importance_score=kwargs.get('importance_score', 0.5),
                tags=set(kwargs.get('tags', [])),
                metadata=kwargs.get('metadata', {})
            )
        
        # Store in appropriate store
        store = self.stores.get(memory_type)
        if store:
            success = await store.store(item)
            if success:
                self.logger.info(f"Stored memory item: {item_id}")
                return item_id
        
        self.logger.error(f"Failed to store memory item: {item_id}")
        return ""
    
    async def retrieve_memory(self, item_id: str) -> Optional[MemoryItem]:
        """Retrieve a specific memory item"""
        for store in self.stores.values():
            item = await store.retrieve(item_id)
            if item:
                return item
        return None
    
    async def search_memories(self, query: Dict[str, Any]) -> List[MemoryItem]:
        """Search for memories across all stores"""
        all_results = []
        
        memory_types = query.get('memory_types', list(self.stores.keys()))
        
        for memory_type in memory_types:
            if memory_type in self.stores:
                store = self.stores[memory_type]
                results = await store.search(query)
                all_results.extend(results)
        
        # Sort by importance and recency
        all_results.sort(key=lambda x: (x.importance_score, x.last_accessed), reverse=True)
        
        # Apply global limit
        limit = query.get('limit', 100)
        return all_results[:limit]
    
    async def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory system statistics"""
        stats = {}
        
        for memory_type, store in self.stores.items():
            items = await store.search({'memory_type': memory_type.value, 'limit': 10000})
            
            stats[memory_type.value] = {
                'total_items': len(items),
                'average_importance': sum(item.importance_score for item in items) / max(len(items), 1),
                'total_access_count': sum(item.access_count for item in items),
                'oldest_item': min(items, key=lambda x: x.created_at).created_at.isoformat() if items else None,
                'newest_item': max(items, key=lambda x: x.created_at).created_at.isoformat() if items else None
            }
        
        return stats
    
    async def cleanup(self):
        """Cleanup memory system"""
        if self._consolidation_task:
            self._consolidation_task.cancel()


# Example usage and testing
if __name__ == "__main__":
    async def test_memory_system():
        """Test the memory system"""
        import os
        os.makedirs("data/memory", exist_ok=True)
        
        system = MemorySystem()
        
        # Test storing different types of memories
        working_id = await system.store_memory(
            "Current task: Research AI architectures",
            MemoryType.WORKING,
            task_id="task_123",
            tags=["research", "AI", "current"],
            importance_score=0.8
        )
        
        episodic_id = await system.store_memory(
            "Successfully completed research on AI agent frameworks",
            MemoryType.EPISODIC,
            context={"task_type": "research", "duration": 3600},
            outcome="success",
            lessons_learned=["Multi-agent systems are effective", "Tool selection is critical"],
            tags=["research", "success", "learning"],
            importance_score=0.9
        )
        
        semantic_id = await system.store_memory(
            "AI agents use decision-making frameworks with multiple levels",
            MemoryType.SEMANTIC,
            concept="AI decision-making",
            relationships={"related_to": ["AI agents", "frameworks"]},
            tags=["AI", "decision-making", "knowledge"],
            importance_score=0.7
        )
        
        print(f"Stored memories: {working_id}, {episodic_id}, {semantic_id}")
        
        # Test retrieval
        retrieved = await system.retrieve_memory(episodic_id)
        if retrieved:
            print(f"Retrieved memory: {retrieved.content}")
        
        # Test search
        search_results = await system.search_memories({
            'tags': ['AI'],
            'min_importance': 0.6,
            'limit': 10
        })
        
        print(f"Search results: {len(search_results)} items found")
        for item in search_results:
            print(f"- {item.content[:50]}... (importance: {item.importance_score})")
        
        # Test memory stats
        stats = await system.get_memory_stats()
        print(f"Memory stats: {json.dumps(stats, indent=2)}")
        
        # Cleanup
        await system.cleanup()
    
    # Run test
    asyncio.run(test_memory_system())

