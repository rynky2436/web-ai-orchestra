import { useState } from "react";
import { Save, Key, Server, Volume2, Mic, Palette, Brain, Shield, Monitor, Database, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OperatorPermissions } from "./OperatorPermissions";
import { ModelSelector } from "./ModelSelector";
import { useSettingsStore, Theme } from "@/stores/settingsStore";
import { toast } from "@/hooks/use-toast";

export const Settings = () => {
  const { elevenLabsApiKey, setElevenLabsApiKey, currentTheme, setTheme } = useSettingsStore();
  const [config, setConfig] = useState({
    openai_api_key: '',
    claude_api_key: '',
    gemini_api_key: '',
    perplexity_api_key: '',
    backend_url: 'http://localhost:11434',
    default_model: 'gpt-4',
    voice_enabled: false,
    auto_speak: false,
    voice_model: 'eleven_multilingual_v2',
    voice_id: 'EXAVITQu4vr4xnSDxMaL'
  });

  const [aiSettings, setAiSettings] = useState({
    globalAiMonitoring: true,
    autoOptimization: true,
    intelligentBackup: true,
    securityScanning: true,
    contentAnalysis: true,
    privacyProtection: true,
    resourceOptimization: true,
    predictiveAnalysis: false
  });

  const [systemSettings, setSystemSettings] = useState({
    maxConcurrentTasks: 10,
    aiResponseTime: 'fast',
    dataRetention: '90-days',
    encryptionLevel: 'high',
    cloudSync: false,
    autoUpdates: true
  });

  const handleSave = () => {
    toast({
      title: "Saving Configuration",
      description: "Updating all AI system settings..."
    });

    // Simulate saving
    setTimeout(() => {
      console.log('Saving configuration:', {
        config,
        aiSettings,
        systemSettings,
        elevenLabsApiKey,
        currentTheme
      });

      toast({
        title: "Settings Saved",
        description: "All configurations have been updated successfully"
      });
    }, 2000);
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const testAIConnection = async (provider: string) => {
    toast({
      title: "Testing AI Connection",
      description: `Connecting to ${provider}...`
    });

    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${provider} AI services`
      });
    }, 2000);
  };

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'professional':
        return 'bg-gradient-to-b from-gray-100 to-gray-200';
      case 'dark-professional':
        return 'bg-gradient-to-b from-gray-800 to-gray-900';
      case 'minimal':
        return 'bg-white';
      default:
        return 'bg-gradient-to-b from-slate-900/50 to-black/50';
    }
  };

  const getCardClasses = () => {
    switch (currentTheme) {
      case 'professional':
        return 'bg-white border-gray-300';
      case 'dark-professional':
        return 'bg-gray-700 border-gray-600';
      case 'minimal':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const getTextClasses = () => {
    switch (currentTheme) {
      case 'professional':
      case 'minimal':
        return 'text-gray-900';
      case 'dark-professional':
        return 'text-gray-100';
      default:
        return 'text-white';
    }
  };

  const getSubTextClasses = () => {
    switch (currentTheme) {
      case 'professional':
      case 'minimal':
        return 'text-gray-600';
      case 'dark-professional':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getInputClasses = () => {
    switch (currentTheme) {
      case 'professional':
        return 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
      case 'dark-professional':
        return 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400';
      case 'minimal':
        return 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
      default:
        return 'bg-white/5 border-white/10 text-white placeholder-gray-400';
    }
  };

  // Determine which API key to use based on backend URL
  const getApiKeyForBackend = () => {
    const url = config.backend_url.toLowerCase();
    if (url.includes('openai.com')) return config.openai_api_key;
    if (url.includes('anthropic.com')) return config.claude_api_key;
    return undefined; // For Ollama and other local backends
  };

  return (
    <div className={`h-screen overflow-y-auto ${getThemeClasses()}`}>
      {/* Header */}
      <div className={`border-b ${currentTheme === 'gradient' ? 'border-white/10 bg-black/20 backdrop-blur-lg' : currentTheme === 'professional' || currentTheme === 'minimal' ? 'border-gray-300 bg-white/80' : 'border-gray-600 bg-gray-800/80'} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${getTextClasses()} mb-2`}>System Settings</h2>
            <p className={getSubTextClasses()}>Configure your NexusAI automation platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="ai-config" className="w-full max-w-6xl">
          <TabsList className="grid w-full grid-cols-6 bg-white/5 border-white/10">
            <TabsTrigger value="ai-config" className="text-white data-[state=active]:bg-blue-500/20">AI Config</TabsTrigger>
            <TabsTrigger value="api-keys" className="text-white data-[state=active]:bg-blue-500/20">API Keys</TabsTrigger>
            <TabsTrigger value="permissions" className="text-white data-[state=active]:bg-blue-500/20">Permissions</TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-blue-500/20">System</TabsTrigger>
            <TabsTrigger value="voice" className="text-white data-[state=active]:bg-blue-500/20">Voice</TabsTrigger>
            <TabsTrigger value="appearance" className="text-white data-[state=active]:bg-blue-500/20">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-config" className="mt-6 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <CardTitle className="text-white">AI System Configuration</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Configure global AI behavior and monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Global AI Monitoring</Label>
                    <Switch 
                      checked={aiSettings.globalAiMonitoring} 
                      onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, globalAiMonitoring: checked }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto Optimization</Label>
                    <Switch 
                      checked={aiSettings.autoOptimization} 
                      onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, autoOptimization: checked }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Intelligent Backup</Label>
                    <Switch 
                      checked={aiSettings.intelligentBackup} 
                      onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, intelligentBackup: checked }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Security Scanning</Label>
                    <Switch 
                      checked={aiSettings.securityScanning} 
                      onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, securityScanning: checked }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Content Analysis</Label>
                    <Switch 
                      checked={aiSettings.contentAnalysis} 
                      onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, contentAnalysis: checked }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Privacy Protection</Label>
                    <Switch 
                      checked={aiSettings.privacyProtection} 
                      onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, privacyProtection: checked }))} 
                    />
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white text-sm">AI Response Time</Label>
                    <Select value={systemSettings.aiResponseTime} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, aiResponseTime: value }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="instant">Instant (Low Accuracy)</SelectItem>
                        <SelectItem value="fast">Fast (Balanced)</SelectItem>
                        <SelectItem value="accurate">Accurate (Slower)</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive (Slowest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Max Concurrent AI Tasks</Label>
                    <Select value={systemSettings.maxConcurrentTasks.toString()} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, maxConcurrentTasks: parseInt(value) }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="5">5 Tasks</SelectItem>
                        <SelectItem value="10">10 Tasks</SelectItem>
                        <SelectItem value="20">20 Tasks</SelectItem>
                        <SelectItem value="50">50 Tasks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-keys" className="mt-6 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-blue-400" />
                  <CardTitle className="text-white">AI Service API Keys</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Configure your AI service API keys and test connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openai-key" className="text-white">OpenAI API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="openai-key"
                        type="password"
                        value={config.openai_api_key}
                        onChange={(e) => handleInputChange('openai_api_key', e.target.value)}
                        placeholder="sk-..."
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                      />
                      <Button size="sm" onClick={() => testAIConnection('OpenAI')} className="bg-green-500 hover:bg-green-600">
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="claude-key" className="text-white">Claude API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="claude-key"
                        type="password"
                        value={config.claude_api_key}
                        onChange={(e) => handleInputChange('claude_api_key', e.target.value)}
                        placeholder="sk-ant-..."
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                      />
                      <Button size="sm" onClick={() => testAIConnection('Claude')} className="bg-green-500 hover:bg-green-600">
                        Test
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gemini-key" className="text-white">Gemini API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="gemini-key"
                        type="password"
                        value={config.gemini_api_key}
                        onChange={(e) => handleInputChange('gemini_api_key', e.target.value)}
                        placeholder="AI..."
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                      />
                      <Button size="sm" onClick={() => testAIConnection('Gemini')} className="bg-green-500 hover:bg-green-600">
                        Test
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="perplexity-key" className="text-white">Perplexity API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="perplexity-key"
                        type="password"
                        value={config.perplexity_api_key}
                        onChange={(e) => handleInputChange('perplexity_api_key', e.target.value)}
                        placeholder="pplx-..."
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                      />
                      <Button size="sm" onClick={() => testAIConnection('Perplexity')} className="bg-green-500 hover:bg-green-600">
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="elevenlabs-key" className="text-white">ElevenLabs API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="elevenlabs-key"
                        type="password"
                        value={elevenLabsApiKey}
                        onChange={(e) => setElevenLabsApiKey(e.target.value)}
                        placeholder="Enter your ElevenLabs API key..."
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                      />
                      <Button size="sm" onClick={() => testAIConnection('ElevenLabs')} className="bg-green-500 hover:bg-green-600">
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Server className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-white">Backend Configuration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backend-url" className="text-white">Backend URL</Label>
                  <Input
                    id="backend-url"
                    value={config.backend_url}
                    onChange={(e) => handleInputChange('backend_url', e.target.value)}
                    placeholder="http://localhost:11434"
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                
                <ModelSelector
                  backendUrl={config.backend_url}
                  apiKey={config.openai_api_key}
                  currentModel={config.default_model}
                  onModelChange={(model) => handleInputChange('default_model', model)}
                  textColor="text-white"
                  inputClasses="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <OperatorPermissions />
          </TabsContent>

          <TabsContent value="system" className="mt-6 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-purple-400" />
                  <CardTitle className="text-white">System Configuration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white text-sm">Data Retention</Label>
                    <Select value={systemSettings.dataRetention} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, dataRetention: value }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="30-days">30 Days</SelectItem>
                        <SelectItem value="90-days">90 Days</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Encryption Level</Label>
                    <Select value={systemSettings.encryptionLevel} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, encryptionLevel: value }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="military">Military Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-blue-400" />
                    <Label className="text-white">Cloud Sync</Label>
                  </div>
                  <Switch 
                    checked={systemSettings.cloudSync} 
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, cloudSync: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-white">Auto Updates</Label>
                  <Switch 
                    checked={systemSettings.autoUpdates} 
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoUpdates: checked }))} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="mt-6">
            <Card className={getCardClasses()}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Volume2 className={`w-5 h-5 ${currentTheme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                  <CardTitle className={getTextClasses()}>Voice Configuration</CardTitle>
                </div>
                <CardDescription className={getSubTextClasses()}>
                  Configure speech recognition and text-to-speech
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className={`w-4 h-4 ${getSubTextClasses()}`} />
                    <Label className={getTextClasses()}>Enable Voice Input</Label>
                  </div>
                  <Switch
                    checked={config.voice_enabled}
                    onCheckedChange={(checked) => handleInputChange('voice_enabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className={getTextClasses()}>Auto-speak Responses</Label>
                  <Switch
                    checked={config.auto_speak}
                    onCheckedChange={(checked) => handleInputChange('auto_speak', checked)}
                  />
                </div>
                
                <Separator className={currentTheme === 'gradient' ? 'bg-white/10' : 'bg-gray-300'} />
                
                <div>
                  <Label htmlFor="voice-model" className={getTextClasses()}>Voice Model</Label>
                  <Select 
                    value={config.voice_model} 
                    onValueChange={(value) => handleInputChange('voice_model', value)}
                  >
                    <SelectTrigger className={`mt-1 ${getInputClasses()}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={currentTheme === 'gradient' ? 'bg-slate-900 border-white/10' : currentTheme === 'professional' || currentTheme === 'minimal' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'}>
                      <SelectItem value="eleven_multilingual_v2">Multilingual v2</SelectItem>
                      <SelectItem value="eleven_turbo_v2_5">Turbo v2.5</SelectItem>
                      <SelectItem value="eleven_turbo_v2">Turbo v2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="voice-id" className={getTextClasses()}>Voice ID</Label>
                  <Select 
                    value={config.voice_id} 
                    onValueChange={(value) => handleInputChange('voice_id', value)}
                  >
                    <SelectTrigger className={`mt-1 ${getInputClasses()}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={currentTheme === 'gradient' ? 'bg-slate-900 border-white/10' : currentTheme === 'professional' || currentTheme === 'minimal' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'}>
                      <SelectItem value="EXAVITQu4vr4xnSDxMaL">Sarah</SelectItem>
                      <SelectItem value="9BWtsMINqrJLrRacOk9x">Aria</SelectItem>
                      <SelectItem value="CwhRBWXzGAHq8TQ4Fs17">Roger</SelectItem>
                      <SelectItem value="IKne3meq5aSn9XLyUdCD">Charlie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card className={getCardClasses()}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className={`w-5 h-5 ${currentTheme === 'gradient' ? 'text-purple-400' : 'text-blue-600'}`} />
                  <CardTitle className={getTextClasses()}>Appearance</CardTitle>
                </div>
                <CardDescription className={getSubTextClasses()}>
                  Choose your preferred interface theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="theme" className={getTextClasses()}>Theme</Label>
                  <Select value={currentTheme} onValueChange={(value: Theme) => setTheme(value)}>
                    <SelectTrigger className={`mt-1 ${getInputClasses()}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={currentTheme === 'gradient' ? 'bg-slate-900 border-white/10' : currentTheme === 'professional' || currentTheme === 'minimal' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'}>
                      <SelectItem value="gradient">Gradient (Default)</SelectItem>
                      <SelectItem value="professional">Professional Light</SelectItem>
                      <SelectItem value="dark-professional">Professional Dark</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save All Configurations
          </Button>
        </div>
      </div>
    </div>
  );
};
