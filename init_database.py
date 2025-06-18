#!/usr/bin/env python3
"""
AI Desktop System - Database Initialization Script

This script initializes the database and sets up the initial system state.

Author: Manus AI
Date: June 17, 2025
"""

import os
import sqlite3
import asyncio
from datetime import datetime
import sys

# Add parent directory to path
sys.path.append('..')

from core.memory_system.memory_system import MemorySystem, MemoryType


async def initialize_database():
    """Initialize the database and create necessary tables"""
    print("🗄️  Initializing AI Desktop System Database...")
    
    # Create data directory if it doesn't exist
    data_dir = "data/memory"
    os.makedirs(data_dir, exist_ok=True)
    
    # Initialize memory system (this will create the databases)
    memory_system = MemorySystem(data_dir)
    
    print("✅ Database tables created successfully")
    
    # Add some initial semantic knowledge
    print("📚 Adding initial knowledge base...")
    
    initial_knowledge = [
        {
            'content': 'AI agents are autonomous software entities that can perceive their environment and take actions to achieve goals',
            'concept': 'AI agents',
            'tags': ['AI', 'agents', 'autonomous', 'software'],
            'importance': 0.9
        },
        {
            'content': 'Decision-making in AI systems often involves multiple levels: strategic, tactical, and operational',
            'concept': 'AI decision-making',
            'tags': ['AI', 'decision-making', 'strategy', 'tactics'],
            'importance': 0.8
        },
        {
            'content': 'Multi-agent systems consist of multiple interacting intelligent agents working together to solve complex problems',
            'concept': 'multi-agent systems',
            'tags': ['multi-agent', 'collaboration', 'distributed', 'AI'],
            'importance': 0.8
        },
        {
            'content': 'Tool selection in AI systems should consider performance requirements, accuracy needs, and resource constraints',
            'concept': 'tool selection',
            'tags': ['tools', 'selection', 'performance', 'AI'],
            'importance': 0.7
        },
        {
            'content': 'Memory systems in AI can be hierarchical, including working memory, episodic memory, and semantic memory',
            'concept': 'AI memory systems',
            'tags': ['memory', 'hierarchical', 'episodic', 'semantic'],
            'importance': 0.8
        }
    ]
    
    for knowledge in initial_knowledge:
        await memory_system.store_memory(
            content=knowledge['content'],
            memory_type=MemoryType.SEMANTIC,
            concept=knowledge['concept'],
            tags=set(knowledge['tags']),
            importance_score=knowledge['importance'],
            source='initial_knowledge_base'
        )
    
    print(f"✅ Added {len(initial_knowledge)} knowledge entries")
    
    # Cleanup
    await memory_system.cleanup()
    
    print("🎉 Database initialization completed successfully!")


def create_config_files():
    """Create default configuration files"""
    print("⚙️  Creating configuration files...")
    
    # Create config directory
    os.makedirs("config", exist_ok=True)
    
    # System configuration
    system_config = """# AI Desktop System Configuration

# System settings
log_level: INFO
max_concurrent_tasks: 10
default_task_timeout: 300  # seconds

# Memory system settings
memory_data_dir: data/memory
memory_consolidation_interval: 21600  # 6 hours in seconds
max_working_memory_items: 1000
importance_threshold_for_longterm: 0.7

# Learning system settings
learning_enabled: true
auto_consolidation: true
learning_rate: 0.1
exploration_rate: 0.1
pattern_similarity_threshold: 0.7

# Research system settings
default_research_depth: 3
max_research_time: 300  # seconds
parallel_research_streams: 3

# Tool management settings
tool_selection_strategy: balanced  # speed, accuracy, balanced
tool_timeout: 60  # seconds
max_tool_retries: 3

# Decision engine settings
strategic_planning_enabled: true
tactical_coordination_enabled: true
operational_execution_enabled: true

# Performance settings
cache_enabled: true
cache_ttl: 3600  # seconds
batch_processing_enabled: true
max_batch_size: 10
"""
    
    with open("config/system_config.yaml", "w") as f:
        f.write(system_config)
    
    print("✅ Configuration files created")


def create_startup_script():
    """Create a startup script for the system"""
    print("🚀 Creating startup script...")
    
    startup_script = """#!/usr/bin/env python3
\"\"\"
AI Desktop System - Startup Script

This script starts the AI Desktop System with proper initialization.
\"\"\"

import asyncio
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import AIDesktopSystem


async def start_system():
    \"\"\"Start the AI Desktop System\"\"\"
    print("🚀 Starting AI Desktop System...")
    
    # Load configuration
    config = {
        'memory_data_dir': 'data/memory',
        'log_level': 'INFO',
        'learning_enabled': True,
        'auto_consolidation': True
    }
    
    # Initialize system
    system = AIDesktopSystem(config)
    
    print("✅ AI Desktop System started successfully!")
    print("📡 System is ready to process requests")
    
    # Example usage
    print("\\n--- Example Usage ---")
    
    response = await system.process_user_request(
        "Research the latest developments in AI agent architectures"
    )
    
    print(f"Response: {response['message']}")
    print(f"Success: {response['success']}")
    
    # Show system status
    status = system.get_system_status()
    print(f"\\nSystem Status: {status['system_health']}")
    print(f"Total Requests: {status['metrics']['total_requests']}")
    
    # Cleanup
    await system.cleanup()
    print("\\n🛑 System shutdown complete")


if __name__ == "__main__":
    asyncio.run(start_system())
"""
    
    with open("start_system.py", "w") as f:
        f.write(startup_script)
    
    # Make it executable
    os.chmod("start_system.py", 0o755)
    
    print("✅ Startup script created")


def main():
    """Main initialization function"""
    print("🎯 AI Desktop System - Database Initialization")
    print("=" * 50)
    
    try:
        # Create configuration files
        create_config_files()
        
        # Initialize database
        asyncio.run(initialize_database())
        
        # Create startup script
        create_startup_script()
        
        print("\\n🎉 Initialization completed successfully!")
        print("\\nNext steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Run the system: python start_system.py")
        print("3. Or run tests: python -m pytest tests/")
        print("4. Or run demo: python examples/demo.py")
        
    except Exception as e:
        print(f"❌ Initialization failed: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()

