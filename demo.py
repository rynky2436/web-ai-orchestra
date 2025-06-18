"""
AI Desktop System - Example Usage and Demonstrations

This module provides comprehensive examples of how to use the AI Desktop System
to simulate intelligent behavior patterns similar to advanced AI assistants.

Author: Manus AI
Date: June 17, 2025
"""

import asyncio
import json
import os
from datetime import datetime
from main import AIDesktopSystem


class AIDesktopDemo:
    """Demonstration class for AI Desktop System capabilities"""
    
    def __init__(self):
        self.system = None
    
    async def initialize_system(self):
        """Initialize the AI Desktop System"""
        print("🚀 Initializing AI Desktop System...")
        
        # Ensure data directory exists
        os.makedirs("data/memory", exist_ok=True)
        
        # Initialize with custom configuration
        config = {
            'memory_data_dir': 'data/memory',
            'log_level': 'INFO',
            'learning_enabled': True,
            'auto_consolidation': True,
            'max_concurrent_tasks': 5
        }
        
        self.system = AIDesktopSystem(config)
        print("✅ AI Desktop System initialized successfully!")
        return self.system
    
    async def demo_research_capabilities(self):
        """Demonstrate research and information gathering capabilities"""
        print("\n" + "="*60)
        print("🔍 RESEARCH CAPABILITIES DEMONSTRATION")
        print("="*60)
        
        research_queries = [
            "What are the latest developments in autonomous AI agents?",
            "Research the benefits and challenges of multi-agent systems",
            "Find information about decision-making frameworks in AI"
        ]
        
        session_id = f"research_demo_{int(datetime.now().timestamp())}"
        
        for i, query in enumerate(research_queries, 1):
            print(f"\n--- Research Query {i} ---")
            print(f"Query: {query}")
            
            response = await self.system.process_user_request(query, session_id)
            
            self._display_response(response)
            
            # Provide positive feedback for successful research
            if response['success']:
                await self.system.provide_feedback(
                    response['metadata']['request_id'],
                    'positive',
                    {'user_satisfaction': 0.9, 'relevance': 0.8}
                )
    
    async def demo_learning_adaptation(self):
        """Demonstrate learning and adaptation capabilities"""
        print("\n" + "="*60)
        print("🧠 LEARNING AND ADAPTATION DEMONSTRATION")
        print("="*60)
        
        # Simulate a series of similar requests to show learning
        learning_scenarios = [
            {
                'request': "Analyze the performance metrics of AI systems",
                'feedback': 'positive',
                'satisfaction': 0.9
            },
            {
                'request': "Analyze the efficiency of machine learning algorithms", 
                'feedback': 'positive',
                'satisfaction': 0.8
            },
            {
                'request': "Analyze the scalability of distributed systems",
                'feedback': 'corrective',
                'satisfaction': 0.6,
                'correction': 'Focus more on technical details'
            },
            {
                'request': "Analyze the security implications of cloud computing",
                'feedback': 'positive',
                'satisfaction': 0.9
            }
        ]
        
        session_id = f"learning_demo_{int(datetime.now().timestamp())}"
        
        print("Processing similar requests to demonstrate learning...")
        
        for i, scenario in enumerate(learning_scenarios, 1):
            print(f"\n--- Learning Scenario {i} ---")
            print(f"Request: {scenario['request']}")
            
            response = await self.system.process_user_request(scenario['request'], session_id)
            
            # Provide feedback
            feedback_data = {
                'user_satisfaction': scenario['satisfaction'],
                'feedback_details': scenario.get('correction', 'Good response')
            }
            
            await self.system.provide_feedback(
                response['metadata']['request_id'],
                scenario['feedback'],
                feedback_data
            )
            
            print(f"Feedback provided: {scenario['feedback']} (satisfaction: {scenario['satisfaction']})")
        
        # Show learning statistics
        learning_stats = self.system.learning_system.get_learning_stats()
        print(f"\n📊 Learning Statistics:")
        print(f"   Total learning events: {learning_stats['total_events']}")
        print(f"   Patterns learned: {learning_stats['patterns_learned']}")
        print(f"   Prediction accuracy: {learning_stats['prediction_accuracy']:.2%}")
    
    async def demo_memory_system(self):
        """Demonstrate memory storage and retrieval capabilities"""
        print("\n" + "="*60)
        print("🧠 MEMORY SYSTEM DEMONSTRATION")
        print("="*60)
        
        # Store some explicit memories
        print("Storing explicit memories...")
        
        memories_to_store = [
            {
                'content': "User prefers detailed technical explanations with examples",
                'memory_type': 'semantic',
                'tags': ['user_preference', 'communication_style'],
                'importance': 0.8
            },
            {
                'content': "Successfully completed research on AI architectures with high user satisfaction",
                'memory_type': 'episodic',
                'tags': ['success', 'research', 'AI'],
                'importance': 0.9,
                'context': {'task_type': 'research', 'outcome': 'success'}
            },
            {
                'content': "Multi-agent systems are effective for complex problem solving",
                'memory_type': 'semantic',
                'tags': ['AI', 'multi-agent', 'knowledge'],
                'importance': 0.7,
                'concept': 'multi-agent systems'
            }
        ]
        
        for memory in memories_to_store:
            memory_id = await self.system.memory_system.store_memory(
                content=memory['content'],
                memory_type=getattr(self.system.memory_system.MemoryType, memory['memory_type'].upper()),
                tags=set(memory['tags']),
                importance_score=memory['importance'],
                **{k: v for k, v in memory.items() if k not in ['content', 'memory_type', 'tags', 'importance']}
            )
            print(f"   Stored memory: {memory_id}")
        
        # Demonstrate memory retrieval
        print("\nRetrieving memories...")
        
        search_queries = [
            {'tags': ['AI'], 'limit': 5},
            {'tags': ['user_preference'], 'limit': 3},
            {'memory_types': ['episodic'], 'min_importance': 0.8}
        ]
        
        for query in search_queries:
            memories = await self.system.memory_system.search_memories(query)
            print(f"   Query {query}: Found {len(memories)} memories")
            for memory in memories[:2]:  # Show first 2
                print(f"     - {memory.content[:60]}... (importance: {memory.importance_score:.2f})")
        
        # Show memory statistics
        memory_stats = await self.system.memory_system.get_memory_stats()
        print(f"\n📊 Memory Statistics:")
        for memory_type, stats in memory_stats.items():
            print(f"   {memory_type}: {stats['total_items']} items (avg importance: {stats['average_importance']:.2f})")
    
    async def demo_decision_making(self):
        """Demonstrate multi-level decision making"""
        print("\n" + "="*60)
        print("🎯 DECISION MAKING DEMONSTRATION")
        print("="*60)
        
        complex_requests = [
            "I need to research AI safety, analyze the findings, and create a comprehensive report",
            "Help me understand quantum computing and its applications in machine learning",
            "Create a detailed comparison of different neural network architectures"
        ]
        
        session_id = f"decision_demo_{int(datetime.now().timestamp())}"
        
        for i, request in enumerate(complex_requests, 1):
            print(f"\n--- Complex Request {i} ---")
            print(f"Request: {request}")
            
            # Show decision-making process
            print("🔄 Decision-making process:")
            
            response = await self.system.process_user_request(request, session_id)
            
            # Show task breakdown
            metadata = response.get('metadata', {})
            print(f"   Tasks created: {metadata.get('tasks_created', 0)}")
            print(f"   Execution time: {metadata.get('execution_time', 0):.2f} seconds")
            
            self._display_response(response)
    
    async def demo_tool_integration(self):
        """Demonstrate tool selection and usage"""
        print("\n" + "="*60)
        print("🔧 TOOL INTEGRATION DEMONSTRATION")
        print("="*60)
        
        # Show available tools
        tools = self.system.tool_manager.list_tools()
        print(f"Available tools: {len(tools)}")
        for tool in tools:
            print(f"   - {tool['name']}: {tool['description']}")
        
        # Demonstrate tool selection for different tasks
        tool_scenarios = [
            {
                'task': 'Search for information about neural networks',
                'expected_tool': 'search_tool'
            },
            {
                'task': 'Analyze text sentiment and complexity',
                'expected_tool': 'analysis_tool'
            }
        ]
        
        for scenario in tool_scenarios:
            print(f"\n--- Tool Selection Scenario ---")
            print(f"Task: {scenario['task']}")
            
            # This would normally be done internally, but we'll demonstrate the selection process
            requirements = {
                'capability': 'web_search' if 'search' in scenario['task'].lower() else 'text_analysis',
                'performance_priority': 'balanced'
            }
            
            selected_tool = await self.system.tool_manager.selector.select_tool(requirements)
            print(f"Selected tool: {selected_tool}")
            print(f"Expected tool: {scenario['expected_tool']}")
            print(f"Match: {'✅' if selected_tool == scenario['expected_tool'] else '❌'}")
    
    async def demo_session_continuity(self):
        """Demonstrate session continuity and context awareness"""
        print("\n" + "="*60)
        print("💬 SESSION CONTINUITY DEMONSTRATION")
        print("="*60)
        
        session_id = f"continuity_demo_{int(datetime.now().timestamp())}"
        
        conversation_flow = [
            "Tell me about machine learning algorithms",
            "Which one is best for image recognition?",
            "How does it compare to traditional computer vision methods?",
            "Can you provide some practical examples?"
        ]
        
        print("Simulating a continuous conversation...")
        
        for i, message in enumerate(conversation_flow, 1):
            print(f"\n--- Turn {i} ---")
            print(f"User: {message}")
            
            response = await self.system.process_user_request(message, session_id)
            
            print(f"AI: {response['message']}")
            
            # Show context awareness
            if i > 1:
                print("🔗 Context awareness: Building on previous conversation")
    
    def _display_response(self, response):
        """Display a formatted response"""
        print(f"✅ Success: {response['success']}")
        print(f"💬 Message: {response['message']}")
        
        if response.get('results'):
            print(f"📋 Results ({len(response['results'])}):")
            for j, result in enumerate(response['results'], 1):
                content = result.get('content', 'No content')
                if len(content) > 100:
                    content = content[:100] + "..."
                print(f"   {j}. {content}")
        
        if response.get('summary'):
            summary = response['summary']
            print(f"📊 Summary: {summary['successful_tasks']}/{summary['total_tasks']} tasks completed")
    
    async def run_comprehensive_demo(self):
        """Run all demonstrations"""
        print("🎭 AI DESKTOP SYSTEM - COMPREHENSIVE DEMONSTRATION")
        print("=" * 80)
        
        try:
            # Initialize system
            await self.initialize_system()
            
            # Run all demonstrations
            await self.demo_research_capabilities()
            await self.demo_learning_adaptation()
            await self.demo_memory_system()
            await self.demo_decision_making()
            await self.demo_tool_integration()
            await self.demo_session_continuity()
            
            # Show final system status
            print("\n" + "="*60)
            print("📊 FINAL SYSTEM STATUS")
            print("="*60)
            
            status = self.system.get_system_status()
            print(f"System health: {status['system_health']}")
            print(f"Uptime: {status['uptime_seconds']:.1f} seconds")
            print(f"Total requests processed: {status['metrics']['total_requests']}")
            print(f"Success rate: {status['metrics']['successful_requests'] / max(status['metrics']['total_requests'], 1):.2%}")
            print(f"Average response time: {status['metrics']['average_response_time']:.2f} seconds")
            print(f"Active sessions: {status['active_sessions']}")
            
            learning_stats = status['learning_stats']
            print(f"\nLearning system:")
            print(f"   Events processed: {learning_stats['total_events']}")
            print(f"   Patterns learned: {learning_stats['patterns_learned']}")
            print(f"   Active patterns: {learning_stats['active_patterns']}")
            
        except Exception as e:
            print(f"❌ Demo failed: {str(e)}")
            raise
        
        finally:
            # Cleanup
            if self.system:
                await self.system.cleanup()
                print("\n🧹 System cleanup completed")
        
        print("\n🎉 Demonstration completed successfully!")


async def main():
    """Main demonstration function"""
    demo = AIDesktopDemo()
    await demo.run_comprehensive_demo()


if __name__ == "__main__":
    asyncio.run(main())

