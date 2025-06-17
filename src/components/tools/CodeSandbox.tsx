
import { useState } from "react";
import { Play, Download, Save, Code, Eye, FileCode, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const CodeSandbox = () => {
  const [code, setCode] = useState(`// Welcome to NexusAI Code Sandbox
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Create a simple visualization
const result = document.getElementById('output');
result.innerHTML = '<h3>Fibonacci Results</h3>';
for (let i = 0; i < 10; i++) {
  result.innerHTML += \`<p>F(\${i}) = \${fibonacci(i)}</p>\`;
}`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(`Fibonacci sequence:
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34`);
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Code Sandbox</h2>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Live Preview
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isRunning ? (
                <>Running...</>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 border-r border-white/10">
          <Tabs defaultValue="editor" className="h-full flex flex-col">
            <TabsList className="bg-white/5 border-b border-white/10 rounded-none">
              <TabsTrigger value="editor" className="text-white">
                <FileCode className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="console" className="text-white">
                <Zap className="w-4 h-4 mr-2" />
                Console
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-0">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-slate-900 text-gray-300 p-4 font-mono text-sm resize-none border-none outline-none"
                placeholder="Write your code here..."
              />
            </TabsContent>

            <TabsContent value="console" className="flex-1 m-0">
              <div className="h-full bg-black p-4 font-mono text-sm">
                <div className="text-green-400 mb-2">Console Output:</div>
                <pre className="text-gray-300 whitespace-pre-wrap">{output || 'No output yet. Run your code to see results.'}</pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="border-b border-white/10 p-2 bg-black/20">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Live Preview</span>
            </div>
          </div>
          
          <div className="flex-1 bg-white p-4 overflow-auto">
            <div id="output">
              <h3>Fibonacci Results</h3>
              <p>F(0) = 0</p>
              <p>F(1) = 1</p>
              <p>F(2) = 1</p>
              <p>F(3) = 2</p>
              <p>F(4) = 3</p>
              <p>F(5) = 5</p>
              <p>F(6) = 8</p>
              <p>F(7) = 13</p>
              <p>F(8) = 21</p>
              <p>F(9) = 34</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
