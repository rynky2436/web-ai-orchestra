
import { useState } from "react";
import { Send, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface AIChatProps {
  title?: string;
  placeholder?: string;
  initialMessage?: string;
  onSendMessage?: (message: string) => void;
  className?: string;
  error?: string;
}

export const AIChat = ({ 
  title = "AI Assistant", 
  placeholder = "Type your message...",
  initialMessage = "Hello! How can I help you today?",
  onSendMessage,
  className = "",
  error
}: AIChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialMessage }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Call the module-specific handler
    onSendMessage?.(userMessage);
    
    // Simulate AI response (modules can override this)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'll help you with "${userMessage}". Processing your request...` 
      }]);
    }, 500);
    
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
          <h3 className="text-red-400 font-medium mb-2">Communication Error</h3>
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
      
      {/* Output Window - Scrolling Chat */}
      <CardContent className="flex-1 p-0">
        <div className="h-80 overflow-y-auto p-4 space-y-3">
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
        </div>
      </CardContent>
      
      {/* Input Box - Always at Bottom */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-300 h-11"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
