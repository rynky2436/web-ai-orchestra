
import { useState } from "react";
import { Puzzle, Plus, Download, Settings, Code, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  type: 'javascript' | 'python';
  category: string;
}

export const PluginSystem = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: 'file-renamer',
      name: 'Batch File Renamer',
      description: 'Rename multiple files using patterns and rules',
      version: '1.0.0',
      enabled: true,
      type: 'javascript',
      category: 'file-management'
    },
    {
      id: 'text-analyzer',
      name: 'Text Analyzer',
      description: 'Analyze text for sentiment, keywords, and readability',
      version: '1.2.0',
      enabled: true,
      type: 'python',
      category: 'text-processing'
    },
    {
      id: 'image-converter',
      name: 'Image Converter',
      description: 'Convert images between different formats',
      version: '2.1.0',
      enabled: false,
      type: 'python',
      category: 'media'
    }
  ]);

  const togglePlugin = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin =>
      plugin.id === pluginId ? { ...plugin, enabled: !plugin.enabled } : plugin
    ));
  };

  const removePlugin = (pluginId: string) => {
    setPlugins(prev => prev.filter(plugin => plugin.id !== pluginId));
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Puzzle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Plugin System</h2>
            <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
              {plugins.filter(p => p.enabled).length} Active
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Browse Store
            </Button>
            <Button className="bg-violet-500 hover:bg-violet-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Install Plugin
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Plugin Installation */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Install New Plugin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Plugin URL or drag & drop .ts/.py file"
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Install
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              Supports TypeScript (.ts) and Python (.py) plugin files
            </div>
          </CardContent>
        </Card>

        {/* Installed Plugins */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Installed Plugins</h3>
          
          {plugins.map((plugin) => (
            <Card key={plugin.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Code className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-white font-medium">{plugin.name}</div>
                        <div className="text-sm text-gray-400">{plugin.description}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-white/20 text-gray-300">
                        v{plugin.version}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`border-${plugin.type === 'python' ? 'blue' : 'yellow'}-500/30 text-${plugin.type === 'python' ? 'blue' : 'yellow'}-400`}
                      >
                        {plugin.type}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-gray-300 capitalize">
                        {plugin.category}
                      </Badge>
                    </div>
                    
                    <Switch
                      checked={plugin.enabled}
                      onCheckedChange={() => togglePlugin(plugin.id)}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlugin(plugin.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
