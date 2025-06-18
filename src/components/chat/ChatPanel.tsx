
import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfessionalStore } from "@/stores/professionalStore";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  provider?: string;
  module?: string;
}

interface ChatPanelProps {
  selectedAgent: string | null;
}

export const ChatPanel = ({ selectedAgent }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m NexusAI, your professional AI automation assistant. I can help with research, coding, automation, and much more. What would you like me to help you with today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentProvider,
    currentModule,
    isProcessing,
    setCurrentProvider,
    setCurrentModule,
    processRequest,
    initializePlatform
  } = useProfessionalStore();

  useEffect(() => {
    initializePlatform();
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not capture audio. Please try again.",
          variant: "destructive"
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, [initializePlatform]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text: string) => {
    if (speechSynthesis && isPlaying) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    try {
      const result = await processRequest(currentInput);
      
      let responseContent = '';
      if (typeof result === 'string') {
        responseContent = result;
      } else if (result && typeof result === 'object') {
        if (result.findings) {
          responseContent = result.findings;
        } else if (result.code) {
          responseContent = `Here's the code I generated:\n\n\`\`\`\n${result.code}\n\`\`\``;
        } else if (result.plan) {
          responseContent = result.plan;
        } else if (result.insights) {
          responseContent = result.insights;
        } else {
          responseContent = JSON.stringify(result, null, 2);
        }
      } else {
        responseContent = "I've processed your request successfully.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        provider: currentProvider,
        module: currentModule
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak response if enabled
      if (isPlaying) {
        speakText(responseContent);
      }

      toast({
        title: "Request Processed",
        description: `Completed using ${currentProvider} with ${currentModule} module`
      });

    } catch (error) {
      console.error('Error processing request:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I encountered an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your API configuration.`,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to process request. Please check your configuration.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now, I'm listening"
      });
    }
  };

  const toggleAutoSpeak = () => {
    if (isPlaying) {
      speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Auto-speak Disabled" : "Auto-speak Enabled",
      description: isPlaying ? "Responses will no longer be spoken" : "Responses will be automatically spoken"
    });
  };

  const stopSpeaking = () => {
    speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900/50 to-black/50">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">AI Chat</h2>
            {selectedAgent && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Bot className="w-3 h-3 mr-1" />
                {selectedAgent} Active
              </Badge>
            )}
            {isProcessing && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
                Processing...
              </Badge>
            )}
            {isSpeaking && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
                <Volume2 className="w-3 h-3 mr-1" />
                Speaking
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={currentProvider} onValueChange={setCurrentProvider}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="grok">Grok</SelectItem>
                <SelectItem value="ollama">Ollama</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currentModule} onValueChange={setCurrentModule}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="voice">Voice</SelectItem>
                <SelectItem value="browser">Browser</SelectItem>
                <SelectItem value="files">Files</SelectItem>
                <SelectItem value="memory">Memory</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoSpeak}
              className={`${
                isPlaying 
                  ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>

            {isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
              >
                <Square className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${
              message.role === 'user' 
                ? 'bg-blue-500/20 border-blue-500/30' 
                : 'bg-white/5 border-white/10'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      {message.provider && message.module && (
                        <div className="flex space-x-1">
                          <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                            {message.provider}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                            {message.module}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleListening}
            className={`${
              isListening 
                ? 'bg-red-500/20 border-red-500/30 text-red-400 animate-pulse' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything - research, coding, automation, or general questions..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50"
            disabled={isProcessing}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
