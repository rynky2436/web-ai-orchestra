
import { useState, useEffect } from "react";
import { Puzzle, Plus, Download, Settings, Code, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

export const PluginSystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [plugins, setPlugins] = useState<any[]>([]);

  useEffect(() => {
    checkBackendConnection();
    loadPlugins();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const providers = await aiRoutingService.getProviderStatus();
      const hasConnectedProvider = providers.some(p => p.connected);
      setIsConnected(hasConnectedProvider);
      
      if (!hasConnectedProvider) {
        setConnectionError("No AI providers connected. Plugin features are unavailable.");
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError("Backend services are not available.");
    }
  };

  const loadPlugins = async () => {
    if (!isConnected) return;

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        "List available plugins and their installation status.",
        { 
          component: 'plugin_system',
          action: 'list_plugins'
        }
      );

      if (response.plugins && Array.isArray(response.plugins)) {
        setPlugins(response.plugins);
      } else {
        // Fallback local plugin list
        setPlugins([
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
        ]);
      }
    } catch (error) {
      console.error('Failed to load plugins:', error);
    }
  };

  const installPlugin = async (pluginId: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Plugin installation requires backend connection",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `Install plugin: ${pluginId}`,
        { 
          component: 'plugin_system',
          action: 'install_plugin',
          pluginId
        }
      );

      toast({
        title: "Plugin Installed",
        description: response.content || `${pluginId} installed successfully`
      });

      // Update plugin status
      setPlugins(prev => prev.map(p => 
        p.id === pluginId ? {...p, status: 'installed'} : p
      ));
    } catch (error) {
      toast({
        title: "Installation Failed",
        description: "Unable to install plugin. Backend service unavailable.",
        variant: "destructive"
      });
    }
  };

  const runPlugin = async (pluginId: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Plugin execution requires backend connection",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `Execute plugin: ${pluginId}`,
        { 
          component: 'plugin_system',
          action: 'run_plugin',
          pluginId
        }
      );

      toast({
        title: "Plugin Executed",
        description: response.content || `${pluginId} executed successfully`
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Unable to run plugin. Backend service unavailable.",
        variant: "destructive"
      });
    }
  };

  const configurePlugin = async (pluginId: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Plugin configuration requires backend connection",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `Configure plugin settings for: ${pluginId}`,
        { 
          component: 'plugin_system',
          action: 'configure_plugin',
          pluginId
        }
      );

      toast({
        title: "Configuration Updated",
        description: response.content || `${pluginId} configuration updated`
      });
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Unable to configure plugin. Backend service unavailable.",
        variant: "destructive"
      });
    }
  };

  const addPlugin = async () => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Adding plugins requires backend connection",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        "Browse and add new plugins from the plugin store.",
        { 
          component: 'plugin_system',
          action: 'browse_store'
        }
      );

      toast({
        title: "Plugin Store",
        description: response.content || "Opening plugin store..."
      });
    } catch (error) {
      toast({
        title: "Store Unavailable",
        description: "Unable to access plugin store. Backend service unavailable.",
        variant: "destructive"
      });
    }
  };

  const filteredPlugins = plugins.filter(plugin =>
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Puzzle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Plugin System</h2>
            <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
              {isConnected ? `${plugins.length} Available` : "Disconnected"}
            </Badge>
          </div>
          <Button 
            onClick={addPlugin}
            disabled={!isConnected}
            className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Plugin
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {connectionError && (
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {connectionError}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
          <Button 
            variant="outline" 
            onClick={() => window.open('https://plugin-store.example.com', '_blank')}
            disabled={!isConnected}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Browse Store
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlugins.length === 0 ? (
            <Card className="bg-white/5 border-white/10 col-span-full">
              <CardContent className="p-8 text-center">
                <Puzzle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">
                  {isConnected ? "No plugins found matching your search." : "Connect AI services to load available plugins."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPlugins.map((plugin) => (
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
                        <Button 
                          size="sm" 
                          onClick={() => runPlugin(plugin.id)}
                          disabled={!isConnected}
                          className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                        >
                          <Code className="w-3 h-3 mr-1" />
                          Run
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => configurePlugin(plugin.id)}
                          disabled={!isConnected}
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Config
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => installPlugin(plugin.id)}
                        disabled={!isConnected}
                        className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Install
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
