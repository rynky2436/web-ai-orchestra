
import { useState, useEffect } from "react";
import { Users, ListChecks, BarChartBig, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/shared/ChatInterface";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const PRE_PROMPT = "You are a social media AI assistant. Your job is to manage, draft, schedule, and post content across platforms. Ask for connected accounts, brand tone, and posting goals.";

export const AISocialManager = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messages, setMessages] = useState<Message[]>([]);
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
        setConnectionError("No AI providers connected. Social media features are unavailable.");
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError("Backend services are not available.");
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Social media AI requires backend connection",
        variant: "destructive"
      });
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\n${message}`,
        { 
          component: 'ai_social_manager',
          activeTab
        }
      );
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.content || "No response received from AI backend"
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Error: Unable to process request. Backend service unavailable."
      }]);
    }
  };

  const connectSocialAccount = async (platform: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Account connection requires backend services",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nInitiate OAuth connection for ${platform} social media account.`,
        { 
          component: 'ai_social_manager',
          action: 'connect_account',
          platform
        }
      );

      toast({
        title: "Connection Initiated",
        description: response.content || `Starting ${platform} OAuth flow`
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect account. Backend service unavailable.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">AI Social Manager</h2>
              <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {connectionError && (
            <Alert className="border-red-500/30 bg-red-500/10 m-4">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {connectionError}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10 mx-4 mt-4">
              <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-blue-500/20">Dashboard</TabsTrigger>
              <TabsTrigger value="accounts" className="text-white data-[state=active]:bg-blue-500/20">Accounts</TabsTrigger>
              <TabsTrigger value="posts" className="text-white data-[state=active]:bg-blue-500/20">Posts</TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500/20">Analytics</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="flex-1 p-4 overflow-y-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Dashboard Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">
                    {isConnected 
                      ? "Social media management dashboard ready. Connect your accounts to get started."
                      : "Social media management requires backend integration to display real data."
                    }
                  </p>
                  <ListChecks className="w-12 h-12 text-gray-500 mx-auto my-4" />
                  <p className="text-center text-gray-400">
                    {isConnected ? "Connect your social accounts to view dashboard" : "Backend service integration required"}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accounts Tab */}
            <TabsContent value="accounts" className="flex-1 p-4 overflow-y-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Social Media Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">
                    {isConnected 
                      ? "Connect your social media accounts for AI-powered management."
                      : "Backend integration required for account connections."
                    }
                  </p>
                  <div className="space-y-3">
                    {['Twitter', 'Facebook', 'Instagram', 'YouTube', 'LinkedIn', 'TikTok'].map((platform) => (
                      <Button 
                        key={platform}
                        onClick={() => connectSocialAccount(platform)}
                        disabled={!isConnected}
                        className={`w-full ${
                          platform === 'Twitter' ? 'bg-blue-600 hover:bg-blue-700' :
                          platform === 'Facebook' ? 'bg-blue-800 hover:bg-blue-900' :
                          platform === 'Instagram' ? 'bg-pink-600 hover:bg-pink-700' :
                          platform === 'YouTube' ? 'bg-red-600 hover:bg-red-700' :
                          platform === 'LinkedIn' ? 'bg-blue-700 hover:bg-blue-800' :
                          'bg-black hover:bg-gray-900'
                        } text-white disabled:opacity-50`}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Connect {platform} {!isConnected && '(Backend Required)'}
                      </Button>
                    ))}
                  </div>
                  {!isConnected && (
                    <p className="text-center text-gray-400 mt-4 text-sm">
                      OAuth integration and backend services required for account connections
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="flex-1 p-4 overflow-y-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">
                    {isConnected 
                      ? "AI-powered content creation and scheduling ready."
                      : "AI-powered content creation and scheduling requires backend integration."
                    }
                  </p>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      disabled={!isConnected}
                      className="w-full bg-white/5 border-white/10 text-white/50 disabled:opacity-50"
                    >
                      Create AI-Generated Post {!isConnected && '(Backend Required)'}
                    </Button>
                    <Button 
                      variant="outline" 
                      disabled={!isConnected}
                      className="w-full bg-white/5 border-white/10 text-white/50 disabled:opacity-50"
                    >
                      Schedule Posts {!isConnected && '(Backend Required)'}
                    </Button>
                  </div>
                  {!isConnected && (
                    <p className="text-center text-gray-400 mt-4 text-sm">
                      Content management features require API integration
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="flex-1 p-4 overflow-y-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Analytics & Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">
                    {isConnected 
                      ? "AI-powered analytics ready. Connect accounts to view insights."
                      : "AI-powered analytics and performance insights require connected accounts."
                    }
                  </p>
                  <BarChartBig className="w-12 h-12 text-gray-500 mx-auto my-4" />
                  <p className="text-center text-gray-400">
                    {isConnected ? "Connect accounts to view analytics" : "Analytics integration in progress"}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Chat Panel */}
      <div className="w-96">
        <ChatInterface
          title="Social Media AI"
          placeholder={isConnected ? "Ask about social media management..." : "Connect AI service to enable chat"}
          messages={messages}
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
