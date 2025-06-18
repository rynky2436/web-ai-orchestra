
import { useState } from "react";
import { Monitor, Play, Square, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConnectionStatus } from "@/components/shared/ConnectionStatus";
import { OperatorPanel } from "./operator/OperatorPanel";
import { useOperatorAI } from "@/hooks/useOperatorAI";
import { toast } from "@/hooks/use-toast";

export const OperatorModule = () => {
  const [command, setCommand] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your system operator assistant. I can help you execute commands, manage processes, and control system operations.' }
  ]);
  const [isConnected, setIsConnected] = useState(false);

  const { executeCommand, sendChatMessage, isRunning, logs } = useOperatorAI();

  const handleExecuteCommand = async () => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Command execution requires backend connection",
        variant: "destructive"
      });
      return;
    }

    try {
      await executeCommand(command);
      setCommand('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !isConnected) {
      if (!isConnected) {
        toast({
          title: "Service Unavailable",
          description: "System assistant requires backend connection",
          variant: "destructive"
        });
      }
      return;
    }
    
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: chatInput }
    ]);

    try {
      const response = await sendChatMessage(chatInput);
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

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">System Operator</h2>
          <ConnectionStatus 
            showAlert={false}
            className="flex items-center"
          />
        </div>

        <div className="mt-4 flex space-x-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter system command or natural language instruction..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && handleExecuteCommand()}
          />
          <Button
            onClick={handleExecuteCommand}
            disabled={!command.trim() || isRunning || !isConnected}
            className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Stop' : 'Execute'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 p-6 space-y-6">
          <ConnectionStatus />

          <OperatorPanel isConnected={isConnected} />

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
