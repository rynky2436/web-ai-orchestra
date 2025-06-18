
import { useState } from "react";
import { Save, Key, Server, Volume2, Mic, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OperatorPermissions } from "./OperatorPermissions";
import { ModelSelector } from "./ModelSelector";
import { useSettingsStore, Theme } from "@/stores/settingsStore";

export const Settings = () => {
  const { elevenLabsApiKey, setElevenLabsApiKey, currentTheme, setTheme } = useSettingsStore();
  const [config, setConfig] = useState({
    openai_api_key: '',
    claude_api_key: '',
    backend_url: 'http://localhost:11434',
    default_model: '',
    voice_enabled: false,
    auto_speak: false,
    voice_model: 'eleven_multilingual_v2',
    voice_id: 'EXAVITQu4vr4xnSDxMaL'
  });

  const handleSave = () => {
    // Save configuration to backend
    console.log('Saving configuration:', config);
    console.log('ElevenLabs API Key:', elevenLabsApiKey);
    console.log('Theme:', currentTheme);
    // In a real app, this would make an API call to save settings
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
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
        <h2 className={`text-2xl font-bold ${getTextClasses()} mb-2`}>Settings</h2>
        <p className={getSubTextClasses()}>Configure your NexusAI automation platform</p>
      </div>

      <div className="p-6 space-y-8 max-w-4xl">
        {/* Theme Selection */}
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

        {/* AI Operator Permissions */}
        <OperatorPermissions />

        {/* API Keys */}
        <Card className={getCardClasses()}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className={`w-5 h-5 ${currentTheme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
              <CardTitle className={getTextClasses()}>API Keys</CardTitle>
            </div>
            <CardDescription className={getSubTextClasses()}>
              Configure your AI service API keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="openai-key" className={getTextClasses()}>OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={config.openai_api_key}
                onChange={(e) => handleInputChange('openai_api_key', e.target.value)}
                placeholder="sk-..."
                className={`mt-1 ${getInputClasses()}`}
              />
            </div>
            
            <div>
              <Label htmlFor="claude-key" className={getTextClasses()}>Claude API Key</Label>
              <Input
                id="claude-key"
                type="password"
                value={config.claude_api_key}
                onChange={(e) => handleInputChange('claude_api_key', e.target.value)}
                placeholder="sk-ant-..."
                className={`mt-1 ${getInputClasses()}`}
              />
            </div>
            
            <div>
              <Label htmlFor="elevenlabs-key" className={getTextClasses()}>ElevenLabs API Key</Label>
              <Input
                id="elevenlabs-key"
                type="password"
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                placeholder="Enter your ElevenLabs API key..."
                className={`mt-1 ${getInputClasses()}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Backend Configuration */}
        <Card className={getCardClasses()}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Server className={`w-5 h-5 ${currentTheme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
              <CardTitle className={getTextClasses()}>Backend Configuration</CardTitle>
            </div>
            <CardDescription className={getSubTextClasses()}>
              Configure your AI backend connection and model selection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backend-url" className={getTextClasses()}>Backend URL</Label>
              <Input
                id="backend-url"
                value={config.backend_url}
                onChange={(e) => handleInputChange('backend_url', e.target.value)}
                placeholder="http://localhost:11434"
                className={`mt-1 ${getInputClasses()}`}
              />
              <div className="mt-1 text-xs text-gray-500">
                Examples: http://localhost:11434 (Ollama), https://api.openai.com/v1 (OpenAI), https://api.anthropic.com/v1 (Claude)
              </div>
            </div>
            
            <ModelSelector
              backendUrl={config.backend_url}
              apiKey={getApiKeyForBackend()}
              currentModel={config.default_model}
              onModelChange={(model) => handleInputChange('default_model', model)}
              textColor={getTextClasses()}
              inputClasses={getInputClasses()}
            />
          </CardContent>
        </Card>

        {/* Voice Configuration */}
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

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};
