
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const CodeSandbox = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectName, setProjectName] = useState("Untitled Project");
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
        setConnectionError("No AI providers connected. Code assistance features are unavailable.");
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError("Backend services are not available.");
    }
  };

  const runCode = async () => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Code execution requires backend connection",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    try {
      // This would integrate with actual code execution service
      setOutput("Code execution service not implemented yet.");
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable", 
        description: "AI assistant requires backend connection",
        variant: "destructive"
      });
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(message, { 
        component: 'code_sandbox',
        code: code,
        language: language 
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.content || "No response received"
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Error: Unable to process request. Backend service unavailable."
      }]);
    }
  };

  const saveCode = () => {
    if (!code.trim()) {
      toast({
        title: "Nothing to Save",
        description: "Please write some code first",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : language}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Saved",
      description: `${projectName} downloaded successfully`
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileCode className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Code Development Tool</h2>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {language}
              </Badge>
              <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={saveCode} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button 
                onClick={runCode} 
                disabled={isRunning || !isConnected}
                className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-4">
          {connectionError && (
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {connectionError}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10">
              <TabsTrigger value="editor" className="text-white data-[state=active]:bg-blue-500/20">Code Editor</TabsTrigger>
              <TabsTrigger value="output" className="text-white data-[state=active]:bg-blue-500/20">Output</TabsTrigger>
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
                    placeholder="Write your code here..."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="output" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-green-400" />
                    <CardTitle className="text-white text-sm">Output</CardTitle>
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

            <TabsContent value="settings" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Project Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">Project Name</Label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="w-96">
        <ChatInterface
          title="Code Assistant"
          placeholder={isConnected ? "Ask for coding help..." : "Connect AI service to enable chat"}
          messages={messages}
          onSendMessage={handleSendMessage}
          className="h-full"
          disabled={!isConnected}
        />
      </div>
    </div>
  );
};
