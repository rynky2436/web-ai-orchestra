
import { useState, useEffect } from "react";
import { Monitor, Terminal, Chrome, Settings, Play, Square, Send, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

const PRE_PROMPT = "You are a system operator AI. You help the user execute OS-level commands, launch programs, and manage processes.";

export const OperatorModule = () => {
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your system operator assistant. I can help you execute commands, manage processes, and control system operations.' }
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const providers = await aiRoutingService.getProviderStatus();
      const hasConnectedProvider = providers.some(p => p.connected);
      setIsConnected(hasConnectedProvider);
      
      if (!hasConnectedProvider) {
        setConnectionError("No AI providers connected. System operator features are unavailable.");
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError("Backend services are not available.");
    }
  };

  const executeCommand = async () => {
    if (!command.trim()) return;

    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Command execution requires backend connection",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setLogs(prev => [...prev, `> ${command}`]);
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nExecute this system command: ${command}`,
        { 
          component: 'operator_module',
          action: 'execute_command',
          command
        }
      );
      
      setLogs(prev => [...prev, response.content || 'Command executed - no output received']);
    } catch (error) {
      setLogs(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`]);
      toast({
        title: "Command Failed",
        description: "Unable to execute command. Backend service unavailable.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCommand('');
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "System assistant requires backend connection",
        variant: "destructive"
      });
      return;
    }
    
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: chatInput }
    ]);

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\n${chatInput}`,
        { 
          component: 'operator_module',
          context: { recentCommands: logs.slice(-5) }
        }
      );
      
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.content || "No response received from AI backend" }
      ]);
    } catch (error) {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Error: Unable to process request. Backend service unavailable." }
      ]);
    }

    setChatInput('');
  };

  const launchTool = async (tool: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Tool launching requires backend connection",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nLaunch ${tool} application or tool.`,
        { 
          component: 'operator_module',
          action: 'launch_tool',
          tool
        }
      );

      setLogs(prev => [...prev, `Launching ${tool}...`, response.content || `${tool} launched successfully`]);
    } catch (error) {
      toast({
        title: "Launch Failed",
        description: `Unable to launch ${tool}. Backend service unavailable.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">System Operator</h2>
          <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Primary Command Input */}
        <div className="mt-4 flex space-x-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter system command or natural language instruction..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
          />
          <Button
            onClick={executeCommand}
            disabled={!command.trim() || isRunning || !isConnected}
            className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Stop' : 'Execute'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {connectionError && (
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {connectionError}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>Terminal Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Execute system commands and scripts with AI assistance.
                </p>
                <Button 
                  onClick={() => launchTool('terminal')}
                  disabled={!isConnected}
                  className="w-full bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                >
                  Open Terminal
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Chrome className="w-4 h-4" />
                  <span>Browser Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  AI-powered Chrome automation and control capabilities.
                </p>
                <Button 
                  onClick={() => launchTool('browser')}
                  disabled={!isConnected}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                >
                  Launch Browser
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>System Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Modify system configurations with AI guidance.
                </p>
                <Button 
                  onClick={() => launchTool('settings')}
                  disabled={!isConnected}
                  className="w-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                >
                  Open Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Command Output */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Command Output</CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length > 0 ? (
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="text-gray-300">
                      {log}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-black/20 rounded-lg p-4 text-center text-gray-500">
                  {isConnected ? "Command output will appear here..." : "Backend connection required for command execution"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Assistant Chat */}
        <div className="w-80 border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h3 className="text-white font-medium flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              System Assistant
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500/20 text-blue-100' 
                    : 'bg-white/5 text-gray-300'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isConnected ? "Ask about system operations..." : "Connect AI service to enable chat"}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              />
              <Button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || !isConnected}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
