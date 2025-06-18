"""
Configuration Manager - Handles system configuration and settings
"""

import json
import logging
import os
from typing import Dict, Any, Optional
from pathlib import Path


class ConfigManager:
    """Manages system configuration"""
    
    def __init__(self, config_path: str = "config/server_config.json"):
        self.config_path = Path(config_path)
        self.config: Dict[str, Any] = {}
        self.logger = logging.getLogger("ConfigManager")
        
        # Load configuration
        self.load_config()
    
    def load_config(self):
        """Load configuration from file"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r') as f:
                    self.config = json.load(f)
                self.logger.info(f"Loaded configuration from {self.config_path}")
            else:
                # Create default configuration
                self.config = self._get_default_config()
                self.save_config()
                self.logger.info("Created default configuration")
                
        except Exception as e:
            self.logger.error(f"Error loading configuration: {str(e)}")
            self.config = self._get_default_config()
    
    def save_config(self):
        """Save configuration to file"""
        try:
            # Ensure config directory exists
            self.config_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(self.config_path, 'w') as f:
                json.dump(self.config, f, indent=2)
            
            self.logger.info(f"Saved configuration to {self.config_path}")
            
        except Exception as e:
            self.logger.error(f"Error saving configuration: {str(e)}")
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value"""
        keys = key.split('.')
        value = self.config
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def set(self, key: str, value: Any):
        """Set configuration value"""
        keys = key.split('.')
        config = self.config
        
        # Navigate to the parent of the target key
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        
        # Set the value
        config[keys[-1]] = value
        
        # Save configuration
        self.save_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration"""
        return {
            "server": {
                "host": "0.0.0.0",
                "port": 7777,
                "debug": False,
                "cors_origins": ["*"]
            },
            "ai_providers": {
                "openai": {
                    "enabled": True,
                    "default_model": "gpt-4",
                    "api_key": "",
                    "base_url": "https://api.openai.com/v1"
                },
                "claude": {
                    "enabled": True,
                    "default_model": "claude-3-sonnet-20240229",
                    "api_key": "",
                    "base_url": "https://api.anthropic.com/v1"
                },
                "ollama": {
                    "enabled": True,
                    "default_model": "llama2",
                    "base_url": "http://localhost:11434"
                }
            },
            "modules": {
                "coding_agent": {
                    "enabled": True,
                    "work_dir": "temp/coding",
                    "supported_languages": ["python", "javascript", "html", "css", "react"]
                },
                "browser_automation": {
                    "enabled": True,
                    "headless": False,
                    "timeout": 30
                },
                "file_manager": {
                    "enabled": True,
                    "allowed_paths": [],
                    "max_file_size": 104857600  # 100MB
                },
                "voice_interface": {
                    "enabled": True,
                    "elevenlabs_api_key": "",
                    "default_voice_id": "",
                    "default_model_id": "eleven_multilingual_v2"
                }
            },
            "permissions": {
                "default_template": "personal_cloud",
                "session_timeout_hours": 24
            },
            "database": {
                "type": "sqlite",
                "path": "data/ai_platform.db"
            },
            "logging": {
                "level": "INFO",
                "file": "ai_platform.log",
                "max_size": 10485760,  # 10MB
                "backup_count": 5
            },
            "security": {
                "enable_rate_limiting": True,
                "max_requests_per_minute": 60,
                "enable_api_key_auth": False,
                "api_keys": []
            },
            "features": {
                "live_preview": True,
                "voice_interface": True,
                "browser_automation": True,
                "file_management": True,
                "code_execution": True
            }
        }

