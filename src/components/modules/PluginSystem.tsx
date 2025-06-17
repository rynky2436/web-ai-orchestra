
import { useState } from "react";
import { Puzzle, Plus, Download, Settings, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const PluginSystem = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const plugins = [
    {
      id: 'file-renamer',
      name: 'File Renamer',
      description: 'Batch rename files with patterns and rules',
      status: 'installed',
      category: 'utility'
    },
    {
      id: 'text-analyzer',
      name: 'Text Analyzer',
      description: 'Analyze text for sentiment, readability, and more',
      status: 'available',
      category: 'analysis'
    },
    {
      id: 'image-converter',
      name: 'Image Converter',
      description: 'Convert images between different formats',
      status: 'installed',
      category: 'media'
    },
    {
      id: 'calculator',
      name: 'Advanced Calculator',
      description: 'Scientific calculator with programming functions',
      status: 'available',
      category: 'utility'
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Puzzle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Plugin System</h2>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              4 Available
            </Badge>
          </div>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Plugin
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex space-x-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
          <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Browse Store
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plugins.map((plugin) => (
            <Card key={plugin.id} className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm">{plugin.name}</CardTitle>
                  <Badge
                    className={
                      plugin.status === 'installed'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }
                  >
                    {plugin.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-xs">{plugin.description}</p>
                <div className="flex space-x-2">
                  {plugin.status === 'installed' ? (
                    <>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Code className="w-3 h-3 mr-1" />
                        Run
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <Settings className="w-3 h-3 mr-1" />
                        Config
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Download className="w-3 h-3 mr-1" />
                      Install
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
