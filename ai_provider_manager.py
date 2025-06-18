"""
AI Provider Manager - Handles multiple AI providers (OpenAI, Claude, Ollama)
"""

import asyncio
import logging
import aiohttp
import json
from typing import Dict, List, Optional, Any
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum


class ProviderType(Enum):
    OPENAI = "openai"
    CLAUDE = "claude"
    OLLAMA = "ollama"


@dataclass
class AIResponse:
    """Standard AI response format"""
    message: str
    actions: List[Dict[str, Any]]
    metadata: Dict[str, Any]
    provider: str
    model: str
    usage: Dict[str, Any]


class BaseAIProvider(ABC):
    """Base class for AI providers"""
    
    def __init__(self, name: str, config: Dict[str, Any]):
        self.name = name
        self.config = config
        self.logger = logging.getLogger(f"AIProvider.{name}")
        self.is_configured = False
    
    @abstractmethod
    async def configure(self, api_key: str, settings: Dict[str, Any]) -> bool:
        """Configure the provider with API key and settings"""
        pass
    
    @abstractmethod
    async def process_request(self, message: str, context: Dict[str, Any]) -> AIResponse:
        """Process a request and return AI response"""
        pass
    
    @abstractmethod
    async def test_connection(self) -> bool:
        """Test if the provider is working"""
        pass
    
    def get_status(self) -> Dict[str, Any]:
        """Get provider status"""
        return {
            "name": self.name,
            "configured": self.is_configured,
            "type": self.config.get("type", "unknown")
        }


class OpenAIProvider(BaseAIProvider):
    """OpenAI API provider"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__("OpenAI", config)
        self.api_key = None
        self.base_url = "https://api.openai.com/v1"
        self.model = config.get("default_model", "gpt-4")
    
    async def configure(self, api_key: str, settings: Dict[str, Any]) -> bool:
        """Configure OpenAI provider"""
        try:
            self.api_key = api_key
            self.model = settings.get("model", self.model)
            
            # Test the configuration
            if await self.test_connection():
                self.is_configured = True
                self.logger.info("OpenAI provider configured successfully")
                return True
            else:
                self.logger.error("OpenAI configuration test failed")
                return False
                
        except Exception as e:
            self.logger.error(f"OpenAI configuration error: {str(e)}")
            return False
    
    async def process_request(self, message: str, context: Dict[str, Any]) -> AIResponse:
        """Process request through OpenAI API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Build messages from context
            messages = self._build_messages(message, context)
            
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 2000
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_openai_response(data)
                    else:
                        error_text = await response.text()
                        raise Exception(f"OpenAI API error: {response.status} - {error_text}")
        
        except Exception as e:
            self.logger.error(f"OpenAI request error: {str(e)}")
            raise
    
    async def test_connection(self) -> bool:
        """Test OpenAI connection"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/models",
                    headers=headers
                ) as response:
                    return response.status == 200
        
        except Exception as e:
            self.logger.error(f"OpenAI connection test failed: {str(e)}")
            return False
    
    def _build_messages(self, message: str, context: Dict[str, Any]) -> List[Dict[str, str]]:
        """Build message array for OpenAI API"""
        messages = [
            {
                "role": "system",
                "content": self._get_system_prompt(context)
            }
        ]
        
        # Add session history
        session_history = context.get("session_history", [])
        for msg in session_history[-5:]:  # Last 5 messages
            messages.append({
                "role": "user" if msg.get("role") == "user" else "assistant",
                "content": msg.get("content", "")
            })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": message
        })
        
        return messages
    
    def _get_system_prompt(self, context: Dict[str, Any]) -> str:
        """Get system prompt based on context"""
        permissions = context.get("user_permissions", {})
        available_modules = context.get("available_modules", [])
        
        prompt = """You are an AI assistant with access to various automation modules. 
        You can help users with tasks and execute actions through available modules.
        
        Available modules: """ + ", ".join(available_modules) + """
        
        When you want to execute an action, include it in your response using this format:
        ACTION: {"module": "module_name", "action": "action_name", "parameters": {...}}
        
        Always consider user permissions and only suggest actions they can perform.
        Be helpful, accurate, and efficient in your responses."""
        
        return prompt
    
    def _parse_openai_response(self, data: Dict[str, Any]) -> AIResponse:
        """Parse OpenAI API response"""
        choice = data["choices"][0]
        content = choice["message"]["content"]
        
        # Extract actions from response
        actions = self._extract_actions(content)
        
        # Clean message (remove action markers)
        clean_message = self._clean_message(content)
        
        return AIResponse(
            message=clean_message,
            actions=actions,
            metadata={
                "finish_reason": choice.get("finish_reason"),
                "model": data.get("model")
            },
            provider="openai",
            model=data.get("model", self.model),
            usage=data.get("usage", {})
        )
    
    def _extract_actions(self, content: str) -> List[Dict[str, Any]]:
        """Extract action commands from response"""
        actions = []
        lines = content.split('\n')
        
        for line in lines:
            if line.strip().startswith("ACTION:"):
                try:
                    action_json = line.replace("ACTION:", "").strip()
                    action = json.loads(action_json)
                    actions.append(action)
                except json.JSONDecodeError:
                    self.logger.warning(f"Failed to parse action: {line}")
        
        return actions
    
    def _clean_message(self, content: str) -> str:
        """Remove action markers from message"""
        lines = content.split('\n')
        clean_lines = [line for line in lines if not line.strip().startswith("ACTION:")]
        return '\n'.join(clean_lines).strip()


class ClaudeProvider(BaseAIProvider):
    """Anthropic Claude API provider"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__("Claude", config)
        self.api_key = None
        self.base_url = "https://api.anthropic.com/v1"
        self.model = config.get("default_model", "claude-3-sonnet-20240229")
    
    async def configure(self, api_key: str, settings: Dict[str, Any]) -> bool:
        """Configure Claude provider"""
        try:
            self.api_key = api_key
            self.model = settings.get("model", self.model)
            
            if await self.test_connection():
                self.is_configured = True
                self.logger.info("Claude provider configured successfully")
                return True
            else:
                self.logger.error("Claude configuration test failed")
                return False
                
        except Exception as e:
            self.logger.error(f"Claude configuration error: {str(e)}")
            return False
    
    async def process_request(self, message: str, context: Dict[str, Any]) -> AIResponse:
        """Process request through Claude API"""
        try:
            headers = {
                "x-api-key": self.api_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
            
            # Build messages for Claude
            messages = self._build_claude_messages(message, context)
            
            payload = {
                "model": self.model,
                "max_tokens": 2000,
                "messages": messages,
                "system": self._get_system_prompt(context)
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/messages",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_claude_response(data)
                    else:
                        error_text = await response.text()
                        raise Exception(f"Claude API error: {response.status} - {error_text}")
        
        except Exception as e:
            self.logger.error(f"Claude request error: {str(e)}")
            raise
    
    async def test_connection(self) -> bool:
        """Test Claude connection"""
        try:
            headers = {
                "x-api-key": self.api_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
            
            # Simple test message
            payload = {
                "model": self.model,
                "max_tokens": 10,
                "messages": [{"role": "user", "content": "Hello"}]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/messages",
                    headers=headers,
                    json=payload
                ) as response:
                    return response.status == 200
        
        except Exception as e:
            self.logger.error(f"Claude connection test failed: {str(e)}")
            return False
    
    def _build_claude_messages(self, message: str, context: Dict[str, Any]) -> List[Dict[str, str]]:
        """Build message array for Claude API"""
        messages = []
        
        # Add session history
        session_history = context.get("session_history", [])
        for msg in session_history[-5:]:  # Last 5 messages
            messages.append({
                "role": "user" if msg.get("role") == "user" else "assistant",
                "content": msg.get("content", "")
            })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": message
        })
        
        return messages
    
    def _get_system_prompt(self, context: Dict[str, Any]) -> str:
        """Get system prompt for Claude"""
        # Similar to OpenAI but adapted for Claude's format
        permissions = context.get("user_permissions", {})
        available_modules = context.get("available_modules", [])
        
        prompt = f"""You are an AI assistant with access to various automation modules. 
        You can help users with tasks and execute actions through available modules.
        
        Available modules: {", ".join(available_modules)}
        
        When you want to execute an action, include it in your response using this format:
        ACTION: {{"module": "module_name", "action": "action_name", "parameters": {{...}}}}
        
        Always consider user permissions and only suggest actions they can perform.
        Be helpful, accurate, and efficient in your responses."""
        
        return prompt
    
    def _parse_claude_response(self, data: Dict[str, Any]) -> AIResponse:
        """Parse Claude API response"""
        content = data["content"][0]["text"]
        
        # Extract actions from response
        actions = self._extract_actions(content)
        
        # Clean message
        clean_message = self._clean_message(content)
        
        return AIResponse(
            message=clean_message,
            actions=actions,
            metadata={
                "stop_reason": data.get("stop_reason"),
                "model": data.get("model")
            },
            provider="claude",
            model=data.get("model", self.model),
            usage=data.get("usage", {})
        )
    
    def _extract_actions(self, content: str) -> List[Dict[str, Any]]:
        """Extract action commands from response"""
        # Same logic as OpenAI
        actions = []
        lines = content.split('\n')
        
        for line in lines:
            if line.strip().startswith("ACTION:"):
                try:
                    action_json = line.replace("ACTION:", "").strip()
                    action = json.loads(action_json)
                    actions.append(action)
                except json.JSONDecodeError:
                    self.logger.warning(f"Failed to parse action: {line}")
        
        return actions
    
    def _clean_message(self, content: str) -> str:
        """Remove action markers from message"""
        lines = content.split('\n')
        clean_lines = [line for line in lines if not line.strip().startswith("ACTION:")]
        return '\n'.join(clean_lines).strip()


class OllamaProvider(BaseAIProvider):
    """Local Ollama provider"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__("Ollama", config)
        self.base_url = config.get("base_url", "http://localhost:11434")
        self.model = config.get("default_model", "llama2")
    
    async def configure(self, api_key: str, settings: Dict[str, Any]) -> bool:
        """Configure Ollama provider (no API key needed)"""
        try:
            self.base_url = settings.get("base_url", self.base_url)
            self.model = settings.get("model", self.model)
            
            if await self.test_connection():
                self.is_configured = True
                self.logger.info("Ollama provider configured successfully")
                return True
            else:
                self.logger.error("Ollama configuration test failed")
                return False
                
        except Exception as e:
            self.logger.error(f"Ollama configuration error: {str(e)}")
            return False
    
    async def process_request(self, message: str, context: Dict[str, Any]) -> AIResponse:
        """Process request through Ollama API"""
        try:
            # Build prompt with context
            full_prompt = self._build_ollama_prompt(message, context)
            
            payload = {
                "model": self.model,
                "prompt": full_prompt,
                "stream": False
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_ollama_response(data)
                    else:
                        error_text = await response.text()
                        raise Exception(f"Ollama API error: {response.status} - {error_text}")
        
        except Exception as e:
            self.logger.error(f"Ollama request error: {str(e)}")
            raise
    
    async def test_connection(self) -> bool:
        """Test Ollama connection"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/tags") as response:
                    return response.status == 200
        
        except Exception as e:
            self.logger.error(f"Ollama connection test failed: {str(e)}")
            return False
    
    def _build_ollama_prompt(self, message: str, context: Dict[str, Any]) -> str:
        """Build prompt for Ollama"""
        system_prompt = self._get_system_prompt(context)
        
        # Add session history
        conversation = ""
        session_history = context.get("session_history", [])
        for msg in session_history[-3:]:  # Last 3 messages
            role = "Human" if msg.get("role") == "user" else "Assistant"
            conversation += f"{role}: {msg.get('content', '')}\n"
        
        # Add current message
        conversation += f"Human: {message}\nAssistant: "
        
        return f"{system_prompt}\n\n{conversation}"
    
    def _get_system_prompt(self, context: Dict[str, Any]) -> str:
        """Get system prompt for Ollama"""
        available_modules = context.get("available_modules", [])
        
        prompt = f"""You are an AI assistant with access to various automation modules. 
        You can help users with tasks and execute actions through available modules.
        
        Available modules: {", ".join(available_modules)}
        
        When you want to execute an action, include it in your response using this format:
        ACTION: {{"module": "module_name", "action": "action_name", "parameters": {{...}}}}
        
        Be helpful, accurate, and efficient in your responses."""
        
        return prompt
    
    def _parse_ollama_response(self, data: Dict[str, Any]) -> AIResponse:
        """Parse Ollama API response"""
        content = data.get("response", "")
        
        # Extract actions from response
        actions = self._extract_actions(content)
        
        # Clean message
        clean_message = self._clean_message(content)
        
        return AIResponse(
            message=clean_message,
            actions=actions,
            metadata={
                "done": data.get("done", False),
                "context": data.get("context", [])
            },
            provider="ollama",
            model=self.model,
            usage={
                "eval_count": data.get("eval_count", 0),
                "eval_duration": data.get("eval_duration", 0)
            }
        )
    
    def _extract_actions(self, content: str) -> List[Dict[str, Any]]:
        """Extract action commands from response"""
        actions = []
        lines = content.split('\n')
        
        for line in lines:
            if line.strip().startswith("ACTION:"):
                try:
                    action_json = line.replace("ACTION:", "").strip()
                    action = json.loads(action_json)
                    actions.append(action)
                except json.JSONDecodeError:
                    self.logger.warning(f"Failed to parse action: {line}")
        
        return actions
    
    def _clean_message(self, content: str) -> str:
        """Remove action markers from message"""
        lines = content.split('\n')
        clean_lines = [line for line in lines if not line.strip().startswith("ACTION:")]
        return '\n'.join(clean_lines).strip()


class AIProviderManager:
    """Manages multiple AI providers"""
    
    def __init__(self):
        self.providers: Dict[str, BaseAIProvider] = {}
        self.logger = logging.getLogger("AIProviderManager")
        
        # Initialize providers
        self._initialize_providers()
    
    def _initialize_providers(self):
        """Initialize all available providers"""
        # OpenAI
        self.providers["openai"] = OpenAIProvider({
            "type": "openai",
            "default_model": "gpt-4"
        })
        
        # Claude
        self.providers["claude"] = ClaudeProvider({
            "type": "claude",
            "default_model": "claude-3-sonnet-20240229"
        })
        
        # Ollama
        self.providers["ollama"] = OllamaProvider({
            "type": "ollama",
            "default_model": "llama2",
            "base_url": "http://localhost:11434"
        })
        
        self.logger.info(f"Initialized {len(self.providers)} AI providers")
    
    async def configure_provider(self, provider_name: str, api_key: str, settings: Dict[str, Any]) -> bool:
        """Configure a specific provider"""
        if provider_name not in self.providers:
            self.logger.error(f"Unknown provider: {provider_name}")
            return False
        
        provider = self.providers[provider_name]
        return await provider.configure(api_key, settings)
    
    async def get_provider(self, provider_name: str) -> Optional[BaseAIProvider]:
        """Get a configured provider"""
        if provider_name not in self.providers:
            return None
        
        provider = self.providers[provider_name]
        if not provider.is_configured:
            self.logger.warning(f"Provider {provider_name} is not configured")
            return None
        
        return provider
    
    def get_available_providers(self) -> List[Dict[str, Any]]:
        """Get list of available providers"""
        return [
            {
                "name": name,
                "type": provider.config.get("type", "unknown"),
                "configured": provider.is_configured
            }
            for name, provider in self.providers.items()
        ]
    
    def get_provider_status(self) -> Dict[str, Dict[str, Any]]:
        """Get status of all providers"""
        return {
            name: provider.get_status()
            for name, provider in self.providers.items()
        }

