"""
AI Desktop System - Core Decision Engine

This module implements the multi-level decision-making framework that serves as the
cognitive core of the AI system. It handles strategic planning, tactical coordination,
and operational execution while maintaining contextual awareness.

Author: Manus AI
Date: June 17, 2025
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Any, Callable
from datetime import datetime
import json


class DecisionLevel(Enum):
    """Enumeration of decision-making levels"""
    STRATEGIC = "strategic"
    TACTICAL = "tactical"
    OPERATIONAL = "operational"


class TaskStatus(Enum):
    """Enumeration of task statuses"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class Task:
    """Represents a task in the system"""
    id: str
    description: str
    level: DecisionLevel
    priority: int = 5  # 1-10 scale
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    parent_task_id: Optional[str] = None
    subtasks: List[str] = field(default_factory=list)
    context: Dict[str, Any] = field(default_factory=dict)
    results: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert task to dictionary representation"""
        return {
            'id': self.id,
            'description': self.description,
            'level': self.level.value,
            'priority': self.priority,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'parent_task_id': self.parent_task_id,
            'subtasks': self.subtasks,
            'context': self.context,
            'results': self.results
        }


@dataclass
class DecisionContext:
    """Context information for decision making"""
    user_objectives: List[str]
    available_resources: Dict[str, Any]
    constraints: Dict[str, Any]
    environmental_factors: Dict[str, Any]
    current_tasks: List[Task]
    historical_data: Dict[str, Any]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert context to dictionary representation"""
        return {
            'user_objectives': self.user_objectives,
            'available_resources': self.available_resources,
            'constraints': self.constraints,
            'environmental_factors': self.environmental_factors,
            'current_tasks': [task.to_dict() for task in self.current_tasks],
            'historical_data': self.historical_data
        }


class DecisionMaker(ABC):
    """Abstract base class for decision makers"""
    
    def __init__(self, level: DecisionLevel):
        self.level = level
        self.logger = logging.getLogger(f"DecisionMaker.{level.value}")
    
    @abstractmethod
    async def make_decision(self, context: DecisionContext) -> List[Task]:
        """Make decisions based on the provided context"""
        pass
    
    @abstractmethod
    async def evaluate_options(self, options: List[Dict[str, Any]], context: DecisionContext) -> Dict[str, float]:
        """Evaluate decision options and return scores"""
        pass


class StrategicDecisionMaker(DecisionMaker):
    """Implements strategic-level decision making"""
    
    def __init__(self):
        super().__init__(DecisionLevel.STRATEGIC)
        self.strategy_templates = self._load_strategy_templates()
    
    def _load_strategy_templates(self) -> Dict[str, Any]:
        """Load strategy templates for common scenarios"""
        return {
            'research_task': {
                'phases': ['analysis', 'information_gathering', 'synthesis'],
                'resource_allocation': {'time': 0.6, 'tools': 0.8, 'memory': 0.4}
            },
            'problem_solving': {
                'phases': ['problem_definition', 'solution_generation', 'evaluation', 'implementation'],
                'resource_allocation': {'time': 0.8, 'tools': 0.6, 'memory': 0.5}
            },
            'creative_task': {
                'phases': ['inspiration', 'ideation', 'development', 'refinement'],
                'resource_allocation': {'time': 0.7, 'tools': 0.5, 'memory': 0.3}
            }
        }
    
    async def make_decision(self, context: DecisionContext) -> List[Task]:
        """Make strategic decisions based on user objectives and context"""
        self.logger.info("Making strategic decisions")
        
        strategic_tasks = []
        
        for objective in context.user_objectives:
            # Analyze objective and determine strategy
            strategy_type = await self._classify_objective(objective)
            strategy = self.strategy_templates.get(strategy_type, self.strategy_templates['problem_solving'])
            
            # Create strategic task
            task = Task(
                id=f"strategic_{len(strategic_tasks)}_{datetime.now().timestamp()}",
                description=f"Strategic planning for: {objective}",
                level=DecisionLevel.STRATEGIC,
                priority=self._calculate_priority(objective, context),
                context={
                    'objective': objective,
                    'strategy_type': strategy_type,
                    'strategy': strategy,
                    'resource_requirements': strategy['resource_allocation']
                }
            )
            
            strategic_tasks.append(task)
        
        return strategic_tasks
    
    async def _classify_objective(self, objective: str) -> str:
        """Classify objective to determine appropriate strategy"""
        # Simple keyword-based classification (in real implementation, use NLP)
        objective_lower = objective.lower()
        
        if any(word in objective_lower for word in ['research', 'find', 'investigate', 'analyze']):
            return 'research_task'
        elif any(word in objective_lower for word in ['create', 'generate', 'design', 'build']):
            return 'creative_task'
        else:
            return 'problem_solving'
    
    def _calculate_priority(self, objective: str, context: DecisionContext) -> int:
        """Calculate priority for an objective"""
        # Simple priority calculation (can be enhanced with ML)
        base_priority = 5
        
        # Increase priority for urgent keywords
        if any(word in objective.lower() for word in ['urgent', 'immediate', 'asap']):
            base_priority += 3
        
        # Adjust based on resource availability
        if context.available_resources.get('time', 1.0) < 0.5:
            base_priority += 1
        
        return min(10, max(1, base_priority))
    
    async def evaluate_options(self, options: List[Dict[str, Any]], context: DecisionContext) -> Dict[str, float]:
        """Evaluate strategic options"""
        scores = {}
        
        for i, option in enumerate(options):
            score = 0.0
            
            # Evaluate based on resource efficiency
            resource_efficiency = option.get('resource_efficiency', 0.5)
            score += resource_efficiency * 0.3
            
            # Evaluate based on success probability
            success_probability = option.get('success_probability', 0.5)
            score += success_probability * 0.4
            
            # Evaluate based on alignment with objectives
            alignment = option.get('objective_alignment', 0.5)
            score += alignment * 0.3
            
            scores[f"option_{i}"] = score
        
        return scores


class TacticalDecisionMaker(DecisionMaker):
    """Implements tactical-level decision making"""
    
    def __init__(self):
        super().__init__(DecisionLevel.TACTICAL)
        self.decomposition_strategies = self._load_decomposition_strategies()
    
    def _load_decomposition_strategies(self) -> Dict[str, Any]:
        """Load task decomposition strategies"""
        return {
            'sequential': {
                'description': 'Tasks must be completed in order',
                'parallelization': False
            },
            'parallel': {
                'description': 'Tasks can be completed simultaneously',
                'parallelization': True
            },
            'hierarchical': {
                'description': 'Tasks have dependencies and sub-tasks',
                'parallelization': 'partial'
            }
        }
    
    async def make_decision(self, context: DecisionContext) -> List[Task]:
        """Make tactical decisions by decomposing strategic tasks"""
        self.logger.info("Making tactical decisions")
        
        tactical_tasks = []
        
        # Find strategic tasks that need tactical decomposition
        strategic_tasks = [task for task in context.current_tasks 
                         if task.level == DecisionLevel.STRATEGIC and task.status == TaskStatus.PENDING]
        
        for strategic_task in strategic_tasks:
            subtasks = await self._decompose_task(strategic_task, context)
            tactical_tasks.extend(subtasks)
            
            # Update strategic task with subtask references
            strategic_task.subtasks = [task.id for task in subtasks]
            strategic_task.status = TaskStatus.IN_PROGRESS
        
        return tactical_tasks
    
    async def _decompose_task(self, strategic_task: Task, context: DecisionContext) -> List[Task]:
        """Decompose a strategic task into tactical subtasks"""
        strategy = strategic_task.context.get('strategy', {})
        phases = strategy.get('phases', ['execution'])
        
        subtasks = []
        
        for i, phase in enumerate(phases):
            task = Task(
                id=f"tactical_{strategic_task.id}_{i}_{datetime.now().timestamp()}",
                description=f"{phase.title()} phase for: {strategic_task.description}",
                level=DecisionLevel.TACTICAL,
                priority=strategic_task.priority,
                parent_task_id=strategic_task.id,
                context={
                    'phase': phase,
                    'strategic_context': strategic_task.context,
                    'sequence_order': i
                }
            )
            subtasks.append(task)
        
        return subtasks
    
    async def evaluate_options(self, options: List[Dict[str, Any]], context: DecisionContext) -> Dict[str, float]:
        """Evaluate tactical options"""
        scores = {}
        
        for i, option in enumerate(options):
            score = 0.0
            
            # Evaluate based on execution efficiency
            efficiency = option.get('execution_efficiency', 0.5)
            score += efficiency * 0.4
            
            # Evaluate based on resource requirements
            resource_fit = option.get('resource_fit', 0.5)
            score += resource_fit * 0.3
            
            # Evaluate based on risk level
            risk_level = option.get('risk_level', 0.5)
            score += (1.0 - risk_level) * 0.3  # Lower risk is better
            
            scores[f"option_{i}"] = score
        
        return scores


class OperationalDecisionMaker(DecisionMaker):
    """Implements operational-level decision making"""
    
    def __init__(self):
        super().__init__(DecisionLevel.OPERATIONAL)
        self.tool_selector = None  # Will be injected
        self.execution_patterns = self._load_execution_patterns()
    
    def _load_execution_patterns(self) -> Dict[str, Any]:
        """Load execution patterns for different task types"""
        return {
            'information_gathering': {
                'tools': ['search', 'browse', 'extract'],
                'validation': True,
                'iteration': True
            },
            'analysis': {
                'tools': ['analyze', 'compare', 'synthesize'],
                'validation': True,
                'iteration': False
            },
            'synthesis': {
                'tools': ['combine', 'generate', 'format'],
                'validation': True,
                'iteration': False
            }
        }
    
    async def make_decision(self, context: DecisionContext) -> List[Task]:
        """Make operational decisions for immediate execution"""
        self.logger.info("Making operational decisions")
        
        operational_tasks = []
        
        # Find tactical tasks that need operational execution
        tactical_tasks = [task for task in context.current_tasks 
                         if task.level == DecisionLevel.TACTICAL and task.status == TaskStatus.PENDING]
        
        for tactical_task in tactical_tasks:
            execution_tasks = await self._create_execution_tasks(tactical_task, context)
            operational_tasks.extend(execution_tasks)
            
            # Update tactical task
            tactical_task.subtasks = [task.id for task in execution_tasks]
            tactical_task.status = TaskStatus.IN_PROGRESS
        
        return operational_tasks
    
    async def _create_execution_tasks(self, tactical_task: Task, context: DecisionContext) -> List[Task]:
        """Create operational execution tasks"""
        phase = tactical_task.context.get('phase', 'execution')
        pattern = self.execution_patterns.get(phase, self.execution_patterns['analysis'])
        
        execution_tasks = []
        
        for i, tool_type in enumerate(pattern['tools']):
            task = Task(
                id=f"operational_{tactical_task.id}_{i}_{datetime.now().timestamp()}",
                description=f"Execute {tool_type} for: {tactical_task.description}",
                level=DecisionLevel.OPERATIONAL,
                priority=tactical_task.priority,
                parent_task_id=tactical_task.id,
                context={
                    'tool_type': tool_type,
                    'pattern': pattern,
                    'tactical_context': tactical_task.context
                }
            )
            execution_tasks.append(task)
        
        return execution_tasks
    
    async def evaluate_options(self, options: List[Dict[str, Any]], context: DecisionContext) -> Dict[str, float]:
        """Evaluate operational options"""
        scores = {}
        
        for i, option in enumerate(options):
            score = 0.0
            
            # Evaluate based on execution speed
            speed = option.get('execution_speed', 0.5)
            score += speed * 0.4
            
            # Evaluate based on accuracy
            accuracy = option.get('accuracy', 0.5)
            score += accuracy * 0.4
            
            # Evaluate based on resource cost
            cost = option.get('resource_cost', 0.5)
            score += (1.0 - cost) * 0.2  # Lower cost is better
            
            scores[f"option_{i}"] = score
        
        return scores


class DecisionEngine:
    """Main decision engine that coordinates all decision-making levels"""
    
    def __init__(self):
        self.logger = logging.getLogger("DecisionEngine")
        self.strategic_dm = StrategicDecisionMaker()
        self.tactical_dm = TacticalDecisionMaker()
        self.operational_dm = OperationalDecisionMaker()
        
        self.active_tasks: Dict[str, Task] = {}
        self.decision_history: List[Dict[str, Any]] = []
        
    async def process_request(self, user_request: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Process a user request and generate appropriate tasks"""
        self.logger.info(f"Processing request: {user_request}")
        
        # Parse user request and create decision context
        decision_context = await self._create_decision_context(user_request, context or {})
        
        # Execute decision-making at all levels
        all_tasks = []
        
        # Strategic decisions
        strategic_tasks = await self.strategic_dm.make_decision(decision_context)
        all_tasks.extend(strategic_tasks)
        
        # Update context with strategic tasks
        decision_context.current_tasks.extend(strategic_tasks)
        
        # Tactical decisions
        tactical_tasks = await self.tactical_dm.make_decision(decision_context)
        all_tasks.extend(tactical_tasks)
        
        # Update context with tactical tasks
        decision_context.current_tasks.extend(tactical_tasks)
        
        # Operational decisions
        operational_tasks = await self.operational_dm.make_decision(decision_context)
        all_tasks.extend(operational_tasks)
        
        # Store tasks
        for task in all_tasks:
            self.active_tasks[task.id] = task
        
        # Record decision
        decision_record = {
            'timestamp': datetime.now().isoformat(),
            'user_request': user_request,
            'context': decision_context.to_dict(),
            'tasks_created': [task.to_dict() for task in all_tasks]
        }
        self.decision_history.append(decision_record)
        
        return {
            'status': 'success',
            'tasks_created': len(all_tasks),
            'strategic_tasks': len(strategic_tasks),
            'tactical_tasks': len(tactical_tasks),
            'operational_tasks': len(operational_tasks),
            'task_details': [task.to_dict() for task in all_tasks]
        }
    
    async def _create_decision_context(self, user_request: str, context: Dict[str, Any]) -> DecisionContext:
        """Create decision context from user request and system state"""
        # Parse user objectives (simplified - in real implementation, use NLP)
        objectives = [user_request]  # Can be enhanced to extract multiple objectives
        
        # Get available resources (simplified)
        available_resources = {
            'time': context.get('time_budget', 1.0),
            'computational': context.get('cpu_budget', 1.0),
            'memory': context.get('memory_budget', 1.0),
            'tools': context.get('available_tools', [])
        }
        
        # Get constraints
        constraints = {
            'time_limit': context.get('time_limit'),
            'quality_threshold': context.get('quality_threshold', 0.8),
            'resource_limits': context.get('resource_limits', {})
        }
        
        # Get environmental factors
        environmental_factors = {
            'system_load': context.get('system_load', 0.5),
            'network_available': context.get('network_available', True),
            'user_preferences': context.get('user_preferences', {})
        }
        
        # Get current tasks
        current_tasks = list(self.active_tasks.values())
        
        # Get historical data
        historical_data = {
            'recent_decisions': self.decision_history[-10:],  # Last 10 decisions
            'performance_metrics': context.get('performance_metrics', {})
        }
        
        return DecisionContext(
            user_objectives=objectives,
            available_resources=available_resources,
            constraints=constraints,
            environmental_factors=environmental_factors,
            current_tasks=current_tasks,
            historical_data=historical_data
        )
    
    async def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a specific task"""
        task = self.active_tasks.get(task_id)
        if task:
            return task.to_dict()
        return None
    
    async def update_task_status(self, task_id: str, status: TaskStatus, results: Optional[Dict[str, Any]] = None):
        """Update the status of a task"""
        task = self.active_tasks.get(task_id)
        if task:
            task.status = status
            task.updated_at = datetime.now()
            if results:
                task.results.update(results)
            
            self.logger.info(f"Updated task {task_id} status to {status.value}")
    
    async def get_active_tasks(self) -> List[Dict[str, Any]]:
        """Get all active tasks"""
        return [task.to_dict() for task in self.active_tasks.values()]
    
    async def get_decision_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get decision history"""
        return self.decision_history[-limit:]


# Example usage and testing
if __name__ == "__main__":
    async def test_decision_engine():
        """Test the decision engine"""
        engine = DecisionEngine()
        
        # Test processing a research request
        result = await engine.process_request(
            "Research the latest developments in AI agent architectures",
            {
                'time_budget': 0.8,
                'quality_threshold': 0.9,
                'available_tools': ['search', 'browse', 'analyze']
            }
        )
        
        print("Decision Engine Test Results:")
        print(json.dumps(result, indent=2))
        
        # Test getting active tasks
        tasks = await engine.get_active_tasks()
        print(f"\nActive tasks: {len(tasks)}")
        
        # Test updating task status
        if tasks:
            await engine.update_task_status(tasks[0]['id'], TaskStatus.COMPLETED)
            print(f"Updated task {tasks[0]['id']} to completed")
    
    # Run test
    asyncio.run(test_decision_engine())

