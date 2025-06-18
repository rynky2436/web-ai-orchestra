
import { useState } from "react";
import { Play, Save, FileCode, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/shared/ChatInterface";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const CodeSandbox = () => {
  const [code, setCode] = useState(`// Welcome to the Code Sandbox
function greet(name) {
  return \`Hello, \${name}! Welcome to NexusAI.\`;
}

console.log(greet("Developer"));`);
  
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const runCode = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput("Code executed successfully!\n\nHello, Developer! Welcome to NexusAI.");
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    // Save code functionality
    console.log("Code saved:", code);
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I can help you with that code. Here's what I suggest: ${message}` 
      }]);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex">
      {/* Main Code Editor */}
      <div className="flex-1 p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Code Sandbox</h2>
            <Badge variant="secondary">{language}</Badge>
          </div>
          <div className="flex space-x-2">
            <Button onClick={saveCode} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button 
              onClick={runCode} 
              disabled={isRunning}
              className="bg-green-500 hover:bg-green-600"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <Card className="bg-white/5 border-white/10 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Code Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[300px] bg-slate-900 border-slate-700 text-green-400 font-mono text-sm"
              placeholder="Enter your code here..."
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <CardTitle className="text-white text-sm">Output</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 border border-slate-700 rounded-md p-4 min-h-[120px]">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {output || "No output yet. Run your code to see results."}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Chat */}
      <div className="w-96">
        <ChatInterface
          title="Code Assistant"
          placeholder="Ask about your code..."
          messages={messages}
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
