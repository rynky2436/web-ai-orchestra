
import { useState, useEffect } from "react";
import { Brain, Play, Copy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProfessionalStore } from "@/stores/professionalStore";
import { toast } from "@/hooks/use-toast";

export const ProfessionalAI = () => {
  const {
    config,
    isProcessing,
    conversations,
    processRequest,
    initializePlatform,
    moduleManager,
    updateConfig
  } = useProfessionalStore();

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [configForm, setConfigForm] = useState({
    host: config.host || '0.0.0.0',
    port: config.port?.toString() || '7777',
    memory_data_dir: config.memory_data_dir || 'data/memory'
  });

  useEffect(() => {
    initializePlatform();
  }, [initializePlatform]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const result = await processRequest(message);
      setResponse(JSON.stringify(result, null, 2));
      setMessage('');
      
      toast({
        title: "Request Processed",
        description: "Successfully processed reasoning request"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request - check your configuration",
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
      description: "Platform settings have been saved"
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
            <h2 className="text-xl font-semibold text-white">NEXUSai Reasoning Platform</h2>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Multi-Provider AI
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
          {/* Input Panel */}
          <Card className="bg-white/5 border-white/10 flex flex-col">
            <CardHeader>
              <CardTitle className="text-white">Reasoning Interface</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your reasoning task..."
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 flex-1 min-h-32"
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

          {/* Output Panel */}
          <Card className="bg-white/5 border-white/10 flex flex-col">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                AI Output
                {response && (
                  <Button
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(response)}
                    className="bg-white/5 hover:bg-white/10 text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {response ? (
                <pre className="bg-black/20 p-4 rounded-lg text-sm text-gray-300 overflow-auto flex-1">
                  {response}
                </pre>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>AI output will appear here</p>
                    <p className="text-sm mt-1">Send a reasoning task to get started</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversations */}
        {conversations.length > 0 && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {conversations.slice(0, 5).map((conv) => (
                  <div key={conv.id} className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        {conv.module} • {conv.provider}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(conv.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 truncate">{conv.userMessage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
