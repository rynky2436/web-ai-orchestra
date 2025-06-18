"""
Permission Manager - Handles granular user permissions and access control
"""

import logging
from typing import Dict, List, Optional, Any, Set
from dataclasses import dataclass
from enum import Enum


class PermissionLevel(Enum):
    NONE = "none"
    READ = "read"
    WRITE = "write"
    EXECUTE = "execute"
    ADMIN = "admin"


class DeploymentMode(Enum):
    LOCAL = "local"
    CLOUD = "cloud"
    HYBRID = "hybrid"


@dataclass
class UserPermissions:
    """User permission configuration"""
    user_id: str
    deployment_mode: DeploymentMode
    
    # AI Provider permissions
    can_use_openai: bool = False
    can_use_claude: bool = False
    can_use_ollama: bool = False
    
    # Module permissions
    can_use_coding_agent: bool = False
    can_use_browser_automation: bool = False
    can_use_file_manager: bool = False
    can_use_voice_interface: bool = False
    can_use_desktop_control: bool = False
    
    # System permissions
    can_access_files: bool = False
    can_execute_code: bool = False
    can_install_software: bool = False
    can_manage_modules: bool = False
    can_modify_settings: bool = False
    
    # File system permissions
    file_read_paths: Set[str] = None
    file_write_paths: Set[str] = None
    file_execute_paths: Set[str] = None
    
    # Network permissions
    can_access_internet: bool = False
    allowed_domains: Set[str] = None
    can_start_servers: bool = False
    
    # Browser permissions
    can_control_browser: bool = False
    allowed_websites: Set[str] = None
    can_download_files: bool = False
    
    # Hardware permissions
    can_use_microphone: bool = False
    can_use_camera: bool = False
    can_use_speakers: bool = False
    
    # Advanced permissions
    can_run_scripts: bool = False
    can_modify_registry: bool = False  # Windows
    can_use_sudo: bool = False  # Linux/Mac
    
    def __post_init__(self):
        if self.file_read_paths is None:
            self.file_read_paths = set()
        if self.file_write_paths is None:
            self.file_write_paths = set()
        if self.file_execute_paths is None:
            self.file_execute_paths = set()
        if self.allowed_domains is None:
            self.allowed_domains = set()
        if self.allowed_websites is None:
            self.allowed_websites = set()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "user_id": self.user_id,
            "deployment_mode": self.deployment_mode.value,
            "ai_providers": {
                "openai": self.can_use_openai,
                "claude": self.can_use_claude,
                "ollama": self.can_use_ollama
            },
            "modules": {
                "coding_agent": self.can_use_coding_agent,
                "browser_automation": self.can_use_browser_automation,
                "file_manager": self.can_use_file_manager,
                "voice_interface": self.can_use_voice_interface,
                "desktop_control": self.can_use_desktop_control
            },
            "system": {
                "file_access": self.can_access_files,
                "code_execution": self.can_execute_code,
                "software_installation": self.can_install_software,
                "module_management": self.can_manage_modules,
                "settings_modification": self.can_modify_settings
            },
            "file_system": {
                "read_paths": list(self.file_read_paths),
                "write_paths": list(self.file_write_paths),
                "execute_paths": list(self.file_execute_paths)
            },
            "network": {
                "internet_access": self.can_access_internet,
                "allowed_domains": list(self.allowed_domains),
                "server_creation": self.can_start_servers
            },
            "browser": {
                "browser_control": self.can_control_browser,
                "allowed_websites": list(self.allowed_websites),
                "file_downloads": self.can_download_files
            },
            "hardware": {
                "microphone": self.can_use_microphone,
                "camera": self.can_use_camera,
                "speakers": self.can_use_speakers
            },
            "advanced": {
                "script_execution": self.can_run_scripts,
                "registry_modification": self.can_modify_registry,
                "sudo_access": self.can_use_sudo
            }
        }


class PermissionManager:
    """Manages user permissions and access control"""
    
    def __init__(self):
        self.user_permissions: Dict[str, UserPermissions] = {}
        self.permission_templates: Dict[str, Dict[str, Any]] = {}
        self.logger = logging.getLogger("PermissionManager")
        
        # Initialize permission templates
        self._initialize_permission_templates()
    
    def _initialize_permission_templates(self):
        """Initialize permission templates for different user types"""
        
        # Personal tier template (local deployment)
        self.permission_templates["personal_local"] = {
            "deployment_mode": DeploymentMode.LOCAL,
            "ai_providers": {
                "can_use_openai": True,
                "can_use_claude": True,
                "can_use_ollama": True
            },
            "modules": {
                "can_use_coding_agent": True,
                "can_use_browser_automation": True,
                "can_use_file_manager": True,
                "can_use_voice_interface": True,
                "can_use_desktop_control": True
            },
            "system": {
                "can_access_files": True,
                "can_execute_code": True,
                "can_install_software": False,
                "can_manage_modules": True,
                "can_modify_settings": True
            },
            "file_system": {
                "file_read_paths": {"/home", "/Users", "C:\\Users"},
                "file_write_paths": {"/home", "/Users", "C:\\Users"},
                "file_execute_paths": set()
            },
            "network": {
                "can_access_internet": True,
                "allowed_domains": set(),  # All domains
                "can_start_servers": True
            },
            "browser": {
                "can_control_browser": True,
                "allowed_websites": set(),  # All websites
                "can_download_files": True
            },
            "hardware": {
                "can_use_microphone": True,
                "can_use_camera": True,
                "can_use_speakers": True
            },
            "advanced": {
                "can_run_scripts": True,
                "can_modify_registry": False,
                "can_use_sudo": False
            }
        }
        
        # Personal tier template (cloud deployment)
        self.permission_templates["personal_cloud"] = {
            "deployment_mode": DeploymentMode.CLOUD,
            "ai_providers": {
                "can_use_openai": True,
                "can_use_claude": True,
                "can_use_ollama": False  # Not available in cloud
            },
            "modules": {
                "can_use_coding_agent": True,
                "can_use_browser_automation": False,  # Sandboxed
                "can_use_file_manager": False,  # No file access
                "can_use_voice_interface": True,
                "can_use_desktop_control": False  # No desktop access
            },
            "system": {
                "can_access_files": False,
                "can_execute_code": False,  # Sandboxed
                "can_install_software": False,
                "can_manage_modules": False,
                "can_modify_settings": False
            },
            "file_system": {
                "file_read_paths": set(),
                "file_write_paths": set(),
                "file_execute_paths": set()
            },
            "network": {
                "can_access_internet": False,  # Controlled access
                "allowed_domains": {"api.openai.com", "api.anthropic.com"},
                "can_start_servers": False
            },
            "browser": {
                "can_control_browser": False,
                "allowed_websites": set(),
                "can_download_files": False
            },
            "hardware": {
                "can_use_microphone": False,
                "can_use_camera": False,
                "can_use_speakers": False
            },
            "advanced": {
                "can_run_scripts": False,
                "can_modify_registry": False,
                "can_use_sudo": False
            }
        }
        
        # Business tier template
        self.permission_templates["business_local"] = {
            **self.permission_templates["personal_local"],
            "system": {
                "can_access_files": True,
                "can_execute_code": True,
                "can_install_software": True,  # Enhanced for business
                "can_manage_modules": True,
                "can_modify_settings": True
            },
            "advanced": {
                "can_run_scripts": True,
                "can_modify_registry": True,  # Business needs
                "can_use_sudo": True
            }
        }
        
        # Enterprise tier template
        self.permission_templates["enterprise_local"] = {
            **self.permission_templates["business_local"],
            "system": {
                "can_access_files": True,
                "can_execute_code": True,
                "can_install_software": True,
                "can_manage_modules": True,
                "can_modify_settings": True
            },
            "advanced": {
                "can_run_scripts": True,
                "can_modify_registry": True,
                "can_use_sudo": True
            }
        }
        
        self.logger.info(f"Initialized {len(self.permission_templates)} permission templates")
    
    async def get_user_permissions(self, user_id: str) -> UserPermissions:
        """Get permissions for a user"""
        if user_id not in self.user_permissions:
            # Create default permissions for new user
            await self.create_user_permissions(user_id, "personal_cloud")
        
        return self.user_permissions[user_id]
    
    async def create_user_permissions(self, user_id: str, template_name: str) -> UserPermissions:
        """Create user permissions from template"""
        if template_name not in self.permission_templates:
            template_name = "personal_cloud"  # Default to most restrictive
        
        template = self.permission_templates[template_name]
        
        permissions = UserPermissions(
            user_id=user_id,
            deployment_mode=template["deployment_mode"],
            
            # AI Providers
            can_use_openai=template["ai_providers"]["can_use_openai"],
            can_use_claude=template["ai_providers"]["can_use_claude"],
            can_use_ollama=template["ai_providers"]["can_use_ollama"],
            
            # Modules
            can_use_coding_agent=template["modules"]["can_use_coding_agent"],
            can_use_browser_automation=template["modules"]["can_use_browser_automation"],
            can_use_file_manager=template["modules"]["can_use_file_manager"],
            can_use_voice_interface=template["modules"]["can_use_voice_interface"],
            can_use_desktop_control=template["modules"]["can_use_desktop_control"],
            
            # System
            can_access_files=template["system"]["can_access_files"],
            can_execute_code=template["system"]["can_execute_code"],
            can_install_software=template["system"]["can_install_software"],
            can_manage_modules=template["system"]["can_manage_modules"],
            can_modify_settings=template["system"]["can_modify_settings"],
            
            # File system
            file_read_paths=set(template["file_system"]["file_read_paths"]),
            file_write_paths=set(template["file_system"]["file_write_paths"]),
            file_execute_paths=set(template["file_system"]["file_execute_paths"]),
            
            # Network
            can_access_internet=template["network"]["can_access_internet"],
            allowed_domains=set(template["network"]["allowed_domains"]),
            can_start_servers=template["network"]["can_start_servers"],
            
            # Browser
            can_control_browser=template["browser"]["can_control_browser"],
            allowed_websites=set(template["browser"]["allowed_websites"]),
            can_download_files=template["browser"]["can_download_files"],
            
            # Hardware
            can_use_microphone=template["hardware"]["can_use_microphone"],
            can_use_camera=template["hardware"]["can_use_camera"],
            can_use_speakers=template["hardware"]["can_use_speakers"],
            
            # Advanced
            can_run_scripts=template["advanced"]["can_run_scripts"],
            can_modify_registry=template["advanced"]["can_modify_registry"],
            can_use_sudo=template["advanced"]["can_use_sudo"]
        )
        
        self.user_permissions[user_id] = permissions
        self.logger.info(f"Created permissions for user {user_id} using template {template_name}")
        
        return permissions
    
    async def update_user_permissions(self, user_id: str, updates: Dict[str, Any]) -> bool:
        """Update user permissions"""
        try:
            if user_id not in self.user_permissions:
                await self.create_user_permissions(user_id, "personal_cloud")
            
            permissions = self.user_permissions[user_id]
            
            # Update permissions based on provided updates
            for category, settings in updates.items():
                if category == "ai_providers":
                    for provider, value in settings.items():
                        if provider == "openai":
                            permissions.can_use_openai = value
                        elif provider == "claude":
                            permissions.can_use_claude = value
                        elif provider == "ollama":
                            permissions.can_use_ollama = value
                
                elif category == "modules":
                    for module, value in settings.items():
                        if module == "coding_agent":
                            permissions.can_use_coding_agent = value
                        elif module == "browser_automation":
                            permissions.can_use_browser_automation = value
                        elif module == "file_manager":
                            permissions.can_use_file_manager = value
                        elif module == "voice_interface":
                            permissions.can_use_voice_interface = value
                        elif module == "desktop_control":
                            permissions.can_use_desktop_control = value
                
                elif category == "file_system":
                    if "read_paths" in settings:
                        permissions.file_read_paths = set(settings["read_paths"])
                    if "write_paths" in settings:
                        permissions.file_write_paths = set(settings["write_paths"])
                    if "execute_paths" in settings:
                        permissions.file_execute_paths = set(settings["execute_paths"])
                
                # Add more categories as needed
            
            self.logger.info(f"Updated permissions for user {user_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error updating permissions for user {user_id}: {str(e)}")
            return False
    
    async def can_execute_action(self, action: Dict[str, Any], permissions: UserPermissions) -> bool:
        """Check if user can execute a specific action"""
        module_name = action.get("module", "")
        action_type = action.get("action", "")
        parameters = action.get("parameters", {})
        
        # Check module permissions
        if module_name == "coding_agent" and not permissions.can_use_coding_agent:
            return False
        elif module_name == "browser_automation" and not permissions.can_use_browser_automation:
            return False
        elif module_name == "file_manager" and not permissions.can_use_file_manager:
            return False
        elif module_name == "voice_interface" and not permissions.can_use_voice_interface:
            return False
        elif module_name == "desktop_control" and not permissions.can_use_desktop_control:
            return False
        
        # Check specific action permissions
        if action_type == "run_code" and not permissions.can_execute_code:
            return False
        elif action_type == "navigate" and not permissions.can_control_browser:
            return False
        elif action_type in ["list_files", "find_duplicates"] and not permissions.can_access_files:
            return False
        
        # Check file path permissions
        if "file_path" in parameters:
            file_path = parameters["file_path"]
            if action_type in ["read_file", "list_files"]:
                if not self._check_path_permission(file_path, permissions.file_read_paths):
                    return False
            elif action_type in ["write_file", "create_file", "organize_files"]:
                if not self._check_path_permission(file_path, permissions.file_write_paths):
                    return False
        
        # Check URL permissions
        if "url" in parameters:
            url = parameters["url"]
            if not self._check_url_permission(url, permissions):
                return False
        
        return True
    
    def _check_path_permission(self, file_path: str, allowed_paths: Set[str]) -> bool:
        """Check if file path is allowed"""
        if not allowed_paths:  # Empty set means no access
            return False
        
        # Check if any allowed path is a parent of the file path
        for allowed_path in allowed_paths:
            if file_path.startswith(allowed_path):
                return True
        
        return False
    
    def _check_url_permission(self, url: str, permissions: UserPermissions) -> bool:
        """Check if URL access is allowed"""
        if not permissions.can_access_internet:
            return False
        
        # If no specific domains are allowed, allow all
        if not permissions.allowed_domains:
            return True
        
        # Check if domain is in allowed list
        from urllib.parse import urlparse
        domain = urlparse(url).netloc
        
        return domain in permissions.allowed_domains
    
    async def get_permission_templates(self) -> List[Dict[str, Any]]:
        """Get available permission templates"""
        templates = []
        
        for name, template in self.permission_templates.items():
            templates.append({
                "name": name,
                "deployment_mode": template["deployment_mode"].value,
                "description": self._get_template_description(name)
            })
        
        return templates
    
    def _get_template_description(self, template_name: str) -> str:
        """Get description for permission template"""
        descriptions = {
            "personal_local": "Personal tier with full local access",
            "personal_cloud": "Personal tier with sandboxed cloud access",
            "business_local": "Business tier with enhanced local capabilities",
            "enterprise_local": "Enterprise tier with full administrative access"
        }
        
        return descriptions.get(template_name, "Custom permission template")
    
    async def export_user_permissions(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Export user permissions to dictionary"""
        if user_id not in self.user_permissions:
            return None
        
        return self.user_permissions[user_id].to_dict()
    
    async def import_user_permissions(self, user_id: str, permissions_data: Dict[str, Any]) -> bool:
        """Import user permissions from dictionary"""
        try:
            # Create UserPermissions object from data
            permissions = UserPermissions(
                user_id=user_id,
                deployment_mode=DeploymentMode(permissions_data.get("deployment_mode", "cloud")),
                
                # AI Providers
                can_use_openai=permissions_data.get("ai_providers", {}).get("openai", False),
                can_use_claude=permissions_data.get("ai_providers", {}).get("claude", False),
                can_use_ollama=permissions_data.get("ai_providers", {}).get("ollama", False),
                
                # Modules
                can_use_coding_agent=permissions_data.get("modules", {}).get("coding_agent", False),
                can_use_browser_automation=permissions_data.get("modules", {}).get("browser_automation", False),
                can_use_file_manager=permissions_data.get("modules", {}).get("file_manager", False),
                can_use_voice_interface=permissions_data.get("modules", {}).get("voice_interface", False),
                can_use_desktop_control=permissions_data.get("modules", {}).get("desktop_control", False),
                
                # System
                can_access_files=permissions_data.get("system", {}).get("file_access", False),
                can_execute_code=permissions_data.get("system", {}).get("code_execution", False),
                can_install_software=permissions_data.get("system", {}).get("software_installation", False),
                can_manage_modules=permissions_data.get("system", {}).get("module_management", False),
                can_modify_settings=permissions_data.get("system", {}).get("settings_modification", False),
                
                # File system
                file_read_paths=set(permissions_data.get("file_system", {}).get("read_paths", [])),
                file_write_paths=set(permissions_data.get("file_system", {}).get("write_paths", [])),
                file_execute_paths=set(permissions_data.get("file_system", {}).get("execute_paths", [])),
                
                # Network
                can_access_internet=permissions_data.get("network", {}).get("internet_access", False),
                allowed_domains=set(permissions_data.get("network", {}).get("allowed_domains", [])),
                can_start_servers=permissions_data.get("network", {}).get("server_creation", False),
                
                # Browser
                can_control_browser=permissions_data.get("browser", {}).get("browser_control", False),
                allowed_websites=set(permissions_data.get("browser", {}).get("allowed_websites", [])),
                can_download_files=permissions_data.get("browser", {}).get("file_downloads", False),
                
                # Hardware
                can_use_microphone=permissions_data.get("hardware", {}).get("microphone", False),
                can_use_camera=permissions_data.get("hardware", {}).get("camera", False),
                can_use_speakers=permissions_data.get("hardware", {}).get("speakers", False),
                
                # Advanced
                can_run_scripts=permissions_data.get("advanced", {}).get("script_execution", False),
                can_modify_registry=permissions_data.get("advanced", {}).get("registry_modification", False),
                can_use_sudo=permissions_data.get("advanced", {}).get("sudo_access", False)
            )
            
            self.user_permissions[user_id] = permissions
            self.logger.info(f"Imported permissions for user {user_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error importing permissions for user {user_id}: {str(e)}")
            return False

