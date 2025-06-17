
import { useState } from "react";
import { Monitor, Terminal, Chrome, Settings, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export const OperatorModule = () => {
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const executeCommand = () => {
    if (!command.trim()) return;
    
    setIsRunning(true);
    setLogs(prev => [...prev, `> ${command}`]);
    
    // Simulate command execution
    setTimeout(() => {
      setLogs(prev => [...prev, `Executed: ${command}`, 'Command completed successfully']);
      setIsRunning(false);
      setCommand('');
    }, 2000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">System Operator</h2>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Full Access
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>Terminal Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                Execute system commands and scripts with full access.
              </p>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                Open Terminal
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Chrome className="w-4 h-4" />
                <span>Browser Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                Full Chrome automation and control capabilities.
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Launch Browser
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>System Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                Modify system configurations and preferences.
              </p>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Command Execution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter system command or natural language instruction..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                rows={3}
              />
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={executeCommand}
                  disabled={!command.trim() || isRunning}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            {logs.length > 0 && (
              <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="text-gray-300">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
