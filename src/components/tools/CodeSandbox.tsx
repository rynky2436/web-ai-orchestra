
import { useState } from "react";
import { Code, Play, Save, Download, Copy, Brain, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatInterface } from "@/components/shared/ChatInterface";

export const CodeSandbox = () => {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, NexusAI!");');
  const [output, setOutput] = useState('');
  const [aiRequest, setAiRequest] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant' as const, content: 'Hello! I\'m your AI coding assistant. I can help you write, debug, explain, and optimize code. What would you like to work on?' }
  ]);

  const runCode = () => {
    try {
      const result = `Executed successfully!\nOutput: Hello, NexusAI!\nExecution time: 0.23s`;
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  const handleAiGenerate = () => {
    if (!aiRequest.trim()) return;
    
    const generatedCode = `// AI Generated Code for: ${aiRequest}
function ${aiRequest.replace(/\s+/g, '')}() {
  console.log("This is AI-generated code for: ${aiRequest}");
  return true;
}

${aiRequest.replace(/\s+/g, '')}();`;

    setCode(generatedCode);
    setOutput('AI code generated successfully! Click "Run Code" to execute.');
    setAiRequest('');
  };

  const handleAIMessage = (message: string) => {
    setIsProcessing(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'll help you with "${message}". Let me analyze your code and provide assistance.` 
      }]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      {/* Header with Toolbar */}
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
          
          {/* Primary Toolbar */}
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
            <Button onClick={runCode} className="bg-green-500 hover:bg-green-600 text-white px-4">
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick AI Code Generator Toolbar */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 rounded-lg border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Quick Code Generator</h3>
          </div>
          <div className="flex space-x-3">
            <Input
              value={aiRequest}
              onChange={(e) => setAiRequest(e.target.value)}
              placeholder="Describe code to generate... (e.g., 'create a function to sort an array')"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-300 h-12 text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleAiGenerate()}
            />
            <Button 
              onClick={handleAiGenerate}
              disabled={!aiRequest.trim()}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 h-12"
            >
              <Brain className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content - Code Editor and Output */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <Card className="bg-white/5 border-white/10 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Code Editor</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
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

        {/* Standardized AI Chat Interface */}
        <div className="w-96 border-l border-white/10">
          <ChatInterface
            title="Code Assistant"
            placeholder="Ask about coding, debugging, or optimizations..."
            messages={messages}
            onSendMessage={handleAIMessage}
            isProcessing={isProcessing}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
