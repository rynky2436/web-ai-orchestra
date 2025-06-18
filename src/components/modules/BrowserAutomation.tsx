
import { useState } from "react";
import { Chrome, Globe, Download, MousePointer, Code, Play, Send, MessageSquare, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const BrowserAutomation = () => {
  const [url, setUrl] = useState('');
  const [script, setScript] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your browser automation assistant. I can help you scrape websites, fill forms, and automate browser tasks.' }
  ]);

  const runAutomation = () => {
    setIsRunning(true);
    setOutput('Starting browser automation...\nNavigating to: ' + url + '\nExecuting script...');
    
    setTimeout(() => {
      setOutput(prev => prev + '\nAutomation completed successfully!\nData extracted: 15 items\nForm filled: 1\nScreenshots taken: 2');
      setIsRunning(false);
    }, 3000);
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: chatInput },
      { role: 'assistant', content: `I'll help you with "${chatInput}". Let me assist with your browser automation task.` }
    ]);
    setChatInput('');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Chrome className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Browser Automation</h2>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Puppeteer Ready
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
              disabled={isRunning || !url.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-white/5 hover:bg-white/10 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Scrape Website Data
                </Button>
                <Button className="w-full justify-start bg-white/5 hover:bg-white/10 text-white">
                  <MousePointer className="w-4 h-4 mr-2" />
                  Fill Forms Automatically
                </Button>
                <Button className="w-full justify-start bg-white/5 hover:bg-white/10 text-white">
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
                    Automation output will appear here...
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
                  disabled={isRunning}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Automation'}
                </Button>
                <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
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
                placeholder="Ask about automation..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              />
              <Button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim()}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
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
