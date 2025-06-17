
import { useState } from "react";
import { Zap, Key, Wifi, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/stores/settingsStore";

export const AISwitch = () => {
  const { aiProviders, updateAIProvider, settings, updateSettings } = useSettingsStore();
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  const testProvider = async (providerId: string) => {
    setTestingProvider(providerId);
    
    // Simulate API test
    setTimeout(() => {
      const randomLatency = Math.floor(Math.random() * 1000) + 200;
      const randomCost = Math.random() * 0.01;
      
      updateAIProvider(providerId, {
        latency: randomLatency,
        cost: randomCost
      });
      
      setTestingProvider(null);
    }, 2000);
  };

  const setAsActive = (providerId: string) => {
    updateSettings({ aiProvider: providerId });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">AI Provider Switch</h2>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Active: {aiProviders.find(p => p.id === settings.aiProvider)?.name || 'None'}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {aiProviders.map((provider) => (
          <Card 
            key={provider.id}
            className={`border transition-all duration-200 ${
              settings.aiProvider === provider.id 
                ? 'bg-blue-500/20 border-blue-500/30' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>{provider.name}</span>
                  {settings.aiProvider === provider.id && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Active
                    </Badge>
                  )}
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  {provider.latency && (
                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {provider.latency}ms
                    </Badge>
                  )}
                  {provider.cost && (
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                      <DollarSign className="w-3 h-3 mr-1" />
                      ${provider.cost.toFixed(4)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder={`${provider.name} API Key`}
                  value={provider.apiKey || ''}
                  onChange={(e) => updateAIProvider(provider.id, { apiKey: e.target.value })}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.models.map((model) => (
                  <Badge key={model} variant="outline" className="border-white/20 text-gray-300">
                    {model}
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testProvider(provider.id)}
                  disabled={!provider.apiKey || testingProvider === provider.id}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  {testingProvider === provider.id ? 'Testing...' : 'Test Connection'}
                </Button>
                
                <Button
                  onClick={() => setAsActive(provider.id)}
                  disabled={!provider.apiKey || settings.aiProvider === provider.id}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Set as Active
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
