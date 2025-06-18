
import { useState } from "react";
import { Save, Key, Server, Volume2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OperatorPermissions } from "./OperatorPermissions";

export const Settings = () => {
  const [config, setConfig] = useState({
    openai_api_key: '',
    claude_api_key: '',
    elevenlabs_api_key: '',
    backend_url: 'http://localhost:8000',
    default_model: 'gpt-4o',
    voice_enabled: false,
    auto_speak: false,
    voice_model: 'eleven_multilingual_v2',
    voice_id: 'EXAVITQu4vr4xnSDxMaL'
  });

  const handleSave = () => {
    // Save configuration to backend
    console.log('Saving configuration:', config);
    // In a real app, this would make an API call to save settings
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-slate-900/50 to-black/50">
      {/* Header */}
      <div className="border-b border-white/10 p-6 bg-black/20 backdrop-blur-lg">
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Configure your NexusAI automation platform</p>
      </div>

      <div className="p-6 space-y-8 max-w-4xl">
        {/* AI Operator Permissions - New Section */}
        <OperatorPermissions />

        {/* API Keys */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white">API Keys</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Configure your AI service API keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="openai-key" className="text-white">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={config.openai_api_key}
                onChange={(e) => handleInputChange('openai_api_key', e.target.value)}
                placeholder="sk-..."
                className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="claude-key" className="text-white">Claude API Key</Label>
              <Input
                id="claude-key"
                type="password"
                value={config.claude_api_key}
                onChange={(e) => handleInputChange('claude_api_key', e.target.value)}
                placeholder="sk-ant-..."
                className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="elevenlabs-key" className="text-white">ElevenLabs API Key</Label>
              <Input
                id="elevenlabs-key"
                type="password"
                value={config.elevenlabs_api_key}
                onChange={(e) => handleInputChange('elevenlabs_api_key', e.target.value)}
                placeholder="..."
                className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Backend Configuration */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-green-400" />
              <CardTitle className="text-white">Backend Configuration</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Configure your Python backend connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backend-url" className="text-white">Backend URL</Label>
              <Input
                id="backend-url"
                value={config.backend_url}
                onChange={(e) => handleInputChange('backend_url', e.target.value)}
                placeholder="http://localhost:8000"
                className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="default-model" className="text-white">Default AI Model</Label>
              <Select 
                value={config.default_model} 
                onValueChange={(value) => handleInputChange('default_model', value)}
              >
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-3">Claude-3</SelectItem>
                  <SelectItem value="ollama-llama2">Ollama Llama2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Voice Configuration */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Voice Configuration</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Configure speech recognition and text-to-speech
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4 text-gray-400" />
                <Label className="text-white">Enable Voice Input</Label>
              </div>
              <Switch
                checked={config.voice_enabled}
                onCheckedChange={(checked) => handleInputChange('voice_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">Auto-speak Responses</Label>
              <Switch
                checked={config.auto_speak}
                onCheckedChange={(checked) => handleInputChange('auto_speak', checked)}
              />
            </div>
            
            <Separator className="bg-white/10" />
            
            <div>
              <Label htmlFor="voice-model" className="text-white">Voice Model</Label>
              <Select 
                value={config.voice_model} 
                onValueChange={(value) => handleInputChange('voice_model', value)}
              >
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="eleven_multilingual_v2">Multilingual v2</SelectItem>
                  <SelectItem value="eleven_turbo_v2_5">Turbo v2.5</SelectItem>
                  <SelectItem value="eleven_turbo_v2">Turbo v2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="voice-id" className="text-white">Voice ID</Label>
              <Select 
                value={config.voice_id} 
                onValueChange={(value) => handleInputChange('voice_id', value)}
              >
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
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
