
import { useState, useEffect } from "react";
import { Chrome, Globe, Download, MousePointer, Code, Play, Send, MessageSquare, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

const PRE_PROMPT = "You are an AI browser automation agent. You perform web tasks like scraping, form filling, and navigation.";

export const BrowserAutomation = () => {
  const [url, setUrl] = useState('');
  const [script, setScript] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your browser automation assistant. I can help you scrape websites, fill forms, and automate browser tasks.' }
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
        setConnectionError("No AI providers connected. Browser automation features are unavailable.");
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError("Backend services are not available.");
    }
  };

  const runAutomation = async () => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Browser automation requires backend connection",
        variant: "destructive"
      });
      return;
    }

    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setOutput('Starting browser automation...\nNavigating to: ' + url + '\nExecuting script...');
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nNavigate to ${url} and execute the following automation:\n\n${script || 'Basic page analysis and data extraction'}`,
        { 
          component: 'browser_automation',
          action: 'run_automation',
          url,
          script
        }
      );
      
      setOutput(response.content || 'Automation completed - no detailed output received');
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      toast({
        title: "Automation Failed",
        description: "Unable to run browser automation. Backend service unavailable.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Browser assistant requires backend connection",
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
          component: 'browser_automation',
          context: { url, script, output }
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

  const executeQuickAction = async (action: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Quick actions require backend connection",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nExecute quick action: ${action} on website: ${url || 'current page'}`,
        { 
          component: 'browser_automation',
          action: 'quick_action',
          quickAction: action,
          url
        }
      );

      setOutput(response.content || `Executed ${action} successfully`);
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Unable to execute quick action. Backend service unavailable.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Chrome className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Browser Automation</h2>
          <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Primary Input Interface */}
        <div className="mt-4 space-y-2">
          <div className="flex space-x-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL..."
              className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
            />
            <Button
              onClick={runAutomation}
              disabled={isRunning || !isConnected}
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Launch'}
            </Button>
          </div>
          
          <Textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write your automation script or describe what you want to automate..."
            className="bg-white/5 border-white/10 text-white placeholder-gray-400 h-20"
          />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => executeQuickAction('scrape_data')}
                  disabled={!isConnected}
                  className="w-full justify-start bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Scrape Website Data
                </Button>
                <Button 
                  onClick={() => executeQuickAction('fill_forms')}
                  disabled={!isConnected}
                  className="w-full justify-start bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  Fill Forms Automatically
                </Button>
                <Button 
                  onClick={() => executeQuickAction('extract_elements')}
                  disabled={!isConnected}
                  className="w-full justify-start bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Extract Page Elements
                </Button>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Automation Output</CardTitle>
                  {output && (
                    <Button
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(output)}
                      className="bg-white/5 hover:bg-white/10 text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {output ? (
                  <pre className="bg-black/20 p-3 rounded text-sm text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {output}
                  </pre>
                ) : (
                  <div className="bg-black/20 p-3 rounded text-center text-gray-500">
                    {isConnected ? "Automation output will appear here..." : "Backend connection required for automation output"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Automation Script Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Write detailed automation script here..."
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-32"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={runAutomation}
                  disabled={isRunning || !isConnected}
                  className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Automation'}
                </Button>
                <Button 
                  variant="outline" 
                  disabled={!isConnected}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                >
                  Save Script
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Browser Assistant Chat */}
        <div className="w-80 border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h3 className="text-white font-medium flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Browser Assistant
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
                placeholder={isConnected ? "Ask about automation..." : "Connect AI service to enable chat"}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              />
              <Button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || !isConnected}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
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
