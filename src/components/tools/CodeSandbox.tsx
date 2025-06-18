
import { useState, useEffect } from "react";
import { Play, Save, FileCode, Terminal, Brain, Settings, Monitor, Shield, Cloud, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/shared/ChatInterface";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const CodeSandbox = () => {
  const [code, setCode] = useState(`// Welcome to the AI Code Sandbox
function greet(name) {
  return \`Hello, \${name}! Welcome to NexusAI.\`;
}

console.log(greet("Developer"));`);
  
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiAssistanceEnabled, setAiAssistanceEnabled] = useState(true);
  const [autoComplete, setAutoComplete] = useState(true);
  const [codeAnalysis, setCodeAnalysis] = useState(true);
  const [securityScan, setSecurityScan] = useState(true);
  const [projectName, setProjectName] = useState("My Project");
  
  const [aiSettings, setAiSettings] = useState({
    model: "gpt-4",
    autoFix: true,
    codeReview: true,
    optimization: true,
    documentation: false
  });

  // AI monitoring for code quality
  useEffect(() => {
    if (codeAnalysis && code.length > 10) {
      const analyzeCode = setTimeout(() => {
        console.log('AI analyzing code quality...');
        // Simulate AI code analysis
      }, 2000);

      return () => clearTimeout(analyzeCode);
    }
  }, [code, codeAnalysis]);

  const runCode = async () => {
    setIsRunning(true);
    try {
      toast({
        title: "Executing Code",
        description: "AI is analyzing and running your code..."
      });

      // Simulate code execution with AI analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let result = "";
      if (language === "javascript") {
        try {
          // Simulate JavaScript execution
          result = "Code executed successfully!\n\nHello, Developer! Welcome to NexusAI.";
          if (code.includes("console.log")) {
            result += "\n\nConsole output detected and captured.";
          }
        } catch (error) {
          result = `Error: ${error}`;
        }
      } else if (language === "python") {
        result = "Python code executed successfully!\nOutput: Hello from Python!";
      } else if (language === "html") {
        result = "HTML rendered successfully in preview panel.";
      }

      setOutput(result);
      
      if (securityScan) {
        setTimeout(() => {
          toast({
            title: "Security Scan Complete",
            description: "No security vulnerabilities detected"
          });
        }, 1500);
      }

    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const analyzeCodeWithAI = async () => {
    toast({
      title: "AI Code Analysis",
      description: "Analyzing code quality, performance, and security..."
    });

    setTimeout(() => {
      const analysis = `AI Analysis Report:
✅ Syntax: Valid
✅ Best Practices: Good
⚠️  Performance: Consider optimization
✅ Security: No vulnerabilities found
📝 Suggestions: Add error handling`;

      setOutput(analysis);
      toast({
        title: "Analysis Complete",
        description: "Code analysis report generated"
      });
    }, 2000);
  };

  const optimizeCode = async () => {
    if (!code.trim()) return;

    toast({
      title: "AI Optimization",
      description: "Optimizing your code for better performance..."
    });

    setTimeout(() => {
      const optimizedCode = `// AI-Optimized Code
function greet(name) {
  // Added input validation
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid name parameter');
  }
  
  return \`Hello, \${name.trim()}! Welcome to NexusAI.\`;
}

try {
  console.log(greet("Developer"));
} catch (error) {
  console.error('Error:', error.message);
}`;

      setCode(optimizedCode);
      toast({
        title: "Code Optimized",
        description: "AI has improved your code with best practices"
      });
    }, 2000);
  };

  const generateDocumentation = () => {
    toast({
      title: "Generating Documentation",
      description: "AI is creating comprehensive documentation..."
    });

    setTimeout(() => {
      const docs = `/**
 * Greet Function Documentation
 * 
 * @description A function that creates a personalized greeting message
 * @param {string} name - The name of the person to greet
 * @returns {string} A formatted greeting message
 * @throws {Error} If name is not a valid string
 * 
 * @example
 * const message = greet("Alice");
 * console.log(message); // "Hello, Alice! Welcome to NexusAI."
 */`;

      setOutput(docs);
      toast({
        title: "Documentation Generated",
        description: "AI has created detailed documentation"
      });
    }, 1500);
  };

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // AI assistant logic
    setTimeout(() => {
      let response = "I can help you with that! ";
      
      if (message.toLowerCase().includes('optimize')) {
        response = "I'll optimize your code for better performance and readability. Let me analyze it...";
        optimizeCode();
      } else if (message.toLowerCase().includes('analyze') || message.toLowerCase().includes('review')) {
        response = "I'll perform a comprehensive code analysis including security, performance, and best practices.";
        analyzeCodeWithAI();
      } else if (message.toLowerCase().includes('document')) {
        response = "I'll generate detailed documentation for your code including examples and usage notes.";
        generateDocumentation();
      } else if (message.toLowerCase().includes('debug') || message.toLowerCase().includes('error')) {
        response = "I'll help you debug the code. Let me check for common issues and suggest fixes.";
      } else if (message.toLowerCase().includes('explain')) {
        response = "I'll explain how your code works and what each part does. This helps improve understanding.";
      } else {
        response += "I can help with code optimization, debugging, analysis, documentation, and explanations. What would you like me to focus on?";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'html'}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Saved",
      description: `${projectName} saved successfully`
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileCode className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">AI Code Sandbox</h2>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {language}
              </Badge>
              {aiAssistanceEnabled && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Active
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={analyzeCodeWithAI} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Brain className="w-4 h-4 mr-2" />
                AI Analyze
              </Button>
              <Button onClick={saveCode} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button 
                onClick={runCode} 
                disabled={isRunning}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? "Running..." : "Run"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-4">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
              <TabsTrigger value="editor" className="text-white data-[state=active]:bg-blue-500/20">Code Editor</TabsTrigger>
              <TabsTrigger value="output" className="text-white data-[state=active]:bg-blue-500/20">Output</TabsTrigger>
              <TabsTrigger value="ai-tools" className="text-white data-[state=active]:bg-blue-500/20">AI Tools</TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-500/20">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">Code Editor</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[400px] bg-slate-900 border-slate-700 text-green-400 font-mono text-sm"
                    placeholder="Enter your code here..."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="output" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-green-400" />
                    <CardTitle className="text-white text-sm">Output & Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 border border-slate-700 rounded-md p-4 min-h-[400px]">
                    <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                      {output || "No output yet. Run your code to see results."}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-tools" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">AI Code Enhancement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={optimizeCode} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                      <Brain className="w-4 h-4 mr-2" />
                      Optimize Code
                    </Button>
                    <Button onClick={analyzeCodeWithAI} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <Monitor className="w-4 h-4 mr-2" />
                      Security Scan
                    </Button>
                    <Button onClick={generateDocumentation} className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <FileCode className="w-4 h-4 mr-2" />
                      Generate Docs
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Project Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-white text-sm">Project Name</Label>
                      <Input
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <Cloud className="w-4 h-4 mr-2" />
                      Save to Cloud
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Assistant Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Enable AI Assistance</Label>
                    <Switch checked={aiAssistanceEnabled} onCheckedChange={setAiAssistanceEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto-complete Suggestions</Label>
                    <Switch checked={autoComplete} onCheckedChange={setAutoComplete} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Real-time Code Analysis</Label>
                    <Switch checked={codeAnalysis} onCheckedChange={setCodeAnalysis} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Security Scanning</Label>
                    <Switch checked={securityScan} onCheckedChange={setSecurityScan} />
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <Label className="text-white text-sm">AI Model</Label>
                    <Select value={aiSettings.model} onValueChange={(value) => setAiSettings(prev => ({ ...prev, model: value }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="codellama">CodeLlama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Assistant Chat */}
      <div className="w-96">
        <ChatInterface
          title="Code Assistant AI"
          placeholder="Ask me to optimize, debug, analyze, or explain your code..."
          messages={messages}
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
