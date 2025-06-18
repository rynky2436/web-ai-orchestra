"""
AI Provider Manager - Handles multiple AI providers (OpenAI, Claude, Ollama)
"""

import asyncio
import aiohttp
import json
import logging
from typing import Dict, List, Optional, Any
import os
from datetime import datetime

logger = logging.getLogger(__name__)

class AIProviderManager:
    """Manages multiple AI providers and routes requests intelligently"""
    
    def __init__(self):
        self.providers = {}
        self.default_provider = "openai"
        self.provider_configs = {
            "openai": {
                "api_key": os.getenv("OPENAI_API_KEY"),
                "base_url": "https://api.openai.com/v1",
                "model": "gpt-4",
                "max_tokens": 4000,
                "temperature": 0.7
            },
            "anthropic": {
                "api_key": os.getenv("ANTHROPIC_API_KEY"),
                "base_url": "https://api.anthropic.com/v1",
                "model": "claude-3-sonnet-20240229",
                "max_tokens": 4000,
                "temperature": 0.7
            },
            "ollama": {
                "base_url": "http://localhost:11434",
                "model": "llama2",
                "temperature": 0.7
            }
        }
        
    async def initialize(self):
        """Initialize all available AI providers"""
        try:
            # Initialize OpenAI
            if self.provider_configs["openai"]["api_key"]:
                self.providers["openai"] = OpenAIProvider(self.provider_configs["openai"])
                logger.info("OpenAI provider initialized")
            
            # Initialize Anthropic
            if self.provider_configs["anthropic"]["api_key"]:
                self.providers["anthropic"] = AnthropicProvider(self.provider_configs["anthropic"])
                logger.info("Anthropic provider initialized")
            
            # Initialize Ollama (always try, as it's local)
            self.providers["ollama"] = OllamaProvider(self.provider_configs["ollama"])
            logger.info("Ollama provider initialized")
            
            # Set default provider to first available
            if self.providers:
                self.default_provider = list(self.providers.keys())[0]
                logger.info(f"Default provider set to: {self.default_provider}")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize AI providers: {e}")
            return False
    
    async def generate_response(
        self, 
        message: str, 
        context: Dict[str, Any] = None,
        provider: str = None,
        **kwargs
    ) -> str:
        """Generate a response using the specified or default provider"""
        try:
            provider_name = provider or self.default_provider
            
            if provider_name not in self.providers:
                # Fallback to any available provider
                if self.providers:
                    provider_name = list(self.providers.keys())[0]
                else:
                    return "No AI providers are currently available. Please configure your API keys."
            
            provider_instance = self.providers[provider_name]
            response = await provider_instance.generate_response(message, context, **kwargs)
            
            logger.info(f"Generated response using {provider_name}")
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return f"I apologize, but I encountered an error: {str(e)}"
    
    async def get_available_providers(self) -> List[str]:
        """Get list of available providers"""
        return list(self.providers.keys())
    
    async def test_provider(self, provider_name: str) -> bool:
        """Test if a provider is working"""
        try:
            if provider_name not in self.providers:
                return False
            
            provider = self.providers[provider_name]
            test_response = await provider.generate_response("Hello", {})
            return bool(test_response)
            
        except Exception as e:
            logger.error(f"Provider test failed for {provider_name}: {e}")
            return False

class OpenAIProvider:
    """OpenAI API provider"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.api_key = config["api_key"]
        self.base_url = config["base_url"]
        self.model = config["model"]
        
    async def generate_response(
        self, 
        message: str, 
        context: Dict[str, Any] = None,
        **kwargs
    ) -> str:
        """Generate response using OpenAI API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Build messages array
            messages = []
            
            # Add system context if provided
            if context and context.get("system_prompt"):
                messages.append({
                    "role": "system",
                    "content": context["system_prompt"]
                })
            else:
                messages.append({
                    "role": "system",
                    "content": "You are an advanced AI assistant with decision-making capabilities, research skills, and automation expertise. You can help with coding, research, file management, and browser automation."
                })
            
            # Add conversation history if provided
            if context and context.get("conversation_history"):
                for msg in context["conversation_history"][-5:]:  # Last 5 messages
                    if msg["type"] == "user":
                        messages.append({"role": "user", "content": msg["message"]})
                    elif msg["type"] == "assistant":
                        messages.append({"role": "assistant", "content": msg["message"]})
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            payload = {
                "model": self.model,
                "messages": messages,
                "max_tokens": kwargs.get("max_tokens", self.config["max_tokens"]),
                "temperature": kwargs.get("temperature", self.config["temperature"])
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data["choices"][0]["message"]["content"]
                    else:
                        error_text = await response.text()
                        raise Exception(f"OpenAI API error: {response.status} - {error_text}")
                        
        except Exception as e:
            logger.error(f"OpenAI provider error: {e}")
            raise

class AnthropicProvider:
    """Anthropic Claude API provider"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.api_key = config["api_key"]
        self.base_url = config["base_url"]
        self.model = config["model"]
        
    async def generate_response(
        self, 
        message: str, 
        context: Dict[str, Any] = None,
        **kwargs
    ) -> str:
        """Generate response using Anthropic API"""
        try:
            headers = {
                "x-api-key": self.api_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
            
            # Build system prompt
            system_prompt = "You are an advanced AI assistant with decision-making capabilities, research skills, and automation expertise. You can help with coding, research, file management, and browser automation."
            
            if context and context.get("system_prompt"):
                system_prompt = context["system_prompt"]
            
            # Build messages array
            messages = []
            
            # Add conversation history if provided
            if context and context.get("conversation_history"):
                for msg in context["conversation_history"][-5:]:  # Last 5 messages
                    if msg["type"] == "user":
                        messages.append({"role": "user", "content": msg["message"]})
                    elif msg["type"] == "assistant":
                        messages.append({"role": "assistant", "content": msg["message"]})
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            payload = {
                "model": self.model,
                "max_tokens": kwargs.get("max_tokens", self.config["max_tokens"]),
                "temperature": kwargs.get("temperature", self.config["temperature"]),
                "system": system_prompt,
                "messages": messages
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/messages",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data["content"][0]["text"]
                    else:
                        error_text = await response.text()
                        raise Exception(f"Anthropic API error: {response.status} - {error_text}")
                        
        except Exception as e:
            logger.error(f"Anthropic provider error: {e}")
            raise

class OllamaProvider:
    """Ollama local AI provider"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.base_url = config["base_url"]
        self.model = config["model"]
        
    async def generate_response(
        self, 
        message: str, 
        context: Dict[str, Any] = None,
        **kwargs
    ) -> str:
        """Generate response using Ollama API"""
        try:
            # Build prompt with context
            prompt = message
            
            if context and context.get("system_prompt"):
                prompt = f"{context['system_prompt']}\n\nUser: {message}\nAssistant:"
            elif context and context.get("conversation_history"):
                # Add recent conversation history
                history = ""
                for msg in context["conversation_history"][-3:]:  # Last 3 messages
                    if msg["type"] == "user":
                        history += f"User: {msg['message']}\n"
                    elif msg["type"] == "assistant":
                        history += f"Assistant: {msg['message']}\n"
                
                prompt = f"{history}User: {message}\nAssistant:"
            
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": kwargs.get("temperature", self.config["temperature"])
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data["response"]
                    else:
                        error_text = await response.text()
                        raise Exception(f"Ollama API error: {response.status} - {error_text}")
                        
        except aiohttp.ClientConnectorError:
            raise Exception("Ollama is not running. Please start Ollama on port 11434.")
        except Exception as e:
            logger.error(f"Ollama provider error: {e}")
            raise

