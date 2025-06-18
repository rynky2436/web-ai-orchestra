
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
      {/* Prominent Header with Communication */}
      <div className="border-b border-white/10 p-6 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Code Sandbox</h2>
              <p className="text-gray-400 text-sm">Write, run, and debug code with AI assistance</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={runCode} className="bg-green-500 hover:bg-green-600 text-white px-6">
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* PRIMARY COMMUNICATION INTERFACE - Most Prominent */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 rounded-lg border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">AI Code Assistant - Tell me what to code</h3>
          </div>
          <div className="flex space-x-3">
            <Input
              value={aiRequest}
              onChange={(e) => setAiRequest(e.target.value)}
              placeholder="Describe what code you want me to generate... (e.g., 'create a function to sort an array', 'build a React component for a todo list')"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-300 h-12 text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleAiGenerate()}
            />
            <Button 
              onClick={handleAiGenerate}
              disabled={!aiRequest.trim()}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 h-12"
            >
              <Brain className="w-4 h-4 mr-2" />
              Generate Code
            </Button>
          </div>
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

        {/* PROMINENT AI Chat Assistant */}
        <div className="w-96 border-l border-white/10 flex flex-col bg-gradient-to-b from-purple-900/20 to-blue-900/20">
          <div className="p-4 border-b border-white/10 bg-black/30">
            <h3 className="text-white font-bold text-lg flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
              Live AI Assistant
            </h3>
            <p className="text-gray-300 text-sm mt-1">Ask questions, get help, debug code</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500/30 text-blue-100 border border-blue-400/30' 
                    : 'bg-white/10 text-gray-200 border border-white/20'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          {/* PROMINENT Chat Input */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex space-x-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything about coding..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-300 h-10"
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              />
              <Button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim()}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white px-4 h-10"
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
