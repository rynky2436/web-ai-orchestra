
import { useState } from "react";
import { Code, Play, Save, Download, MessageSquare, Send, Brain, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CodeSandbox = () => {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, NexusAI!");');
  const [output, setOutput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your AI coding assistant. I can help you write, debug, and explain code. What would you like to work on?' }
  ]);
  const [aiRequest, setAiRequest] = useState('');

  const runCode = () => {
    try {
      // Simulate code execution
      const result = `Executed successfully!\nOutput: Hello, NexusAI!\nExecution time: 0.23s`;
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: chatInput },
      { role: 'assistant', content: `I'll help you with "${chatInput}". Let me analyze your code and provide suggestions.` }
    ]);
    setChatInput('');
  };

  const handleAiGenerate = () => {
    if (!aiRequest.trim()) return;
    
    const generatedCode = `// AI Generated Code for: ${aiRequest}
function ${aiRequest.replace(/\s+/g, '')}() {
  // Implementation will be generated based on your request
  console.log("This is AI-generated code for: ${aiRequest}");
  return true;
}

// Call the function
${aiRequest.replace(/\s+/g, '')}();`;

    setCode(generatedCode);
    setOutput('AI code generated successfully! Click "Run Code" to execute.');
    setChatMessages(prev => [
      ...prev,
      { role: 'assistant', content: `I've generated code for "${aiRequest}". The code has been added to your editor.` }
    ]);
    setAiRequest('');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Code Sandbox</h2>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={runCode} className="bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* AI Code Generation Input */}
        <div className="mt-4 flex space-x-2">
          <Input
            value={aiRequest}
            onChange={(e) => setAiRequest(e.target.value)}
            placeholder="Describe what code you want AI to generate..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && handleAiGenerate()}
          />
          <Button 
            onClick={handleAiGenerate}
            disabled={!aiRequest.trim()}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            Generate Code
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <Card className="bg-white/5 border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white">Code Editor</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 bg-slate-900 text-gray-300 font-mono text-sm resize-none border-white/10"
                  placeholder="Write your code here..."
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Output Panel */}
          <div className="h-48 p-4 pt-0">
            <Card className="bg-white/5 border-white/10 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Output</CardTitle>
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
                <pre className="text-gray-300 text-sm whitespace-pre-wrap h-24 overflow-y-auto">
                  {output || 'Output will appear here after running code...'}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Assistant Chat */}
        <div className="w-80 border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h3 className="text-white font-medium flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Assistant
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
                placeholder="Ask about your code..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              />
              <Button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim()}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
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
