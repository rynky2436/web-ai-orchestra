
import { useState } from "react";
import { Chrome, Globe, Download, MousePointer, Code, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const BrowserAutomation = () => {
  const [url, setUrl] = useState('');
  const [script, setScript] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runAutomation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
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
      </div>

      <div className="p-6 space-y-6">
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

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Browser Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL..."
                className="bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Launch Browser Instance
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Automation Script</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Write your automation script or describe what you want to automate..."
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
    </div>
  );
};
