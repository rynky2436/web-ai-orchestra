
import { useState } from "react";
import { Monitor, Terminal, Chrome, Settings, Play, Square, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const OperatorModule = () => {
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your system operator assistant. I can help you execute commands, manage processes, and control system operations.' }
  ]);

  const executeCommand = () => {
    if (!command.trim()) return;
    
    setIsRunning(true);
    setLogs(prev => [...prev, `> ${command}`]);
    
    // Simulate command execution
    setTimeout(() => {
      setLogs(prev => [...prev, `Executed: ${command}`, 'Command completed successfully']);
      setIsRunning(false);
      setCommand('');
    }, 2000);
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: chatInput },
      { role: 'assistant', content: `I'll help you with "${chatInput}". Let me process this system operation request.` }
    ]);
    setChatInput('');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">System Operator</h2>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Full Access
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
            disabled={!command.trim() || isRunning}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Stop' : 'Execute'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
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
                  Execute system commands and scripts with full access.
                </p>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
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
                  Full Chrome automation and control capabilities.
                </p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
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
                  Modify system configurations and preferences.
                </p>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
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
                  Command output will appear here...
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
                placeholder="Ask about system operations..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              />
              <Button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim()}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
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
