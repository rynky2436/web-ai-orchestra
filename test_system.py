"""
AI Desktop System - Test Suite

Comprehensive test suite for all system components to ensure reliability
and correctness of the AI desktop interface logic.

Author: Manus AI
Date: June 17, 2025
"""

import pytest
import asyncio
import os
import tempfile
import shutil
from datetime import datetime, timedelta
from unittest.mock import Mock, patch

# Import system components
import sys
sys.path.append('..')

from main import AIDesktopSystem
from core.decision_engine.decision_engine import DecisionEngine, TaskStatus, DecisionLevel
from core.research_system.research_system import ResearchSystem, ResearchQuery
from core.tool_management.tool_manager import ToolManager, ToolType
from core.memory_system.memory_system import MemorySystem, MemoryType
from core.learning_system.learning_system import LearningSystem, FeedbackType


class TestDecisionEngine:
    """Test suite for the Decision Engine"""
    
    @pytest.fixture
    async def decision_engine(self):
        """Create a decision engine for testing"""
        return DecisionEngine()
    
    @pytest.mark.asyncio
    async def test_process_request(self, decision_engine):
        """Test request processing"""
        result = await decision_engine.process_request(
            "Research AI architectures",
            {"time_budget": 0.8, "quality_threshold": 0.9}
        )
        
        assert result['status'] == 'success'
        assert result['tasks_created'] > 0
        assert result['strategic_tasks'] > 0
        assert result['tactical_tasks'] >= 0
        assert result['operational_tasks'] >= 0
    
    @pytest.mark.asyncio
    async def test_task_status_updates(self, decision_engine):
        """Test task status updates"""
        # Create a task first
        result = await decision_engine.process_request("Test task", {})
        tasks = result['task_details']
        
        if tasks:
            task_id = tasks[0]['id']
            
            # Update task status
            await decision_engine.update_task_status(task_id, TaskStatus.COMPLETED)
            
            # Verify status update
            task_status = await decision_engine.get_task_status(task_id)
            assert task_status['status'] == TaskStatus.COMPLETED.value
    
    @pytest.mark.asyncio
    async def test_get_active_tasks(self, decision_engine):
        """Test getting active tasks"""
        # Create some tasks
        await decision_engine.process_request("Test task 1", {})
        await decision_engine.process_request("Test task 2", {})
        
        active_tasks = await decision_engine.get_active_tasks()
        assert len(active_tasks) > 0
        
        # Verify task structure
        for task in active_tasks:
            assert 'id' in task
            assert 'description' in task
            assert 'level' in task
            assert 'status' in task


class TestResearchSystem:
    """Test suite for the Research System"""
    
    @pytest.fixture
    async def research_system(self):
        """Create a research system for testing"""
        return ResearchSystem()
    
    @pytest.mark.asyncio
    async def test_conduct_research(self, research_system):
        """Test research conduct"""
        report = await research_system.conduct_research(
            "Test research query",
            depth_level=2,
            time_limit=30
        )
        
        assert report.query.query_text == "Test research query"
        assert report.confidence_score >= 0.0
        assert report.confidence_score <= 1.0
        assert report.research_duration > 0
        assert isinstance(report.findings, list)
        assert isinstance(report.sources_used, list)
    
    @pytest.mark.asyncio
    async def test_research_status_tracking(self, research_system):
        """Test research status tracking"""
        # Start research
        research_task = asyncio.create_task(
            research_system.conduct_research("Long research task", time_limit=60)
        )
        
        # Give it a moment to start
        await asyncio.sleep(0.1)
        
        # Check active research
        active_research = await research_system.list_active_research()
        
        # Wait for completion
        report = await research_task
        
        # Check completed research
        completed_research = await research_system.list_completed_research()
        assert len(completed_research) > 0


class TestToolManager:
    """Test suite for the Tool Manager"""
    
    @pytest.fixture
    async def tool_manager(self):
        """Create a tool manager for testing"""
        return ToolManager()
    
    @pytest.mark.asyncio
    async def test_list_tools(self, tool_manager):
        """Test tool listing"""
        tools = tool_manager.list_tools()
        assert len(tools) > 0
        
        # Verify tool structure
        for tool in tools:
            assert 'name' in tool
            assert 'description' in tool
            assert 'tool_type' in tool
            assert 'capabilities' in tool
    
    @pytest.mark.asyncio
    async def test_tool_execution(self, tool_manager):
        """Test tool execution"""
        result = await tool_manager.execute_tool(
            'search_tool',
            query="test query",
            limit=5
        )
        
        assert result.tool_name == 'search_tool'
        assert isinstance(result.success, bool)
        assert result.execution_time >= 0
        
        if result.success:
            assert result.result is not None
        else:
            assert result.error is not None
    
    @pytest.mark.asyncio
    async def test_tool_selection(self, tool_manager):
        """Test intelligent tool selection"""
        requirements = {
            'capability': 'web_search',
            'input_type': 'string',
            'output_type': 'list',
            'performance_priority': 'speed'
        }
        
        result = await tool_manager.select_and_execute(
            requirements,
            query="test search",
            limit=3
        )
        
        assert isinstance(result.success, bool)
        assert result.execution_time >= 0


class TestMemorySystem:
    """Test suite for the Memory System"""
    
    @pytest.fixture
    async def memory_system(self):
        """Create a memory system for testing"""
        # Use temporary directory for testing
        temp_dir = tempfile.mkdtemp()
        system = MemorySystem(temp_dir)
        yield system
        
        # Cleanup
        await system.cleanup()
        shutil.rmtree(temp_dir, ignore_errors=True)
    
    @pytest.mark.asyncio
    async def test_store_and_retrieve_memory(self, memory_system):
        """Test memory storage and retrieval"""
        # Store a memory
        memory_id = await memory_system.store_memory(
            content="Test memory content",
            memory_type=MemoryType.WORKING,
            tags=["test", "memory"],
            importance_score=0.8
        )
        
        assert memory_id != ""
        
        # Retrieve the memory
        retrieved = await memory_system.retrieve_memory(memory_id)
        assert retrieved is not None
        assert retrieved.content == "Test memory content"
        assert "test" in retrieved.tags
        assert retrieved.importance_score == 0.8
    
    @pytest.mark.asyncio
    async def test_search_memories(self, memory_system):
        """Test memory search functionality"""
        # Store multiple memories
        await memory_system.store_memory(
            "AI research findings",
            MemoryType.SEMANTIC,
            tags=["AI", "research"],
            importance_score=0.9
        )
        
        await memory_system.store_memory(
            "Machine learning concepts",
            MemoryType.SEMANTIC,
            tags=["ML", "concepts"],
            importance_score=0.7
        )
        
        # Search for memories
        results = await memory_system.search_memories({
            'tags': ['AI'],
            'min_importance': 0.5,
            'limit': 10
        })
        
        assert len(results) > 0
        assert any("AI" in memory.tags for memory in results)
    
    @pytest.mark.asyncio
    async def test_memory_statistics(self, memory_system):
        """Test memory statistics"""
        # Store some memories
        for i in range(5):
            await memory_system.store_memory(
                f"Test memory {i}",
                MemoryType.WORKING,
                importance_score=0.5 + (i * 0.1)
            )
        
        stats = await memory_system.get_memory_stats()
        assert 'working' in stats
        assert stats['working']['total_items'] >= 5


class TestLearningSystem:
    """Test suite for the Learning System"""
    
    @pytest.fixture
    async def learning_system(self):
        """Create a learning system for testing"""
        return LearningSystem()
    
    @pytest.mark.asyncio
    async def test_record_learning_event(self, learning_system):
        """Test learning event recording"""
        event_id = await learning_system.record_learning_event(
            event_type="test_event",
            context={"task_type": "test", "user_intent": "testing"},
            action_taken={"type": "test_action", "parameters": {}},
            outcome={"success": True, "execution_time": 1.0}
        )
        
        assert event_id != ""
        
        # Check that event was recorded
        stats = learning_system.get_learning_stats()
        assert stats['total_events'] > 0
    
    @pytest.mark.asyncio
    async def test_prediction(self, learning_system):
        """Test action prediction"""
        # Record some learning events first
        for i in range(3):
            await learning_system.record_learning_event(
                event_type="prediction_test",
                context={"task_type": "test", "scenario": f"scenario_{i}"},
                action_taken={"type": "test_action", "value": i},
                outcome={"success": True, "quality_score": 0.8}
            )
        
        # Try to get a prediction
        prediction = await learning_system.predict_best_action({
            "task_type": "test",
            "scenario": "scenario_1"
        })
        
        # Prediction might be None if not enough patterns learned
        if prediction:
            assert 'action' in prediction
            assert 'confidence' in prediction
    
    @pytest.mark.asyncio
    async def test_feedback_provision(self, learning_system):
        """Test feedback provision"""
        # Record an event
        event_id = await learning_system.record_learning_event(
            event_type="feedback_test",
            context={"task_type": "test"},
            action_taken={"type": "test_action"},
            outcome={"success": True}
        )
        
        # Provide feedback
        await learning_system.provide_feedback(
            event_id,
            FeedbackType.POSITIVE,
            {"user_satisfaction": 0.9}
        )
        
        # Verify feedback was recorded (check through stats)
        stats = learning_system.get_learning_stats()
        assert stats['total_events'] > 0


class TestAIDesktopSystem:
    """Test suite for the complete AI Desktop System"""
    
    @pytest.fixture
    async def ai_system(self):
        """Create an AI desktop system for testing"""
        # Use temporary directory for testing
        temp_dir = tempfile.mkdtemp()
        config = {
            'memory_data_dir': temp_dir,
            'log_level': 'WARNING',  # Reduce log noise in tests
            'learning_enabled': True
        }
        
        system = AIDesktopSystem(config)
        yield system
        
        # Cleanup
        await system.cleanup()
        shutil.rmtree(temp_dir, ignore_errors=True)
    
    @pytest.mark.asyncio
    async def test_process_user_request(self, ai_system):
        """Test complete user request processing"""
        response = await ai_system.process_user_request(
            "Test user request for system integration",
            context={"test_mode": True}
        )
        
        assert 'success' in response
        assert 'message' in response
        assert 'metadata' in response
        assert 'request_id' in response['metadata']
        assert 'execution_time' in response['metadata']
    
    @pytest.mark.asyncio
    async def test_session_continuity(self, ai_system):
        """Test session continuity across multiple requests"""
        session_id = "test_session_001"
        
        # First request
        response1 = await ai_system.process_user_request(
            "Tell me about AI",
            session_id=session_id
        )
        
        # Second request in same session
        response2 = await ai_system.process_user_request(
            "What are the applications?",
            session_id=session_id
        )
        
        assert response1['metadata']['session_id'] == session_id
        assert response2['metadata']['session_id'] == session_id
        
        # Verify session exists
        assert session_id in ai_system.active_sessions
    
    @pytest.mark.asyncio
    async def test_feedback_integration(self, ai_system):
        """Test feedback integration"""
        response = await ai_system.process_user_request("Test request for feedback")
        
        # Provide feedback
        await ai_system.provide_feedback(
            response['metadata']['request_id'],
            'positive',
            {'user_satisfaction': 0.9}
        )
        
        # Verify feedback was processed (no exception should be raised)
        assert True  # If we get here, feedback was processed successfully
    
    @pytest.mark.asyncio
    async def test_system_status(self, ai_system):
        """Test system status reporting"""
        # Process a request to generate some activity
        await ai_system.process_user_request("Test request for status")
        
        status = ai_system.get_system_status()
        
        assert 'system_health' in status
        assert 'uptime_seconds' in status
        assert 'metrics' in status
        assert 'components' in status
        assert 'learning_stats' in status
        
        # Verify metrics
        metrics = status['metrics']
        assert metrics['total_requests'] > 0
        assert metrics['uptime_start'] is not None


class TestIntegration:
    """Integration tests for component interactions"""
    
    @pytest.fixture
    async def full_system(self):
        """Create a full system for integration testing"""
        temp_dir = tempfile.mkdtemp()
        config = {
            'memory_data_dir': temp_dir,
            'log_level': 'WARNING',
            'learning_enabled': True,
            'auto_consolidation': False  # Disable for testing
        }
        
        system = AIDesktopSystem(config)
        yield system
        
        await system.cleanup()
        shutil.rmtree(temp_dir, ignore_errors=True)
    
    @pytest.mark.asyncio
    async def test_research_to_memory_flow(self, full_system):
        """Test research results being stored in memory"""
        # Process a research request
        response = await full_system.process_user_request(
            "Research machine learning algorithms"
        )
        
        # Check that memories were created
        memories = await full_system.memory_system.search_memories({
            'tags': ['user_interaction'],
            'limit': 10
        })
        
        assert len(memories) > 0
    
    @pytest.mark.asyncio
    async def test_learning_from_experience(self, full_system):
        """Test that the system learns from experiences"""
        initial_stats = full_system.learning_system.get_learning_stats()
        initial_events = initial_stats['total_events']
        
        # Process several similar requests
        for i in range(3):
            response = await full_system.process_user_request(
                f"Analyze data set {i}",
                context={"analysis_type": "statistical"}
            )
            
            # Provide feedback
            await full_system.provide_feedback(
                response['metadata']['request_id'],
                'positive',
                {'user_satisfaction': 0.8}
            )
        
        # Check that learning events were recorded
        final_stats = full_system.learning_system.get_learning_stats()
        assert final_stats['total_events'] > initial_events
    
    @pytest.mark.asyncio
    async def test_decision_to_execution_flow(self, full_system):
        """Test decision making to execution flow"""
        response = await full_system.process_user_request(
            "Create a comprehensive analysis of neural networks"
        )
        
        # Verify that tasks were created and executed
        metadata = response['metadata']
        assert metadata['tasks_created'] > 0
        
        # Verify response structure
        assert 'summary' in response
        summary = response['summary']
        assert 'total_tasks' in summary
        assert 'successful_tasks' in summary


# Performance tests
class TestPerformance:
    """Performance tests for the system"""
    
    @pytest.mark.asyncio
    async def test_concurrent_requests(self):
        """Test handling concurrent requests"""
        temp_dir = tempfile.mkdtemp()
        config = {
            'memory_data_dir': temp_dir,
            'log_level': 'ERROR',  # Minimize logging for performance test
            'max_concurrent_tasks': 5
        }
        
        system = AIDesktopSystem(config)
        
        try:
            # Create multiple concurrent requests
            tasks = []
            for i in range(5):
                task = system.process_user_request(f"Test concurrent request {i}")
                tasks.append(task)
            
            # Wait for all to complete
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Verify all completed successfully
            successful_responses = [r for r in responses if isinstance(r, dict) and r.get('success')]
            assert len(successful_responses) > 0
            
        finally:
            await system.cleanup()
            shutil.rmtree(temp_dir, ignore_errors=True)
    
    @pytest.mark.asyncio
    async def test_response_time(self):
        """Test response time performance"""
        temp_dir = tempfile.mkdtemp()
        system = AIDesktopSystem({'memory_data_dir': temp_dir, 'log_level': 'ERROR'})
        
        try:
            start_time = datetime.now()
            
            response = await system.process_user_request("Quick test request")
            
            end_time = datetime.now()
            response_time = (end_time - start_time).total_seconds()
            
            # Response should be reasonably fast (under 10 seconds for simple request)
            assert response_time < 10.0
            assert response['metadata']['execution_time'] > 0
            
        finally:
            await system.cleanup()
            shutil.rmtree(temp_dir, ignore_errors=True)


# Test configuration
def pytest_configure(config):
    """Configure pytest"""
    config.addinivalue_line(
        "markers", "asyncio: mark test as async"
    )


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "--tb=short"])

