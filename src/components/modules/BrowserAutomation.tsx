
import { useState } from "react";
import { Chrome, Play, Square, Download, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BrowserAutomation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [script, setScript] = useState(`// Browser automation script
await page.goto('https://example.com');
await page.waitForSelector('input[name="search"]');
await page.type('input[name="search"]', 'search query');
await page.click('button[type="submit"]');
await page.waitForNavigation();
const results = await page.$$eval('.result', elements => 
  elements.map(el => el.textContent)
);
return results;`);

  const startAutomation = () => {
    setIsRunning(true);
    // Integrate with your Python Puppeteer backend
    console.log('Starting browser automation');
  };

  const stopAutomation = () => {
    setIsRunning(false);
    console.log('Stopping browser automation');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Chrome className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Browser Automation</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={isRunning ? stopAutomation : startAutomation}
              className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-white/10">
          <Tabs defaultValue="script" className="h-full flex flex-col">
            <TabsList className="bg-white/5 border-b border-white/10 rounded-none">
              <TabsTrigger value="script" className="text-white">
                <Code className="w-4 h-4 mr-2" />
                Script
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-white">
                <Globe className="w-4 h-4 mr-2" />
                Quick Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="flex-1 m-0 p-4">
              <div className="space-y-4 h-full flex flex-col">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Starting URL
                  </label>
                  <Input
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <label className="text-sm font-medium text-white mb-2 block">
                    Automation Script
                  </label>
                  <Textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="flex-1 bg-slate-900 text-gray-300 font-mono text-sm resize-none border-white/10"
                    placeholder="Write your browser automation script..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="flex-1 m-0 p-4">
              <div className="space-y-4">
                <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10">
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium">Form Filler</h3>
                    <p className="text-gray-400 text-sm">Automatically fill forms with provided data</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10">
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium">Data Scraper</h3>
                    <p className="text-gray-400 text-sm">Extract data from web pages</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10">
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium">Login Assistant</h3>
                    <p className="text-gray-400 text-sm">Automatically log into websites</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="border-b border-white/10 p-2 bg-black/20">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Browser Preview</span>
            </div>
          </div>
          
          <div className="flex-1 bg-white p-4">
            <div className="h-full border border-gray-300 rounded bg-gray-50 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Chrome className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Browser preview will appear here</p>
                <p className="text-sm">Start automation to see live browser interaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
