
import { useState } from "react";
import { Monitor, Terminal, Mouse, Keyboard, Chrome, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const OperatorModule = () => {
  const [command, setCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [systemAccess, setSystemAccess] = useState(false);

  const executeCommand = async () => {
    if (!command.trim() || !systemAccess) return;
    
    setIsExecuting(true);
    // This will integrate with your Python backend
    console.log('Executing system command:', command);
    
    setTimeout(() => {
      setIsExecuting(false);
      setCommand('');
    }, 2000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Operator Module</h2>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              System Control
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Full System Access</span>
              <Switch
                checked={systemAccess}
                onCheckedChange={setSystemAccess}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">Terminal</div>
                  <div className="text-xs text-gray-400">Ready</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Chrome className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">Browser</div>
                  <div className="text-xs text-gray-400">Connected</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mouse className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm font-medium text-white">UI Control</div>
                  <div className="text-xs text-gray-400">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Keyboard className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm font-medium text-white">Keyboard</div>
                  <div className="text-xs text-gray-400">Monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Command Interface */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">System Command Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter system command (e.g., 'Open Chrome and navigate to google.com', 'Create a new file on desktop', 'Run Python script in Documents folder')"
              className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-[100px]"
              disabled={!systemAccess}
            />
            
            <Button
              onClick={executeCommand}
              disabled={!command.trim() || !systemAccess || isExecuting}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              {isExecuting ? 'Executing...' : 'Execute System Command'}
            </Button>
            
            {!systemAccess && (
              <div className="text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                ⚠️ System access is disabled. Enable "Full System Access" to use the Operator module.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
