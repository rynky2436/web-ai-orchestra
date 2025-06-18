
import { useState, useEffect } from "react";
import { Brain, Cpu, Mic, Globe, FileText, Database, Settings, Play, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfessionalStore } from "@/stores/professionalStore";
import { toast } from "@/hooks/use-toast";

export const ProfessionalAI = () => {
  const {
    config,
    currentProvider,
    currentModule,
    isProcessing,
    conversations,
    updateConfig,
    setCurrentProvider,
    setCurrentModule,
    processRequest,
    initializePlatform
  } = useProfessionalStore();

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [configForm, setConfigForm] = useState({
    openai_key: '',
    anthropic_key: '',
    grok_key: '',
    elevenlabs_key: ''
  });

  useEffect(() => {
    initializePlatform();
  }, [initializePlatform]);

  const modules = [
    { id: 'research', name: 'Deep Research', icon: Brain, description: 'Comprehensive research and analysis' },
    { id: 'coding', name: 'Code Generation', icon: Cpu, description: 'Advanced code generation and execution' },
    { id: 'voice', name: 'Voice Synthesis', icon: Mic, description: 'ElevenLabs voice generation' },
    { id: 'browser', name: 'Browser Automation', icon: Globe, description: 'Web automation and scraping' },
    { id: 'files', name: 'File Management', icon: FileText, description: 'Advanced file operations' },
    { id: 'memory', name: 'Memory System', icon: Database, description: 'Conversation memory and learning' }
  ];

  const providers = [
    { id: 'openai', name: 'OpenAI (GPT-4)', status: config.openai_api_key ? 'ready' : 'config' },
    { id: 'claude', name: 'Anthropic (Claude)', status: config.anthropic_api_key ? 'ready' : 'config' },
    { id: 'grok', name: 'xAI (Grok)', status: config.grok_api_key ? 'ready' : 'config' },
    { id: 'ollama', name: 'Ollama (Local)', status: 'ready' }
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const result = await processRequest(message);
      setResponse(JSON.stringify(result, null, 2));
      setMessage('');
      
      toast({
        title: "Request Processed",
        description: `Successfully processed via ${currentProvider} ${currentModule} module`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request",
        variant: "destructive"
      });
      console.error('Processing error:', error);
    }
  };

  const handleConfigSave = () => {
    updateConfig({
      openai_api_key: configForm.openai_key,
      anthropic_api_key: configForm.anthropic_key,
      grok_api_key: configForm.grok_key,
      elevenlabs_api_key: configForm.elevenlabs_key
    });

    toast({
      title: "Configuration Updated",
      description: "API keys have been saved securely"
    });
    
    setShowConfig(false);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Professional AI Platform</h2>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Multi-Provider Ready
            </Badge>
          </div>
          <Button
            onClick={() => setShowConfig(!showConfig)}
            className="bg-white/5 hover:bg-white/10 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Config
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {showConfig && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="password"
                  placeholder="OpenAI API Key"
                  value={configForm.openai_key}
                  onChange={(e) => setConfigForm({...configForm, openai_key: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
                <Input
                  type="password"
                  placeholder="Anthropic API Key"
                  value={configForm.anthropic_key}
                  onChange={(e) => setConfigForm({...configForm, anthropic_key: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
                <Input
                  type="password"
                  placeholder="Grok API Key"
                  value={configForm.grok_key}
                  onChange={(e) => setConfigForm({...configForm, grok_key: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
                <Input
                  type="password"
                  placeholder="ElevenLabs API Key"
                  value={configForm.elevenlabs_key}
                  onChange={(e) => setConfigForm({...configForm, elevenlabs_key: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              <Button onClick={handleConfigSave} className="bg-purple-500 hover:bg-purple-600 text-white">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">AI Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={currentProvider} onValueChange={setCurrentProvider}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id} className="text-white hover:bg-white/10">
                      <div className="flex items-center justify-between w-full">
                        <span>{provider.name}</span>
                        <Badge variant={provider.status === 'ready' ? 'default' : 'destructive'} className="ml-2">
                          {provider.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Active Module</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={currentModule} onValueChange={setCurrentModule}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id} className="text-white hover:bg-white/10">
                      <div className="flex items-center space-x-2">
                        <module.icon className="w-4 h-4" />
                        <span>{module.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className={`bg-white/5 border-white/10 cursor-pointer transition-all hover:bg-white/10 ${
                currentModule === module.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setCurrentModule(module.id)}
            >
              <CardContent className="p-4 text-center">
                <module.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white">{module.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">AI Request Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your AI request..."
              className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-24"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleSendMessage}
                disabled={isProcessing || !message.trim()}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Execute Request'}
              </Button>
              <Button
                onClick={() => setMessage('')}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {response && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                AI Response
                <Button
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(response)}
                  className="bg-white/5 hover:bg-white/10 text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-black/20 p-4 rounded-lg text-sm text-gray-300 overflow-auto max-h-96">
                {response}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
