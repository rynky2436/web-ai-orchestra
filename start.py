#!/usr/bin/env python3
"""
AI Desktop Platform - Startup Script
Quick setup and launch script for the platform
"""

import os
import sys
import subprocess
import json
import time
from pathlib import Path


def print_banner():
    """Print startup banner"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║              🚀 AI Desktop Platform 🚀                      ║
    ║                                                              ║
    ║         Revolutionary AI Automation System                   ║
    ║              No Handcuffs • Full Power                       ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)


def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")


def install_dependencies():
    """Install Python dependencies"""
    print("\n📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False
    return True


def setup_directories():
    """Create necessary directories"""
    print("\n📁 Setting up directories...")
    directories = [
        "data",
        "temp",
        "temp/coding",
        "logs",
        "config"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
    
    print("✅ Directories created")


def create_default_config():
    """Create default configuration if it doesn't exist"""
    config_path = Path("config/server_config.json")
    
    if not config_path.exists():
        print("\n⚙️ Creating default configuration...")
        
        default_config = {
            "server": {
                "host": "0.0.0.0",
                "port": 7777,
                "debug": False
            },
            "ai_providers": {
                "openai": {
                    "enabled": True,
                    "api_key": "",
                    "default_model": "gpt-4"
                },
                "claude": {
                    "enabled": True,
                    "api_key": "",
                    "default_model": "claude-3-sonnet-20240229"
                },
                "ollama": {
                    "enabled": True,
                    "base_url": "http://localhost:11434",
                    "default_model": "llama2"
                }
            },
            "modules": {
                "coding_agent": {"enabled": True},
                "browser_automation": {"enabled": True},
                "file_manager": {"enabled": True},
                "voice_interface": {"enabled": True}
            }
        }
        
        with open(config_path, 'w') as f:
            json.dump(default_config, f, indent=2)
        
        print("✅ Default configuration created")


def build_frontend():
    """Build the React frontend"""
    print("\n🔨 Building frontend...")
    frontend_path = Path("server/frontend/ai-platform-frontend")
    
    if not frontend_path.exists():
        print("❌ Frontend directory not found")
        return False
    
    try:
        # Install npm dependencies
        subprocess.run(["npm", "install"], cwd=frontend_path, check=True, capture_output=True)
        
        # Build the frontend
        subprocess.run(["npm", "run", "build"], cwd=frontend_path, check=True, capture_output=True)
        
        print("✅ Frontend built successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to build frontend: {e}")
        return False


def check_ollama():
    """Check if Ollama is running (optional)"""
    print("\n🦙 Checking Ollama status...")
    try:
        import aiohttp
        import asyncio
        
        async def check_ollama_async():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get("http://localhost:11434/api/tags", timeout=5) as response:
                        return response.status == 200
            except:
                return False
        
        is_running = asyncio.run(check_ollama_async())
        
        if is_running:
            print("✅ Ollama is running and available")
        else:
            print("⚠️ Ollama not detected (optional - you can still use OpenAI/Claude)")
    except ImportError:
        print("⚠️ Cannot check Ollama status (aiohttp not installed yet)")


def start_server():
    """Start the AI Desktop Platform server"""
    print("\n🚀 Starting AI Desktop Platform...")
    print("📍 Server will be available at: http://localhost:7777")
    print("🔗 WebSocket endpoint: ws://localhost:7777/ws/{user_id}")
    print("\n" + "="*60)
    print("🎯 READY TO REVOLUTIONIZE YOUR WORKFLOW!")
    print("="*60)
    
    try:
        # Change to server backend directory
        os.chdir("server/backend")
        
        # Start the server
        subprocess.run([sys.executable, "main_server.py"], check=True)
    except KeyboardInterrupt:
        print("\n\n👋 AI Desktop Platform stopped")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Server failed to start: {e}")


def main():
    """Main startup function"""
    print_banner()
    
    # Check system requirements
    check_python_version()
    
    # Setup
    setup_directories()
    create_default_config()
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed. Please check the error messages above.")
        sys.exit(1)
    
    # Build frontend
    if not build_frontend():
        print("\n⚠️ Frontend build failed, but server can still run")
    
    # Optional checks
    check_ollama()
    
    # Start server
    print("\n" + "="*60)
    print("🎉 SETUP COMPLETE!")
    print("="*60)
    print("\n💡 Quick Start Tips:")
    print("   1. Open http://localhost:7777 in your browser")
    print("   2. Configure your AI provider API keys in Settings")
    print("   3. Enable modules you want to use")
    print("   4. Start chatting and automating!")
    print("\n🔧 For local deployment with full access:")
    print("   - Switch to 'Local' mode in Settings")
    print("   - Grant permissions as needed")
    print("   - Enjoy unrestricted AI automation!")
    
    input("\n📍 Press Enter to start the server...")
    start_server()


if __name__ == "__main__":
    main()

