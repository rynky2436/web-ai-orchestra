
import { useState, useEffect } from "react";
import { Brain, Cpu, Search, BarChart3, Database, Settings, Play, Copy } from "lucide-react";
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
    currentModule,
    isProcessing,
    conversations,
    updateConfig,
    setCurrentModule,
    processRequest,
    initializePlatform
  } = useProfessionalStore();

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [configForm, setConfigForm] = useState({
    host: config.host || '0.0.0.0',
    port: config.port.toString() || '7777',
    memory_data_dir: config.memory_data_dir || 'data/memory'
  });

  useEffect(() => {
    initializePlatform();
  }, [initializePlatform]);

  const modules = [
    { id: 'research', name: 'Deep Research', icon: Search, description: 'Advanced research with reasoning' },
    { id: 'coding', name: 'Strategic Coding', icon: Cpu, description: 'Intelligent code generation' },
    { id: 'decision', name: 'Decision Engine', icon: Brain, description: 'Multi-level decision making' },
    { id: 'analysis', name: 'Deep Analysis', icon: BarChart3, description: 'Pattern recognition & insights' },
    { id: 'memory', name: 'Memory System', icon: Database, description: 'Semantic memory & learning' }
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const result = await processRequest(message);
      setResponse(JSON.stringify(result, null, 2));
      setMessage('');
      
      toast({
        title: "Request Processed",
        description: `Successfully processed via ${currentModule} reasoning module`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request - ensure Python backend is running",
        variant: "destructive"
      });
      console.error('Processing error:', error);
    }
  };

  const handleConfigSave = () => {
    updateConfig({
      host: configForm.host,
      port: parseInt(configForm.port),
      memory_data_dir: configForm.memory_data_dir
    });

    toast({
      title: "Configuration Updated",
      description: "Backend connection settings have been saved"
    });
    
    setShowConfig(false);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Custom Reasoning Platform</h2>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Advanced AI Reasoning
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
              <CardTitle className="text-white">Backend Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Backend Host"
                  value={configForm.host}
                  onChange={(e) => setConfigForm({...configForm, host: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
                <Input
                  type="number"
                  placeholder="Backend Port"
                  value={configForm.port}
                  onChange={(e) => setConfigForm({...configForm, port: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
                <Input
                  placeholder="Memory Data Directory"
                  value={configForm.memory_data_dir}
                  onChange={(e) => setConfigForm({...configForm, memory_data_dir: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              <Button onClick={handleConfigSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Active Reasoning Module</CardTitle>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className={`bg-white/5 border-white/10 cursor-pointer transition-all hover:bg-white/10 ${
                currentModule === module.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setCurrentModule(module.id)}
            >
              <CardContent className="p-4 text-center">
                <module.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white">{module.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Reasoning Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your reasoning task..."
              className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-24"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleSendMessage}
                disabled={isProcessing || !message.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Execute Reasoning'}
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
                Reasoning Response
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
