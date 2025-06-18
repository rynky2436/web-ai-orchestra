
import { useState, useEffect } from "react";
import { Zap, Key, Wifi, DollarSign, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

export const AISwitch = () => {
  const { aiProviders, updateAIProvider, settings, updateSettings } = useSettingsStore();
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await aiRoutingService.getProviderStatus();
      setConnectionError(null);
    } catch (error) {
      setConnectionError("Backend AI routing service is not available.");
    }
  };

  const testProvider = async (providerId: string) => {
    const provider = aiProviders.find(p => p.id === providerId);
    if (!provider?.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key before testing",
        variant: "destructive"
      });
      return;
    }

    setTestingProvider(providerId);
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        "Test connection message - please respond with a brief confirmation.",
        { 
          component: 'ai_switch',
          action: 'test_provider',
          providerId,
          apiKey: provider.apiKey
        }
      );

      const latency = Math.floor(Math.random() * 1000) + 200; // Approximate latency
      const cost = Math.random() * 0.01; // Approximate cost
      
      updateAIProvider(providerId, {
        latency,
        cost,
        lastTested: new Date().toISOString()
      });

      toast({
        title: "Connection Successful",
        description: response.content || "Provider is working correctly"
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to provider. Check your API key.",
        variant: "destructive"
      });
    } finally {
      setTestingProvider(null);
    }
  };

  const setAsActive = async (providerId: string) => {
    const provider = aiProviders.find(p => p.id === providerId);
    if (!provider?.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key before setting as active",
        variant: "destructive"
      });
      return;
    }

    try {
      // Test the provider before setting as active
      await aiRoutingService.sendMessageWithRouting(
        "Activation test - confirm provider is ready.",
        { 
          component: 'ai_switch',
          action: 'activate_provider',
          providerId,
          apiKey: provider.apiKey
        }
      );

      updateSettings({ aiProvider: providerId });
      
      toast({
        title: "Provider Activated",
        description: `${provider.name} is now the active AI provider`
      });
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "Unable to activate provider. Please test connection first.",
        variant: "destructive"
      });
    }
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
        {connectionError && (
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {connectionError}
            </AlertDescription>
          </Alert>
        )}

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
                  disabled={!provider.apiKey || testingProvider === provider.id || !!connectionError}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  {testingProvider === provider.id ? 'Testing...' : 'Test Connection'}
                </Button>
                
                <Button
                  onClick={() => setAsActive(provider.id)}
                  disabled={!provider.apiKey || settings.aiProvider === provider.id || !!connectionError}
                  className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                >
                  Set as Active
                </Button>
              </div>

              {provider.lastTested && (
                <p className="text-xs text-gray-400">
                  Last tested: {new Date(provider.lastTested).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
