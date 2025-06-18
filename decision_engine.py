
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
import re


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


class ComponentType(Enum):
    """Enumeration of system component types"""
    TOOL = "tool"
    AGENT = "agent"
    MODULE = "module"


@dataclass
class ComponentMapping:
    """Maps intents to system components"""
    component_id: str
    component_type: ComponentType
    confidence: float
    context: Dict[str, Any] = field(default_factory=dict)


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
    assigned_component: Optional[str] = None
    pre_prompt: Optional[str] = None
    
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
            'results': self.results,
            'assigned_component': self.assigned_component,
            'pre_prompt': self.pre_prompt
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


class IntentClassifier:
    """Classifies user intents and maps them to appropriate components"""
    
    def __init__(self):
        self.logger = logging.getLogger("IntentClassifier")
        self.component_patterns = {
            # File Manager patterns
            'file_manager': [
                r'\b(file|folder|directory|organize|clean|duplicate|storage)\b',
                r'\b(manage files|file management|organize folders)\b',
                r'\b(delete duplicates|clean up|disk space)\b'
            ],
            # Research Tool patterns
            'research_tool': [
                r'\b(research|investigate|analyze|study|examine)\b',
                r'\b(find information|gather data|look up)\b',
                r'\b(fact check|verify|validate)\b'
            ],
            # Code Sandbox patterns
            'code_sandbox': [
                r'\b(code|program|script|debug|develop)\b',
                r'\b(write code|programming|coding|development)\b',
                r'\b(fix bug|optimize|refactor)\b'
            ],
            # Social Manager patterns
            'social_manager': [
                r'\b(social media|post|tweet|facebook|instagram)\b',
                r'\b(content creation|social strategy|engagement)\b',
                r'\b(schedule posts|social analytics)\b'
            ],
            # Code Creator Agent patterns
            'code_creator': [
                r'\b(build app|create application|full stack)\b',
                r'\b(software development|architecture|design system)\b',
                r'\b(backend|frontend|database)\b'
            ],
            # Customer Manager patterns
            'customer_manager': [
                r'\b(customer|client|support|relationship)\b',
                r'\b(customer service|help desk|ticket)\b',
                r'\b(feedback|satisfaction|complaint)\b'
            ],
            # Browser Automation patterns
            'browser_automation': [
                r'\b(browser|web|scrape|automate|crawl)\b',
                r'\b(web automation|browser testing|web data)\b',
                r'\b(click|fill form|navigate)\b'
            ],
            # Professional AI patterns
            'professional_ai': [
                r'\b(business|enterprise|professional|workflow)\b',
                r'\b(business logic|process|optimization)\b',
                r'\b(corporate|company|organization)\b'
            ],
            # Operator Module patterns
            'operator_module': [
                r'\b(system|admin|monitor|performance)\b',
                r'\b(system administration|maintenance|security)\b',
                r'\b(resources|operations|infrastructure)\b'
            ]
        }
        
        self.component_types = {
            'file_manager': ComponentType.TOOL,
            'research_tool': ComponentType.TOOL,
            'code_sandbox': ComponentType.TOOL,
            'social_manager': ComponentType.AGENT,
            'code_creator': ComponentType.AGENT,
            'customer_manager': ComponentType.AGENT,
            'browser_automation': ComponentType.MODULE,
            'professional_ai': ComponentType.MODULE,
            'operator_module': ComponentType.MODULE
        }
    
    async def classify_intent(self, user_input: str) -> List[ComponentMapping]:
        """Classify user intent and return mapped components"""
        self.logger.info(f"Classifying intent for: {user_input[:100]}...")
        
        mappings = []
        user_input_lower = user_input.lower()
        
        for component_id, patterns in self.component_patterns.items():
            confidence = 0.0
            matched_patterns = []
            
            for pattern in patterns:
                if re.search(pattern, user_input_lower):
                    confidence += 0.3
                    matched_patterns.append(pattern)
            
            # Bonus for multiple pattern matches
            if len(matched_patterns) > 1:
                confidence += 0.2
            
            # Bonus for exact component name mentions
            if component_id.replace('_', ' ') in user_input_lower:
                confidence += 0.4
            
            # Cap confidence at 1.0
            confidence = min(1.0, confidence)
            
            if confidence > 0.2:  # Threshold for inclusion
                mapping = ComponentMapping(
                    component_id=component_id,
                    component_type=self.component_types[component_id],
                    confidence=confidence,
                    context={
                        'matched_patterns': matched_patterns,
                        'original_input': user_input
                    }
                )
                mappings.append(mapping)
        
        # Sort by confidence (highest first)
        mappings.sort(key=lambda x: x.confidence, reverse=True)
        
        self.logger.info(f"Found {len(mappings)} component mappings")
        return mappings

    async def get_primary_component(self, user_input: str) -> Optional[ComponentMapping]:
        """Get the primary component mapping for the input"""
        mappings = await self.classify_intent(user_input)
        return mappings[0] if mappings else None


class PrePromptGenerator:
    """Generates pre-prompts for components"""
    
    def __init__(self):
        self.logger = logging.getLogger("PrePromptGenerator")
        self.component_definitions = {
            'file_manager': {
                'role': 'Intelligent File System Operator',
                'responsibilities': [
                    'Organize and manage files intelligently',
                    'Detect and remove duplicates',
                    'Analyze file content and metadata',
                    'Provide security scanning and threat detection',
                    'Optimize storage usage'
                ],
                'tone': 'Professional, efficient, security-conscious',
                'specializations': ['file_operations', 'security_analysis', 'storage_optimization']
            },
            'research_tool': {
                'role': 'Advanced Research Specialist',
                'responsibilities': [
                    'Conduct comprehensive research',
                    'Analyze and synthesize information',
                    'Verify source credibility',
                    'Generate research reports',
                    'Track research progress'
                ],
                'tone': 'Analytical, thorough, evidence-based',
                'specializations': ['information_gathering', 'analysis', 'fact_checking']
            },
            'code_sandbox': {
                'role': 'Advanced Code Assistant',
                'responsibilities': [
                    'Write and debug code',
                    'Provide code suggestions',
                    'Optimize performance',
                    'Ensure code quality',
                    'Handle multiple programming languages'
                ],
                'tone': 'Technical, precise, helpful',
                'specializations': ['programming', 'debugging', 'optimization']
            },
            'social_manager': {
                'role': 'Social Media Strategy Expert',
                'responsibilities': [
                    'Manage social media accounts',
                    'Create engaging content',
                    'Analyze social media metrics',
                    'Schedule posts optimally',
                    'Engage with audiences'
                ],
                'tone': 'Creative, engaging, brand-aware',
                'specializations': ['content_creation', 'social_strategy', 'audience_engagement']
            },
            'code_creator': {
                'role': 'Full-Stack Development Specialist',
                'responsibilities': [
                    'Design software architecture',
                    'Implement complete applications',
                    'Handle frontend and backend development',
                    'Ensure code quality and security',
                    'Manage project lifecycle'
                ],
                'tone': 'Technical, methodical, solution-oriented',
                'specializations': ['full_stack_development', 'architecture_design', 'project_management']
            },
            'customer_manager': {
                'role': 'Customer Experience Specialist',
                'responsibilities': [
                    'Manage customer relationships',
                    'Handle customer support',
                    'Analyze customer feedback',
                    'Improve customer satisfaction',
                    'Track customer journey'
                ],
                'tone': 'Empathetic, professional, solution-focused',
                'specializations': ['customer_support', 'relationship_management', 'feedback_analysis']
            },
            'browser_automation': {
                'role': 'Web Automation Specialist',
                'responsibilities': [
                    'Automate web interactions',
                    'Extract web data',
                    'Perform web testing',
                    'Monitor web changes',
                    'Handle complex web workflows'
                ],
                'tone': 'Systematic, reliable, detail-oriented',
                'specializations': ['web_automation', 'data_extraction', 'testing']
            },
            'professional_ai': {
                'role': 'Enterprise AI Specialist',
                'responsibilities': [
                    'Handle complex business logic',
                    'Provide enterprise-grade solutions',
                    'Manage professional workflows',
                    'Ensure compliance and security',
                    'Optimize business processes'
                ],
                'tone': 'Professional, strategic, results-driven',
                'specializations': ['business_logic', 'enterprise_solutions', 'process_optimization']
            },
            'operator_module': {
                'role': 'System Administration Specialist',
                'responsibilities': [
                    'Monitor system performance',
                    'Manage system resources',
                    'Handle system maintenance',
                    'Ensure system security',
                    'Coordinate system operations'
                ],
                'tone': 'Authoritative, reliable, security-focused',
                'specializations': ['system_administration', 'performance_monitoring', 'security_management']
            }
        }
    
    async def generate_pre_prompt(self, component_id: str, context: Dict[str, Any] = None) -> str:
        """Generate a pre-prompt for the specified component"""
        if component_id not in self.component_definitions:
            self.logger.warning(f"Unknown component: {component_id}")
            return "You are an AI assistant. Please help the user with their request."
        
        definition = self.component_definitions[component_id]
        context = context or {}
        
        responsibilities = '\n'.join([f"- {r}" for r in definition['responsibilities']])
        specializations = '\n'.join([f"- {s.replace('_', ' ').title()}" for s in definition['specializations']])
        
        pre_prompt = f"""You are {definition['role']}, operating as part of an advanced AI desktop system.

CORE IDENTITY:
- Role: {definition['role']}
- Component: {component_id.replace('_', ' ').title()}
- Tone: {definition['tone']}

RESPONSIBILITIES:
{responsibilities}

SPECIALIZATIONS:
{specializations}

OPERATIONAL CONTEXT:
- You are part of a multi-agent AI system with decision-making capabilities
- Work collaboratively with other AI components when needed
- Maintain context awareness across system interactions
- Follow system security and privacy protocols
- Provide clear, actionable responses aligned with your role

BEHAVIOR GUIDELINES:
- Stay in character as {definition['role']}
- Use {definition['tone']} communication style
- Focus on your core responsibilities
- Escalate complex cross-domain issues to the decision engine
- Maintain professional standards while being helpful and accessible

Current task context will be provided in subsequent messages."""

        return pre_prompt.strip()


# ... keep existing code (DecisionMaker classes and other functionality remain the same)


class DecisionEngine:
    """Main decision engine that coordinates all decision-making levels"""
    
    def __init__(self):
        self.logger = logging.getLogger("DecisionEngine")
        self.strategic_dm = StrategicDecisionMaker()
        self.tactical_dm = TacticalDecisionMaker()
        self.operational_dm = OperationalDecisionMaker()
        self.intent_classifier = IntentClassifier()
        self.pre_prompt_generator = PrePromptGenerator()
        
        self.active_tasks: Dict[str, Task] = {}
        self.decision_history: List[Dict[str, Any]] = []
        
    async def process_request(self, user_request: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Process a user request and generate appropriate tasks with component routing"""
        self.logger.info(f"Processing request: {user_request}")
        
        # Classify intent and map to components
        component_mappings = await self.intent_classifier.classify_intent(user_request)
        primary_component = component_mappings[0] if component_mappings else None
        
        # Parse user request and create decision context
        decision_context = await self._create_decision_context(user_request, context or {})
        
        # Execute decision-making at all levels
        all_tasks = []
        
        # Strategic decisions
        strategic_tasks = await self.strategic_dm.make_decision(decision_context)
        all_tasks.extend(strategic_tasks)
        
        # Assign components and generate pre-prompts for strategic tasks
        if primary_component:
            for task in strategic_tasks:
                task.assigned_component = primary_component.component_id
                task.pre_prompt = await self.pre_prompt_generator.generate_pre_prompt(
                    primary_component.component_id, 
                    {**task.context, **primary_component.context}
                )
        
        # Update context with strategic tasks
        decision_context.current_tasks.extend(strategic_tasks)
        
        # Tactical decisions
        tactical_tasks = await self.tactical_dm.make_decision(decision_context)
        all_tasks.extend(tactical_tasks)
        
        # Inherit component assignments from parent tasks
        for task in tactical_tasks:
            if task.parent_task_id:
                parent_task = next((t for t in strategic_tasks if t.id == task.parent_task_id), None)
                if parent_task:
                    task.assigned_component = parent_task.assigned_component
                    task.pre_prompt = parent_task.pre_prompt
        
        # Update context with tactical tasks
        decision_context.current_tasks.extend(tactical_tasks)
        
        # Operational decisions
        operational_tasks = await self.operational_dm.make_decision(decision_context)
        all_tasks.extend(operational_tasks)
        
        # Inherit component assignments from parent tasks
        for task in operational_tasks:
            if task.parent_task_id:
                parent_task = next((t for t in tactical_tasks if t.id == task.parent_task_id), None)
                if parent_task:
                    task.assigned_component = parent_task.assigned_component
                    task.pre_prompt = parent_task.pre_prompt
        
        # Store tasks
        for task in all_tasks:
            self.active_tasks[task.id] = task
        
        # Record decision
        decision_record = {
            'timestamp': datetime.now().isoformat(),
            'user_request': user_request,
            'component_mappings': [
                {
                    'component_id': m.component_id,
                    'component_type': m.component_type.value,
                    'confidence': m.confidence
                } for m in component_mappings
            ],
            'primary_component': primary_component.component_id if primary_component else None,
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
            'primary_component': primary_component.component_id if primary_component else None,
            'component_mappings': len(component_mappings),
            'task_details': [task.to_dict() for task in all_tasks]
        }
    
    async def get_component_routing(self, user_request: str) -> Dict[str, Any]:
        """Get component routing information for a request"""
        component_mappings = await self.intent_classifier.classify_intent(user_request)
        primary_component = component_mappings[0] if component_mappings else None
        
        result = {
            'primary_component': primary_component.component_id if primary_component else None,
            'confidence': primary_component.confidence if primary_component else 0.0,
            'all_mappings': [
                {
                    'component_id': m.component_id,
                    'component_type': m.component_type.value,
                    'confidence': m.confidence
                } for m in component_mappings
            ]
        }
        
        if primary_component:
            result['pre_prompt'] = await self.pre_prompt_generator.generate_pre_prompt(
                primary_component.component_id
            )
        
        return result
    
    # ... keep existing code (other methods remain the same)


# ... keep existing code (DecisionMaker classes remain the same)


# Example usage and testing
if __name__ == "__main__":
    async def test_decision_engine():
        """Test the decision engine with pre-prompt generation"""
        engine = DecisionEngine()
        
        # Test component routing
        test_requests = [
            "Help me organize my files and remove duplicates",
            "I need to research AI agent architectures",
            "Build a social media dashboard application",
            "Automate my browser to fill out forms",
            "Debug this Python code for me"
        ]
        
        for request in test_requests:
            print(f"\n=== Testing: {request} ===")
            
            # Test routing
            routing = await engine.get_component_routing(request)
            print(f"Primary Component: {routing['primary_component']}")
            print(f"Confidence: {routing['confidence']:.2f}")
            
            # Test full processing
            result = await engine.process_request(request)
            print(f"Tasks Created: {result['tasks_created']}")
            print(f"Component Mappings: {result['component_mappings']}")
    
    # Run test
    asyncio.run(test_decision_engine())
