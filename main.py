"""
AI Desktop System - Main Integration Module

This module integrates all core systems and provides a unified interface
for the AI desktop system.

Author: Manus AI
Date: June 17, 2025
"""

import asyncio
import logging
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import json

# Import core systems
from core.decision_engine.decision_engine import DecisionEngine, TaskStatus
from core.research_system.research_system import ResearchSystem
from core.tool_management.tool_manager import ToolManager
from core.memory_system.memory_system import MemorySystem, MemoryType
from core.learning_system.learning_system import LearningSystem, FeedbackType


class AIDesktopSystem:
    """Main AI Desktop System that integrates all components"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or self._load_default_config()
        self.logger = self._setup_logging()
        
        # Initialize core systems
        self.decision_engine = DecisionEngine()
        self.research_system = ResearchSystem()
        self.tool_manager = ToolManager()
        self.memory_system = MemorySystem(self.config.get('memory_data_dir', 'data/memory'))
        self.learning_system = LearningSystem()
        
        # System state
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
        self.system_metrics = {
            'total_requests': 0,
            'successful_requests': 0,
            'average_response_time': 0.0,
            'uptime_start': datetime.now()
        }
        
        self.logger.info("AI Desktop System initialized")
    
    def _load_default_config(self) -> Dict[str, Any]:
        """Load default system configuration"""
        return {
            'memory_data_dir': 'data/memory',
            'log_level': 'INFO',
            'max_concurrent_tasks': 10,
            'default_task_timeout': 300,  # 5 minutes
            'learning_enabled': True,
            'auto_consolidation': True
        }
    
    def _setup_logging(self) -> logging.Logger:
        """Setup system logging"""
        log_level = getattr(logging, self.config.get('log_level', 'INFO'))
        
        logging.basicConfig(
            level=log_level,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.StreamHandler(),
                logging.FileHandler('ai_desktop_system.log')
            ]
        )
        
        return logging.getLogger("AIDesktopSystem")
    
    async def process_user_request(self, user_request: str, session_id: Optional[str] = None, 
                                 context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Process a user request through the complete AI system"""
        start_time = datetime.now()
        request_id = f"req_{int(start_time.timestamp())}_{hash(user_request) % 10000}"
        
        self.logger.info(f"Processing request {request_id}: {user_request[:100]}...")
        
        try:
            # Update metrics
            self.system_metrics['total_requests'] += 1
            
            # Create or get session
            if not session_id:
                session_id = f"session_{int(start_time.timestamp())}"
            
            if session_id not in self.active_sessions:
                self.active_sessions[session_id] = {
                    'created_at': start_time,
                    'request_count': 0,
                    'context_history': []
                }
            
            session = self.active_sessions[session_id]
            session['request_count'] += 1
            
            # Prepare context with memory and session history
            enhanced_context = await self._prepare_context(user_request, session, context or {})
            
            # Decision making phase
            decision_result = await self.decision_engine.process_request(user_request, enhanced_context)
            
            # Execute tasks
            execution_results = await self._execute_tasks(decision_result['task_details'], session_id)
            
            # Store experience in memory
            await self._store_experience(user_request, decision_result, execution_results, session_id)
            
            # Learn from experience
            if self.config.get('learning_enabled', True):
                await self._record_learning_experience(user_request, enhanced_context, execution_results)
            
            # Prepare response
            response = await self._prepare_response(user_request, decision_result, execution_results)
            
            # Update session
            session['context_history'].append({
                'request': user_request,
                'response': response,
                'timestamp': start_time.isoformat()
            })
            
            # Keep only last 10 interactions in session
            if len(session['context_history']) > 10:
                session['context_history'] = session['context_history'][-10:]
            
            # Update metrics
            execution_time = (datetime.now() - start_time).total_seconds()
            self.system_metrics['successful_requests'] += 1
            self._update_average_response_time(execution_time)
            
            response['metadata'] = {
                'request_id': request_id,
                'session_id': session_id,
                'execution_time': execution_time,
                'tasks_created': decision_result['tasks_created']
            }
            
            self.logger.info(f"Request {request_id} completed successfully in {execution_time:.2f}s")
            return response
            
        except Exception as e:
            self.logger.error(f"Request {request_id} failed: {str(e)}")
            
            # Record failure for learning
            if self.config.get('learning_enabled', True):
                await self._record_failure_experience(user_request, str(e))
            
            return {
                'success': False,
                'error': str(e),
                'message': "I encountered an error while processing your request. Please try again or rephrase your request.",
                'metadata': {
                    'request_id': request_id,
                    'session_id': session_id,
                    'execution_time': (datetime.now() - start_time).total_seconds()
                }
            }
    
    async def _prepare_context(self, user_request: str, session: Dict[str, Any], 
                             base_context: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare enhanced context with memory and session information"""
        context = base_context.copy()
        
        # Add session context
        context['session_info'] = {
            'session_age': (datetime.now() - session['created_at']).total_seconds(),
            'request_count': session['request_count'],
            'recent_interactions': session['context_history'][-3:]  # Last 3 interactions
        }
        
        # Retrieve relevant memories
        memory_query = {
            'keywords': self._extract_keywords(user_request),
            'memory_types': [MemoryType.SEMANTIC, MemoryType.EPISODIC],
            'limit': 10,
            'min_importance': 0.6
        }
        
        relevant_memories = await self.memory_system.search_memories(memory_query)
        context['relevant_memories'] = [memory.to_dict() for memory in relevant_memories]
        
        # Get learning predictions
        learning_prediction = await self.learning_system.predict_best_action({
            'user_request': user_request,
            'session_context': context['session_info']
        })
        
        if learning_prediction:
            context['learning_suggestion'] = learning_prediction
        
        return context
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text (simplified implementation)"""
        # Simple keyword extraction - in practice, use NLP libraries
        words = text.lower().split()
        
        # Filter out common words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'}
        
        keywords = [word for word in words if len(word) > 3 and word not in stop_words]
        
        return keywords[:10]  # Limit to 10 keywords
    
    async def _execute_tasks(self, tasks: List[Dict[str, Any]], session_id: str) -> List[Dict[str, Any]]:
        """Execute the tasks created by the decision engine"""
        execution_results = []
        
        for task in tasks:
            task_id = task['id']
            task_level = task['level']
            
            self.logger.info(f"Executing {task_level} task: {task_id}")
            
            try:
                if task_level == 'operational':
                    # Execute operational tasks using tool manager
                    result = await self._execute_operational_task(task)
                elif task_level == 'tactical':
                    # Execute tactical tasks (coordination)
                    result = await self._execute_tactical_task(task)
                elif task_level == 'strategic':
                    # Execute strategic tasks (planning)
                    result = await self._execute_strategic_task(task)
                else:
                    result = {'success': False, 'error': f'Unknown task level: {task_level}'}
                
                # Update task status in decision engine
                if result['success']:
                    await self.decision_engine.update_task_status(task_id, TaskStatus.COMPLETED, result)
                else:
                    await self.decision_engine.update_task_status(task_id, TaskStatus.FAILED, result)
                
                execution_results.append({
                    'task_id': task_id,
                    'task_level': task_level,
                    'result': result
                })
                
            except Exception as e:
                self.logger.error(f"Task {task_id} execution failed: {str(e)}")
                
                await self.decision_engine.update_task_status(task_id, TaskStatus.FAILED, {'error': str(e)})
                
                execution_results.append({
                    'task_id': task_id,
                    'task_level': task_level,
                    'result': {'success': False, 'error': str(e)}
                })
        
        return execution_results
    
    async def _execute_operational_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute an operational task using appropriate tools"""
        task_context = task.get('context', {})
        tool_type = task_context.get('tool_type', 'unknown')
        
        if tool_type == 'search':
            # Use research system for search tasks
            query = task.get('description', '').replace('Execute search for: ', '')
            
            try:
                report = await self.research_system.conduct_research(
                    query,
                    depth_level=2,
                    time_limit=60
                )
                
                return {
                    'success': True,
                    'result': {
                        'type': 'research_report',
                        'report_id': report.id,
                        'synthesis': report.synthesis,
                        'confidence': report.confidence_score,
                        'sources_count': len(report.sources_used)
                    },
                    'execution_time': report.research_duration
                }
                
            except Exception as e:
                return {'success': False, 'error': str(e)}
        
        elif tool_type in ['analyze', 'extract', 'combine', 'generate', 'format']:
            # Use tool manager for other operational tasks
            requirements = {
                'capability': tool_type,
                'performance_priority': 'balanced'
            }
            
            # Extract parameters from task description
            parameters = self._extract_task_parameters(task)
            
            result = await self.tool_manager.select_and_execute(requirements, **parameters)
            
            return {
                'success': result.success,
                'result': result.result if result.success else None,
                'error': result.error if not result.success else None,
                'execution_time': result.execution_time
            }
        
        else:
            return {
                'success': False,
                'error': f'Unknown tool type: {tool_type}'
            }
    
    async def _execute_tactical_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a tactical task (coordination and planning)"""
        # Tactical tasks are mostly coordination - they succeed when their subtasks are created
        return {
            'success': True,
            'result': {
                'type': 'coordination',
                'message': f'Tactical coordination completed for: {task["description"]}',
                'subtasks_created': len(task.get('subtasks', []))
            },
            'execution_time': 0.1
        }
    
    async def _execute_strategic_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a strategic task (high-level planning)"""
        # Strategic tasks are mostly planning - they succeed when their strategy is developed
        return {
            'success': True,
            'result': {
                'type': 'strategic_planning',
                'message': f'Strategic planning completed for: {task["description"]}',
                'strategy': task.get('context', {}).get('strategy', {}),
                'subtasks_created': len(task.get('subtasks', []))
            },
            'execution_time': 0.2
        }
    
    def _extract_task_parameters(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Extract parameters from task description (simplified)"""
        # This is a simplified parameter extraction
        # In practice, use NLP to extract structured parameters
        
        description = task.get('description', '')
        parameters = {}
        
        # Extract common parameters
        if 'text' in description.lower():
            parameters['text'] = description
        
        if 'query' in description.lower():
            parameters['query'] = description.replace('Execute search for: ', '')
        
        return parameters
    
    async def _store_experience(self, user_request: str, decision_result: Dict[str, Any], 
                               execution_results: List[Dict[str, Any]], session_id: str):
        """Store the experience in memory system"""
        # Store as episodic memory
        experience_content = {
            'user_request': user_request,
            'decision_summary': {
                'tasks_created': decision_result['tasks_created'],
                'strategic_tasks': decision_result['strategic_tasks'],
                'tactical_tasks': decision_result['tactical_tasks'],
                'operational_tasks': decision_result['operational_tasks']
            },
            'execution_summary': {
                'total_tasks': len(execution_results),
                'successful_tasks': sum(1 for r in execution_results if r['result']['success']),
                'failed_tasks': sum(1 for r in execution_results if not r['result']['success'])
            }
        }
        
        # Calculate importance based on success and complexity
        success_rate = experience_content['execution_summary']['successful_tasks'] / max(len(execution_results), 1)
        complexity = decision_result['tasks_created']
        importance = (success_rate * 0.6 + min(complexity / 10.0, 1.0) * 0.4)
        
        await self.memory_system.store_memory(
            content=experience_content,
            memory_type=MemoryType.EPISODIC,
            context={'session_id': session_id, 'request_type': 'user_interaction'},
            outcome='success' if success_rate > 0.5 else 'partial_success',
            lessons_learned=self._extract_lessons(execution_results),
            importance_score=importance,
            tags=set(self._extract_keywords(user_request) + ['user_interaction', 'experience'])
        )
    
    def _extract_lessons(self, execution_results: List[Dict[str, Any]]) -> List[str]:
        """Extract lessons learned from execution results"""
        lessons = []
        
        # Analyze failures
        failed_tasks = [r for r in execution_results if not r['result']['success']]
        if failed_tasks:
            lessons.append(f"Failed tasks: {len(failed_tasks)} out of {len(execution_results)}")
            
            # Common failure patterns
            error_types = [r['result'].get('error', 'unknown') for r in failed_tasks]
            if error_types:
                lessons.append(f"Common errors: {', '.join(set(error_types))}")
        
        # Analyze performance
        execution_times = [r['result'].get('execution_time', 0) for r in execution_results if r['result']['success']]
        if execution_times:
            avg_time = sum(execution_times) / len(execution_times)
            if avg_time > 10:
                lessons.append("Tasks took longer than expected - consider optimization")
            elif avg_time < 1:
                lessons.append("Tasks completed quickly - good performance")
        
        return lessons
    
    async def _record_learning_experience(self, user_request: str, context: Dict[str, Any], 
                                        execution_results: List[Dict[str, Any]]):
        """Record experience for learning system"""
        # Calculate overall success
        successful_tasks = sum(1 for r in execution_results if r['result']['success'])
        total_tasks = len(execution_results)
        success_rate = successful_tasks / max(total_tasks, 1)
        
        # Calculate average execution time
        execution_times = [r['result'].get('execution_time', 0) for r in execution_results]
        avg_execution_time = sum(execution_times) / max(len(execution_times), 1)
        
        # Record learning event
        await self.learning_system.record_learning_event(
            event_type="user_request_processing",
            context={
                'user_request_type': self._classify_request_type(user_request),
                'context_complexity': len(context),
                'has_session_history': len(context.get('session_info', {}).get('recent_interactions', [])) > 0,
                'memory_available': len(context.get('relevant_memories', [])) > 0
            },
            action_taken={
                'type': 'multi_level_decision_making',
                'parameters': {
                    'tasks_created': total_tasks,
                    'decision_approach': 'hierarchical'
                }
            },
            outcome={
                'success': success_rate > 0.7,
                'success_rate': success_rate,
                'execution_time': avg_execution_time,
                'quality_score': success_rate  # Simplified quality metric
            }
        )
    
    def _classify_request_type(self, user_request: str) -> str:
        """Classify the type of user request"""
        request_lower = user_request.lower()
        
        if any(word in request_lower for word in ['research', 'find', 'search', 'investigate']):
            return 'research'
        elif any(word in request_lower for word in ['analyze', 'examine', 'study', 'evaluate']):
            return 'analysis'
        elif any(word in request_lower for word in ['create', 'generate', 'build', 'make']):
            return 'creation'
        elif any(word in request_lower for word in ['explain', 'describe', 'tell', 'what']):
            return 'explanation'
        else:
            return 'general'
    
    async def _record_failure_experience(self, user_request: str, error: str):
        """Record failure experience for learning"""
        await self.learning_system.record_learning_event(
            event_type="system_failure",
            context={
                'user_request_type': self._classify_request_type(user_request),
                'error_type': type(error).__name__
            },
            action_taken={
                'type': 'error_handling',
                'parameters': {'error_message': error}
            },
            outcome={
                'success': False,
                'execution_time': 0,
                'quality_score': 0.0
            }
        )
    
    async def _prepare_response(self, user_request: str, decision_result: Dict[str, Any], 
                               execution_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Prepare the final response to the user"""
        successful_results = [r for r in execution_results if r['result']['success']]
        failed_results = [r for r in execution_results if not r['result']['success']]
        
        response = {
            'success': len(successful_results) > 0,
            'message': '',
            'results': [],
            'summary': {
                'total_tasks': len(execution_results),
                'successful_tasks': len(successful_results),
                'failed_tasks': len(failed_results)
            }
        }
        
        # Compile results
        for result in successful_results:
            if result['result'].get('type') == 'research_report':
                response['results'].append({
                    'type': 'research',
                    'content': result['result']['synthesis'],
                    'confidence': result['result']['confidence'],
                    'sources': result['result']['sources_count']
                })
            else:
                response['results'].append({
                    'type': 'tool_output',
                    'content': result['result'].get('result', 'Task completed successfully'),
                    'tool_used': result['task_level']
                })
        
        # Generate response message
        if response['success']:
            if len(successful_results) == len(execution_results):
                response['message'] = f"I've successfully completed your request. Here are the results:"
            else:
                response['message'] = f"I've partially completed your request. {len(successful_results)} out of {len(execution_results)} tasks succeeded."
        else:
            response['message'] = "I encountered difficulties processing your request. Please try rephrasing or providing more specific details."
        
        return response
    
    def _update_average_response_time(self, execution_time: float):
        """Update average response time metric"""
        current_avg = self.system_metrics['average_response_time']
        total_requests = self.system_metrics['successful_requests']
        
        if total_requests == 1:
            self.system_metrics['average_response_time'] = execution_time
        else:
            # Exponential moving average
            alpha = 0.1
            self.system_metrics['average_response_time'] = (1 - alpha) * current_avg + alpha * execution_time
    
    async def provide_feedback(self, request_id: str, feedback_type: str, feedback_data: Optional[Dict[str, Any]] = None):
        """Provide feedback on a previous request"""
        # Convert feedback type
        try:
            fb_type = FeedbackType(feedback_type.lower())
        except ValueError:
            fb_type = FeedbackType.NEUTRAL
        
        # Find the learning event (simplified - in practice, maintain request-to-event mapping)
        await self.learning_system.provide_feedback(request_id, fb_type, feedback_data)
        
        self.logger.info(f"Received feedback for request {request_id}: {feedback_type}")
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        uptime = (datetime.now() - self.system_metrics['uptime_start']).total_seconds()
        
        status = {
            'system_health': 'healthy',
            'uptime_seconds': uptime,
            'metrics': self.system_metrics.copy(),
            'active_sessions': len(self.active_sessions),
            'components': {
                'decision_engine': 'active',
                'research_system': 'active',
                'tool_manager': 'active',
                'memory_system': 'active',
                'learning_system': 'active'
            }
        }
        
        # Add component-specific stats
        status['learning_stats'] = self.learning_system.get_learning_stats()
        
        return status
    
    async def cleanup(self):
        """Cleanup system resources"""
        self.logger.info("Shutting down AI Desktop System")
        
        # Cleanup memory system
        await self.memory_system.cleanup()
        
        # Clear active sessions
        self.active_sessions.clear()
        
        self.logger.info("AI Desktop System shutdown complete")


# Example usage and testing
if __name__ == "__main__":
    async def test_ai_desktop_system():
        """Test the complete AI desktop system"""
        # Create data directory
        os.makedirs("data/memory", exist_ok=True)
        
        # Initialize system
        system = AIDesktopSystem()
        
        # Test requests
        test_requests = [
            "Research the latest developments in AI agent architectures",
            "Analyze the benefits of multi-agent systems",
            "Create a summary of machine learning trends"
        ]
        
        session_id = "test_session_001"
        
        for i, request in enumerate(test_requests):
            print(f"\n--- Processing Request {i+1} ---")
            print(f"Request: {request}")
            
            response = await system.process_user_request(request, session_id)
            
            print(f"Success: {response['success']}")
            print(f"Message: {response['message']}")
            
            if response['success'] and response['results']:
                for j, result in enumerate(response['results']):
                    print(f"Result {j+1}: {result['content'][:100]}...")
            
            # Provide feedback
            if response['success']:
                await system.provide_feedback(
                    response['metadata']['request_id'], 
                    'positive',
                    {'user_satisfaction': 0.9}
                )
        
        # Get system status
        status = system.get_system_status()
        print(f"\n--- System Status ---")
        print(f"Uptime: {status['uptime_seconds']:.1f} seconds")
        print(f"Total requests: {status['metrics']['total_requests']}")
        print(f"Success rate: {status['metrics']['successful_requests'] / status['metrics']['total_requests']:.2%}")
        print(f"Average response time: {status['metrics']['average_response_time']:.2f} seconds")
        
        # Cleanup
        await system.cleanup()
    
    # Run test
    asyncio.run(test_ai_desktop_system())

