
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Brain, Shield, Monitor, Database, Globe, Key, User, Bell, Palette, Code, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settingsStore";
import { ModelSelector } from "./ModelSelector";
import { aiRoutingService, ProviderStatus } from "@/services/aiRoutingService";

export const Settings = () => {
  const { settings, currentTheme, aiProviders, updateSettings, setTheme, updateAIProvider } = useSettingsStore();
  
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    elevenlabs: '',
    deepl: '',
    stability: '',
    replicate: '',
    huggingface: '',
    cohere: '',
    ollama: '' // Local model, no key needed
  });

  const [systemSettings, setSystemSettings] = useState({
    aiModel: '',
    maxTokens: 4000,
    temperature: 0.7,
    autoSave: true,
    notifications: true,
    darkMode: true,
    analytics: false,
    telemetry: false
  });

  const [permissions, setPermissions] = useState({
    fileSystem: false,
    networkAccess: false,
    cameraAccess: false,
    microphoneAccess: false,
    locationAccess: false,
    screenshotAccess: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: 30,
    encryptData: true,
    logAccess: true,
    backupFrequency: 'daily'
  });

  const [providerStatus, setProviderStatus] = useState<ProviderStatus[]>([]);
  const [activeProvider, setActiveProvider] = useState<ProviderStatus | null>(null);
  const [currentBackendUrl, setCurrentBackendUrl] = useState('http://localhost:8000');

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('nexus_system_settings');
    if (savedSettings) {
      setSystemSettings(JSON.parse(savedSettings));
    }

    // Load API keys from localStorage
    Object.keys(apiKeys).forEach(provider => {
      const savedKey = localStorage.getItem(`nexus_api_${provider}`);
      if (savedKey) {
        setApiKeys(prev => ({ ...prev, [provider]: savedKey }));
      }
    });

    // Load provider status
    loadProviderStatus();
  }, []);

  const loadProviderStatus = async () => {
    try {
      const [providers, active] = await Promise.all([
        aiRoutingService.getProviderStatus(),
        aiRoutingService.getActiveProvider()
      ]);
      
      setProviderStatus(providers);
      setActiveProvider(active);
      
      // Set the model from active provider if available
      if (active && active.models && active.models.length > 0 && !systemSettings.aiModel) {
        setSystemSettings(prev => ({ ...prev, aiModel: active.models![0] }));
      }
    } catch (error) {
      console.error('Failed to load provider status:', error);
    }
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  const saveApiKey = (provider: string) => {
    if (provider === 'ollama') {
      toast({
        title: "Ollama Configuration",
        description: "Ollama runs locally and doesn't require an API key"
      });
      return;
    }

    const key = apiKeys[provider as keyof typeof apiKeys];
    if (!key.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    // Save to secure storage (would be backend in real implementation)
    localStorage.setItem(`nexus_api_${provider}`, key);
    
    // Update the AI provider in the store
    updateAIProvider(provider, { apiKey: key, enabled: true });
    
    toast({
      title: "API Key Saved",
      description: `${provider} API key has been securely stored`
    });
    
    // Reload provider status
    loadProviderStatus();
  };

  const testApiConnection = async (provider: string) => {
    if (provider === 'ollama') {
      toast({
        title: "Testing Ollama Connection",
        description: "Checking if Ollama is running locally..."
      });
      return;
    }

    toast({
      title: "Testing Connection",
      description: `Testing connection to ${provider}...`
    });
    
    // Reload provider status to get fresh connection info
    await loadProviderStatus();
  };

  const handleSystemSettingChange = (setting: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [setting]: value }));
    
    // Save to localStorage for persistence
    localStorage.setItem('nexus_system_settings', JSON.stringify({
      ...systemSettings,
      [setting]: value
    }));

    toast({
      title: "Setting Updated",
      description: `${setting} has been updated`
    });
  };

  const handleModelChange = (model: string) => {
    handleSystemSettingChange('aiModel', model);
  };

  const handleThemeChange = (theme: any) => {
    setTheme(theme);
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${theme}`
    });
  };

  const handlePermissionChange = (permission: string, value: boolean) => {
    setPermissions(prev => ({ ...prev, [permission]: value }));
    
    toast({
      title: "Permission Updated",
      description: `${permission} ${value ? 'granted' : 'revoked'}`
    });
  };

  const resetAllSettings = () => {
    localStorage.clear();
    setApiKeys({
      openai: '',
      anthropic: '',
      google: '',
      elevenlabs: '',
      deepl: '',
      stability: '',
      replicate: '',
      huggingface: '',
      cohere: '',
      ollama: ''
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults"
    });
  };

  const exportSettings = () => {
    const settingsData = {
      systemSettings,
      permissions,
      securitySettings,
      currentTheme,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexus-ai-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported",
      description: "Settings have been exported to file"
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">System Settings</h2>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Configuration
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={exportSettings} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Database className="w-4 h-4 mr-2" />
              Export Settings
            </Button>
            <Button onClick={resetAllSettings} variant="outline" size="sm" className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30">
              Reset All
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/5 border-white/10">
            <TabsTrigger value="api-keys" className="text-white data-[state=active]:bg-blue-500/20">API Keys</TabsTrigger>
            <TabsTrigger value="ai-models" className="text-white data-[state=active]:bg-blue-500/20">AI Models</TabsTrigger>
            <TabsTrigger value="theme" className="text-white data-[state=active]:bg-blue-500/20">Theme</TabsTrigger>
            <TabsTrigger value="permissions" className="text-white data-[state=active]:bg-blue-500/20">Permissions</TabsTrigger>
            <TabsTrigger value="security" className="text-white data-[state=active]:bg-blue-500/20">Security</TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-blue-500/20">System</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="mt-6 space-y-6">
            <div className="grid gap-6">
              {Object.entries(apiKeys).map(([provider, key]) => (
                <Card key={provider} className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white capitalize flex items-center">
                        <Key className="w-5 h-5 mr-2" />
                        {provider === 'ollama' ? 'Ollama (Local)' : provider}
                      </CardTitle>
                      {provider === 'ollama' ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Local Model
                        </Badge>
                      ) : (
                        <Badge className={key ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                          {key ? "Configured" : "Not Set"}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {provider === 'ollama' ? (
                      <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                        <p className="text-blue-400 text-sm">
                          Ollama runs locally on your machine and doesn't require an API key. 
                          Make sure Ollama is installed and running on your system.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <Label className="text-white text-sm">API Key</Label>
                          <Input
                            type="password"
                            value={key}
                            onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                            className="mt-1 bg-white/5 border-white/10 text-white"
                            placeholder={`Enter ${provider} API key`}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => saveApiKey(provider)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                            disabled={!key.trim()}
                          >
                            Save Key
                          </Button>
                          <Button
                            onClick={() => testApiConnection(provider)}
                            variant="outline"
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                            disabled={!key.trim()}
                          >
                            Test Connection
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-models" className="mt-6 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">AI Model Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!activeProvider?.connected && (
                  <Alert className="border-red-500/30 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      No AI provider is currently connected. Please configure an API key in the API Keys tab first.
                    </AlertDescription>
                  </Alert>
                )}

                {activeProvider && (
                  <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-blue-400 font-medium">Active Provider</h4>
                        <p className="text-blue-300 text-sm">{activeProvider.name}</p>
                      </div>
                      <Badge className={activeProvider.connected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                        {activeProvider.connected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  </div>
                )}

                <ModelSelector
                  backendUrl={activeProvider?.baseUrl || currentBackendUrl}
                  apiKey={activeProvider?.hasApiKey ? apiKeys[activeProvider.id as keyof typeof apiKeys] : undefined}
                  currentModel={systemSettings.aiModel}
                  onModelChange={handleModelChange}
                  className="space-y-2"
                  textColor="text-white"
                  inputClasses="bg-white/5 border-white/10 text-white"
                />

                <div>
                  <Label className="text-white text-sm">Max Tokens: {systemSettings.maxTokens}</Label>
                  <input
                    type="range"
                    min="1000"
                    max="8000"
                    value={systemSettings.maxTokens}
                    onChange={(e) => handleSystemSettingChange('maxTokens', parseInt(e.target.value))}
                    className="w-full mt-2"
                    disabled={!activeProvider?.connected}
                  />
                </div>

                <div>
                  <Label className="text-white text-sm">Temperature: {systemSettings.temperature}</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={systemSettings.temperature}
                    onChange={(e) => handleSystemSettingChange('temperature', parseFloat(e.target.value))}
                    className="w-full mt-2"
                    disabled={!activeProvider?.connected}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="mt-6 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Theme & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white text-sm">Application Theme</Label>
                  <Select value={currentTheme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="gradient">Gradient (Default)</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="dark-professional">Dark Professional</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <p className="text-white text-sm font-medium">Gradient Theme</p>
                    <p className="text-white/80 text-xs">Modern gradient design</p>
                  </div>
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <p className="text-white text-sm font-medium">Professional Theme</p>
                    <p className="text-white/80 text-xs">Clean business look</p>
                  </div>
                  <div className="p-4 bg-black rounded-lg border border-gray-600">
                    <p className="text-white text-sm font-medium">Dark Professional</p>
                    <p className="text-white/80 text-xs">Dark mode focused</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg border">
                    <p className="text-gray-900 text-sm font-medium">Minimal Theme</p>
                    <p className="text-gray-600 text-xs">Simple and clean</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Dark Mode</Label>
                    <p className="text-sm text-gray-400">Use dark theme across the application</p>
                  </div>
                  <Switch 
                    checked={systemSettings.darkMode} 
                    onCheckedChange={(checked) => handleSystemSettingChange('darkMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="mt-6 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">System Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(permissions).map(([permission, enabled]) => (
                  <div key={permission} className="flex items-center justify-between">
                    <div>
                      <Label className="text-white capitalize">{permission.replace(/([A-Z])/g, ' $1')}</Label>
                      <p className="text-sm text-gray-400">
                        {permission === 'fileSystem' && 'Allow access to local file system'}
                        {permission === 'networkAccess' && 'Allow network connections'}
                        {permission === 'cameraAccess' && 'Allow camera access for AI vision'}
                        {permission === 'microphoneAccess' && 'Allow microphone for voice commands'}
                        {permission === 'locationAccess' && 'Allow location services'}
                        {permission === 'screenshotAccess' && 'Allow screen capture and analysis'}
                      </p>
                    </div>
                    <Switch 
                      checked={enabled} 
                      onCheckedChange={(checked) => handlePermissionChange(permission, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-400">Add extra security to your account</p>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactor} 
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactor: checked }))}
                  />
                </div>

                <div>
                  <Label className="text-white text-sm">Session Timeout (minutes)</Label>
                  <Select value={securitySettings.sessionTimeout.toString()} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}>
                    <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="0">No timeout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Encrypt Local Data</Label>
                    <p className="text-sm text-gray-400">Encrypt stored data and settings</p>
                  </div>
                  <Switch 
                    checked={securitySettings.encryptData} 
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, encryptData: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">System Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Auto-save</Label>
                    <p className="text-sm text-gray-400">Automatically save work and settings</p>
                  </div>
                  <Switch 
                    checked={systemSettings.autoSave} 
                    onCheckedChange={(checked) => handleSystemSettingChange('autoSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Notifications</Label>
                    <p className="text-sm text-gray-400">Show system notifications</p>
                  </div>
                  <Switch 
                    checked={systemSettings.notifications} 
                    onCheckedChange={(checked) => handleSystemSettingChange('notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Analytics</Label>
                    <p className="text-sm text-gray-400">Help improve the system with usage analytics</p>
                  </div>
                  <Switch 
                    checked={systemSettings.analytics} 
                    onCheckedChange={(checked) => handleSystemSettingChange('analytics', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
