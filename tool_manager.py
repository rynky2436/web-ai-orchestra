"""
AI Desktop System - Tool Management Module

This module implements intelligent tool discovery, selection, and usage capabilities
that enable the AI system to effectively leverage available tools and resources.

Author: Manus AI
Date: June 17, 2025
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Any, Callable, Union
from datetime import datetime
import json
import uuid
import inspect


class ToolType(Enum):
    """Enumeration of tool types"""
    SEARCH = "search"
    ANALYSIS = "analysis"
    GENERATION = "generation"
    COMMUNICATION = "communication"
    DATA_PROCESSING = "data_processing"
    FILE_OPERATION = "file_operation"
    SYSTEM = "system"
    CUSTOM = "custom"


class ToolStatus(Enum):
    """Enumeration of tool statuses"""
    AVAILABLE = "available"
    BUSY = "busy"
    UNAVAILABLE = "unavailable"
    ERROR = "error"
    MAINTENANCE = "maintenance"


@dataclass
class ToolCapability:
    """Represents a tool capability"""
    name: str
    description: str
    input_types: List[str]
    output_types: List[str]
    parameters: Dict[str, Any] = field(default_factory=dict)
    constraints: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ToolMetadata:
    """Metadata about a tool"""
    name: str
    version: str
    description: str
    tool_type: ToolType
    capabilities: List[ToolCapability]
    performance_metrics: Dict[str, float] = field(default_factory=dict)
    reliability_score: float = 1.0
    last_used: Optional[datetime] = None
    usage_count: int = 0
    error_count: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'version': self.version,
            'description': self.description,
            'tool_type': self.tool_type.value,
            'capabilities': [
                {
                    'name': cap.name,
                    'description': cap.description,
                    'input_types': cap.input_types,
                    'output_types': cap.output_types,
                    'parameters': cap.parameters,
                    'constraints': cap.constraints
                }
                for cap in self.capabilities
            ],
            'performance_metrics': self.performance_metrics,
            'reliability_score': self.reliability_score,
            'last_used': self.last_used.isoformat() if self.last_used else None,
            'usage_count': self.usage_count,
            'error_count': self.error_count
        }


@dataclass
class ToolExecutionResult:
    """Result of tool execution"""
    tool_name: str
    success: bool
    result: Any = None
    error: Optional[str] = None
    execution_time: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'tool_name': self.tool_name,
            'success': self.success,
            'result': self.result,
            'error': self.error,
            'execution_time': self.execution_time,
            'metadata': self.metadata
        }


class Tool(ABC):
    """Abstract base class for tools"""
    
    def __init__(self, metadata: ToolMetadata):
        self.metadata = metadata
        self.status = ToolStatus.AVAILABLE
        self.logger = logging.getLogger(f"Tool.{metadata.name}")
        self._execution_history: List[ToolExecutionResult] = []
    
    @abstractmethod
    async def execute(self, **kwargs) -> ToolExecutionResult:
        """Execute the tool with given parameters"""
        pass
    
    async def validate_parameters(self, **kwargs) -> bool:
        """Validate parameters before execution"""
        # Default implementation - can be overridden
        return True
    
    async def get_status(self) -> ToolStatus:
        """Get current tool status"""
        return self.status
    
    async def update_performance_metrics(self, result: ToolExecutionResult):
        """Update performance metrics based on execution result"""
        self.metadata.usage_count += 1
        self.metadata.last_used = datetime.now()
        
        if result.success:
            # Update success metrics
            if 'average_execution_time' not in self.metadata.performance_metrics:
                self.metadata.performance_metrics['average_execution_time'] = result.execution_time
            else:
                current_avg = self.metadata.performance_metrics['average_execution_time']
                new_avg = (current_avg * (self.metadata.usage_count - 1) + result.execution_time) / self.metadata.usage_count
                self.metadata.performance_metrics['average_execution_time'] = new_avg
        else:
            self.metadata.error_count += 1
        
        # Update reliability score
        success_rate = (self.metadata.usage_count - self.metadata.error_count) / self.metadata.usage_count
        self.metadata.reliability_score = success_rate
        
        # Store execution history (keep last 100)
        self._execution_history.append(result)
        if len(self._execution_history) > 100:
            self._execution_history.pop(0)


class SearchTool(Tool):
    """Tool for searching information"""
    
    def __init__(self):
        capabilities = [
            ToolCapability(
                name="web_search",
                description="Search the web for information",
                input_types=["string"],
                output_types=["list"],
                parameters={
                    "query": {"type": "string", "required": True},
                    "limit": {"type": "int", "default": 10},
                    "source_filter": {"type": "list", "default": []}
                }
            )
        ]
        
        metadata = ToolMetadata(
            name="search_tool",
            version="1.0.0",
            description="Comprehensive search tool for information gathering",
            tool_type=ToolType.SEARCH,
            capabilities=capabilities
        )
        
        super().__init__(metadata)
    
    async def execute(self, **kwargs) -> ToolExecutionResult:
        """Execute search operation"""
        start_time = datetime.now()
        
        try:
            # Validate parameters
            if not await self.validate_parameters(**kwargs):
                return ToolExecutionResult(
                    tool_name=self.metadata.name,
                    success=False,
                    error="Invalid parameters",
                    execution_time=0.0
                )
            
            query = kwargs.get('query', '')
            limit = kwargs.get('limit', 10)
            source_filter = kwargs.get('source_filter', [])
            
            # Simulate search (replace with actual search implementation)
            results = await self._perform_search(query, limit, source_filter)
            
            execution_time = (datetime.now() - start_time).total_seconds()
            
            result = ToolExecutionResult(
                tool_name=self.metadata.name,
                success=True,
                result=results,
                execution_time=execution_time,
                metadata={
                    'query': query,
                    'results_count': len(results),
                    'sources_used': source_filter or ['web']
                }
            )
            
            await self.update_performance_metrics(result)
            return result
            
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            result = ToolExecutionResult(
                tool_name=self.metadata.name,
                success=False,
                error=str(e),
                execution_time=execution_time
            )
            
            await self.update_performance_metrics(result)
            return result
    
    async def _perform_search(self, query: str, limit: int, source_filter: List[str]) -> List[Dict[str, Any]]:
        """Perform actual search (mock implementation)"""
        # Mock search results
        results = []
        for i in range(min(limit, 10)):
            results.append({
                'title': f"Search result {i+1} for '{query}'",
                'url': f"https://example.com/result_{i+1}",
                'snippet': f"This is a mock search result snippet for query '{query}'. Result number {i+1}.",
                'relevance_score': max(0.1, 1.0 - (i * 0.1)),
                'source': source_filter[0] if source_filter else 'web'
            })
        
        # Simulate network delay
        await asyncio.sleep(0.1)
        
        return results


class AnalysisTool(Tool):
    """Tool for analyzing data and information"""
    
    def __init__(self):
        capabilities = [
            ToolCapability(
                name="text_analysis",
                description="Analyze text for patterns, sentiment, and insights",
                input_types=["string", "list"],
                output_types=["dict"],
                parameters={
                    "text": {"type": "string", "required": True},
                    "analysis_type": {"type": "string", "default": "comprehensive"},
                    "include_sentiment": {"type": "bool", "default": True}
                }
            ),
            ToolCapability(
                name="data_analysis",
                description="Analyze structured data for patterns and insights",
                input_types=["dict", "list"],
                output_types=["dict"],
                parameters={
                    "data": {"type": "any", "required": True},
                    "analysis_methods": {"type": "list", "default": ["statistical", "pattern"]}
                }
            )
        ]
        
        metadata = ToolMetadata(
            name="analysis_tool",
            version="1.0.0",
            description="Comprehensive analysis tool for text and data",
            tool_type=ToolType.ANALYSIS,
            capabilities=capabilities
        )
        
        super().__init__(metadata)
    
    async def execute(self, **kwargs) -> ToolExecutionResult:
        """Execute analysis operation"""
        start_time = datetime.now()
        
        try:
            capability = kwargs.get('capability', 'text_analysis')
            
            if capability == 'text_analysis':
                result_data = await self._analyze_text(**kwargs)
            elif capability == 'data_analysis':
                result_data = await self._analyze_data(**kwargs)
            else:
                raise ValueError(f"Unknown capability: {capability}")
            
            execution_time = (datetime.now() - start_time).total_seconds()
            
            result = ToolExecutionResult(
                tool_name=self.metadata.name,
                success=True,
                result=result_data,
                execution_time=execution_time,
                metadata={'capability_used': capability}
            )
            
            await self.update_performance_metrics(result)
            return result
            
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            result = ToolExecutionResult(
                tool_name=self.metadata.name,
                success=False,
                error=str(e),
                execution_time=execution_time
            )
            
            await self.update_performance_metrics(result)
            return result
    
    async def _analyze_text(self, **kwargs) -> Dict[str, Any]:
        """Analyze text content"""
        text = kwargs.get('text', '')
        analysis_type = kwargs.get('analysis_type', 'comprehensive')
        include_sentiment = kwargs.get('include_sentiment', True)
        
        # Mock analysis results
        analysis = {
            'word_count': len(text.split()),
            'character_count': len(text),
            'readability_score': 0.75,
            'key_topics': ['AI', 'technology', 'analysis'],
            'complexity_score': 0.6
        }
        
        if include_sentiment:
            analysis['sentiment'] = {
                'polarity': 0.1,
                'subjectivity': 0.5,
                'classification': 'neutral'
            }
        
        # Simulate processing time
        await asyncio.sleep(0.05)
        
        return analysis
    
    async def _analyze_data(self, **kwargs) -> Dict[str, Any]:
        """Analyze structured data"""
        data = kwargs.get('data', {})
        methods = kwargs.get('analysis_methods', ['statistical'])
        
        # Mock data analysis
        analysis = {
            'data_type': type(data).__name__,
            'size': len(data) if hasattr(data, '__len__') else 1,
            'methods_applied': methods,
            'insights': ['Pattern detected', 'Anomaly found at position 5'],
            'confidence_score': 0.8
        }
        
        # Simulate processing time
        await asyncio.sleep(0.1)
        
        return analysis


class ToolRegistry:
    """Registry for managing available tools"""
    
    def __init__(self):
        self.logger = logging.getLogger("ToolRegistry")
        self.tools: Dict[str, Tool] = {}
        self.tool_categories: Dict[ToolType, List[str]] = {}
        
        # Initialize with default tools
        self._register_default_tools()
    
    def _register_default_tools(self):
        """Register default tools"""
        # Register search tool
        search_tool = SearchTool()
        self.register_tool(search_tool)
        
        # Register analysis tool
        analysis_tool = AnalysisTool()
        self.register_tool(analysis_tool)
    
    def register_tool(self, tool: Tool) -> bool:
        """Register a new tool"""
        try:
            tool_name = tool.metadata.name
            
            if tool_name in self.tools:
                self.logger.warning(f"Tool {tool_name} already registered, updating...")
            
            self.tools[tool_name] = tool
            
            # Update category index
            tool_type = tool.metadata.tool_type
            if tool_type not in self.tool_categories:
                self.tool_categories[tool_type] = []
            
            if tool_name not in self.tool_categories[tool_type]:
                self.tool_categories[tool_type].append(tool_name)
            
            self.logger.info(f"Registered tool: {tool_name}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to register tool: {str(e)}")
            return False
    
    def unregister_tool(self, tool_name: str) -> bool:
        """Unregister a tool"""
        if tool_name not in self.tools:
            return False
        
        tool = self.tools[tool_name]
        tool_type = tool.metadata.tool_type
        
        # Remove from tools
        del self.tools[tool_name]
        
        # Remove from category index
        if tool_type in self.tool_categories:
            if tool_name in self.tool_categories[tool_type]:
                self.tool_categories[tool_type].remove(tool_name)
        
        self.logger.info(f"Unregistered tool: {tool_name}")
        return True
    
    def get_tool(self, tool_name: str) -> Optional[Tool]:
        """Get a tool by name"""
        return self.tools.get(tool_name)
    
    def list_tools(self, tool_type: Optional[ToolType] = None) -> List[str]:
        """List available tools, optionally filtered by type"""
        if tool_type:
            return self.tool_categories.get(tool_type, [])
        return list(self.tools.keys())
    
    def get_tools_by_capability(self, capability_name: str) -> List[str]:
        """Get tools that have a specific capability"""
        matching_tools = []
        
        for tool_name, tool in self.tools.items():
            for capability in tool.metadata.capabilities:
                if capability.name == capability_name:
                    matching_tools.append(tool_name)
                    break
        
        return matching_tools
    
    def get_tool_metadata(self, tool_name: str) -> Optional[ToolMetadata]:
        """Get metadata for a tool"""
        tool = self.tools.get(tool_name)
        return tool.metadata if tool else None


class ToolSelector:
    """Intelligent tool selection system"""
    
    def __init__(self, registry: ToolRegistry):
        self.registry = registry
        self.logger = logging.getLogger("ToolSelector")
        self.selection_history: List[Dict[str, Any]] = []
    
    async def select_tool(self, task_requirements: Dict[str, Any]) -> Optional[str]:
        """Select the best tool for a given task"""
        required_capability = task_requirements.get('capability')
        input_type = task_requirements.get('input_type')
        output_type = task_requirements.get('output_type')
        performance_priority = task_requirements.get('performance_priority', 'balanced')
        
        # Get candidate tools
        candidates = []
        
        if required_capability:
            candidates = self.registry.get_tools_by_capability(required_capability)
        else:
            # Get all tools if no specific capability required
            candidates = self.registry.list_tools()
        
        if not candidates:
            self.logger.warning("No candidate tools found for requirements")
            return None
        
        # Score candidates
        scored_candidates = []
        
        for tool_name in candidates:
            score = await self._score_tool(tool_name, task_requirements)
            scored_candidates.append((tool_name, score))
        
        # Sort by score (highest first)
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        
        # Select best tool
        if scored_candidates:
            selected_tool = scored_candidates[0][0]
            
            # Record selection
            selection_record = {
                'timestamp': datetime.now().isoformat(),
                'requirements': task_requirements,
                'candidates': scored_candidates,
                'selected': selected_tool
            }
            self.selection_history.append(selection_record)
            
            # Keep only last 1000 selections
            if len(self.selection_history) > 1000:
                self.selection_history.pop(0)
            
            self.logger.info(f"Selected tool: {selected_tool} (score: {scored_candidates[0][1]:.3f})")
            return selected_tool
        
        return None
    
    async def _score_tool(self, tool_name: str, requirements: Dict[str, Any]) -> float:
        """Score a tool based on requirements"""
        tool = self.registry.get_tool(tool_name)
        if not tool:
            return 0.0
        
        score = 0.0
        
        # Base capability match score
        required_capability = requirements.get('capability')
        if required_capability:
            for capability in tool.metadata.capabilities:
                if capability.name == required_capability:
                    score += 0.4
                    break
        else:
            score += 0.2  # Some points for being available
        
        # Input/output type compatibility
        input_type = requirements.get('input_type')
        output_type = requirements.get('output_type')
        
        if input_type or output_type:
            compatibility_score = 0.0
            capability_count = len(tool.metadata.capabilities)
            
            for capability in tool.metadata.capabilities:
                if input_type and input_type in capability.input_types:
                    compatibility_score += 0.1
                if output_type and output_type in capability.output_types:
                    compatibility_score += 0.1
            
            score += compatibility_score / max(capability_count, 1)
        
        # Performance and reliability
        reliability_weight = 0.2
        performance_weight = 0.2
        
        score += tool.metadata.reliability_score * reliability_weight
        
        # Performance based on priority
        performance_priority = requirements.get('performance_priority', 'balanced')
        
        if performance_priority == 'speed':
            # Prefer tools with faster execution time
            avg_time = tool.metadata.performance_metrics.get('average_execution_time', 1.0)
            speed_score = max(0.0, 1.0 - (avg_time / 10.0))  # Normalize to 0-1
            score += speed_score * performance_weight
        elif performance_priority == 'accuracy':
            # Prefer tools with higher reliability
            score += tool.metadata.reliability_score * performance_weight
        else:  # balanced
            # Balance speed and reliability
            avg_time = tool.metadata.performance_metrics.get('average_execution_time', 1.0)
            speed_score = max(0.0, 1.0 - (avg_time / 10.0))
            balanced_score = (speed_score + tool.metadata.reliability_score) / 2
            score += balanced_score * performance_weight
        
        # Usage history bonus (prefer tools that have been used successfully)
        if tool.metadata.usage_count > 0:
            usage_bonus = min(0.1, tool.metadata.usage_count / 100.0)
            score += usage_bonus
        
        return min(1.0, score)
    
    def get_selection_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent tool selection history"""
        return self.selection_history[-limit:]


class ToolManager:
    """Main tool management system"""
    
    def __init__(self):
        self.logger = logging.getLogger("ToolManager")
        self.registry = ToolRegistry()
        self.selector = ToolSelector(self.registry)
        self.execution_queue: asyncio.Queue = asyncio.Queue()
        self.active_executions: Dict[str, Dict[str, Any]] = {}
        
    async def execute_tool(self, tool_name: str, **kwargs) -> ToolExecutionResult:
        """Execute a tool with given parameters"""
        execution_id = f"exec_{uuid.uuid4().hex[:8]}"
        
        try:
            # Get tool
            tool = self.registry.get_tool(tool_name)
            if not tool:
                return ToolExecutionResult(
                    tool_name=tool_name,
                    success=False,
                    error=f"Tool '{tool_name}' not found"
                )
            
            # Check tool status
            status = await tool.get_status()
            if status != ToolStatus.AVAILABLE:
                return ToolExecutionResult(
                    tool_name=tool_name,
                    success=False,
                    error=f"Tool '{tool_name}' is not available (status: {status.value})"
                )
            
            # Record execution start
            self.active_executions[execution_id] = {
                'tool_name': tool_name,
                'start_time': datetime.now(),
                'parameters': kwargs
            }
            
            # Execute tool
            self.logger.info(f"Executing tool: {tool_name} (execution_id: {execution_id})")
            result = await tool.execute(**kwargs)
            
            # Clean up
            if execution_id in self.active_executions:
                del self.active_executions[execution_id]
            
            self.logger.info(f"Tool execution completed: {tool_name} (success: {result.success})")
            return result
            
        except Exception as e:
            # Clean up on error
            if execution_id in self.active_executions:
                del self.active_executions[execution_id]
            
            self.logger.error(f"Tool execution failed: {tool_name} - {str(e)}")
            return ToolExecutionResult(
                tool_name=tool_name,
                success=False,
                error=str(e)
            )
    
    async def select_and_execute(self, task_requirements: Dict[str, Any], **kwargs) -> ToolExecutionResult:
        """Select appropriate tool and execute it"""
        # Select tool
        selected_tool = await self.selector.select_tool(task_requirements)
        
        if not selected_tool:
            return ToolExecutionResult(
                tool_name="unknown",
                success=False,
                error="No suitable tool found for requirements"
            )
        
        # Execute selected tool
        return await self.execute_tool(selected_tool, **kwargs)
    
    def register_tool(self, tool: Tool) -> bool:
        """Register a new tool"""
        return self.registry.register_tool(tool)
    
    def list_tools(self, tool_type: Optional[ToolType] = None) -> List[Dict[str, Any]]:
        """List available tools with metadata"""
        tool_names = self.registry.list_tools(tool_type)
        tools_info = []
        
        for tool_name in tool_names:
            metadata = self.registry.get_tool_metadata(tool_name)
            if metadata:
                tools_info.append(metadata.to_dict())
        
        return tools_info
    
    def get_tool_status(self, tool_name: str) -> Optional[Dict[str, Any]]:
        """Get detailed status of a tool"""
        tool = self.registry.get_tool(tool_name)
        if not tool:
            return None
        
        return {
            'name': tool.metadata.name,
            'status': tool.status.value,
            'metadata': tool.metadata.to_dict(),
            'active_executions': [
                exec_info for exec_id, exec_info in self.active_executions.items()
                if exec_info['tool_name'] == tool_name
            ]
        }
    
    def get_active_executions(self) -> List[Dict[str, Any]]:
        """Get list of active tool executions"""
        return [
            {
                'execution_id': exec_id,
                'tool_name': exec_info['tool_name'],
                'start_time': exec_info['start_time'].isoformat(),
                'duration': (datetime.now() - exec_info['start_time']).total_seconds(),
                'parameters': exec_info['parameters']
            }
            for exec_id, exec_info in self.active_executions.items()
        ]


# Example usage and testing
if __name__ == "__main__":
    async def test_tool_management():
        """Test the tool management system"""
        manager = ToolManager()
        
        # Test listing tools
        tools = manager.list_tools()
        print("Available tools:")
        for tool in tools:
            print(f"- {tool['name']}: {tool['description']}")
        
        # Test tool selection and execution
        requirements = {
            'capability': 'web_search',
            'input_type': 'string',
            'output_type': 'list',
            'performance_priority': 'speed'
        }
        
        result = await manager.select_and_execute(
            requirements,
            query="AI agent architectures",
            limit=5
        )
        
        print(f"\nTool execution result:")
        print(json.dumps(result.to_dict(), indent=2))
        
        # Test direct tool execution
        analysis_result = await manager.execute_tool(
            'analysis_tool',
            capability='text_analysis',
            text="This is a sample text for analysis.",
            include_sentiment=True
        )
        
        print(f"\nAnalysis result:")
        print(json.dumps(analysis_result.to_dict(), indent=2))
    
    # Run test
    asyncio.run(test_tool_management())

