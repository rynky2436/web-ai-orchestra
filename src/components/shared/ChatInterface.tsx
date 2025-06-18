
import { useState } from "react";
import { Send, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatInterfaceProps {
  title?: string;
  placeholder?: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
  error?: string;
  className?: string;
}

export const ChatInterface = ({ 
  title = "AI Assistant", 
  placeholder = "Type your message...",
  messages,
  onSendMessage,
  isProcessing = false,
  error,
  className = ""
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (error) {
    return (
      <Card className={`bg-red-500/10 border-red-500/30 ${className}`}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <h3 className="text-red-400 font-medium mb-2">Interface Error</h3>
          <p className="text-red-300 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/5 border-white/10 flex flex-col ${className}`}>
      <CardHeader className="pb-3 border-b border-white/10">
        <CardTitle className="text-white flex items-center text-base">
          <MessageSquare className="w-4 h-4 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      
      {/* Response Window - Scrollable Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-80 p-4">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' 
                    : 'bg-white/10 text-gray-200 border border-white/20'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 border border-white/20 p-3 rounded-lg text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                    <span className="ml-2">Processing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      {/* Input Box - Always at Bottom */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isProcessing}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-300 h-11"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
