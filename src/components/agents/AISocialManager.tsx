
import { useState } from "react";
import { Play, Save, FileCode, Terminal, Brain, Settings, Monitor, Shield, Cloud, Download, Upload, Users, ListChecks, BarChartBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIChat } from "@/components/shared/AIChat";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const AISocialManager = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messages, setMessages] = useState<Message[]>([]);
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Twitter", username: "@NexusAI", followers: 12000, status: "active" },
    { id: 2, name: "Facebook", username: "NexusAI", followers: 25000, status: "active" },
    { id: 3, name: "Instagram", username: "@nexusai", followers: 18000, status: "inactive" }
  ]);
  const [posts, setPosts] = useState([
    { id: 1, date: "2024-05-03", content: "Exciting news about our latest AI advancements!", likes: 320, shares: 150 },
    { id: 2, date: "2024-05-02", content: "Check out our new blog post on AI ethics.", likes: 250, shares: 90 },
    { id: 3, date: "2024-05-01", content: "Join us for a live webinar on AI in healthcare.", likes: 450, shares: 200 }
  ]);

  const handleSendMessage = (message: string) => {
    // No fake responses - just indicate backend connection needed
    console.log('Social media AI message sent:', message);
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
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                Backend Integration Required
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/50" disabled>
                <Brain className="w-4 h-4 mr-2" />
                AI Analyze (Not Connected)
              </Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/50" disabled>
                <Save className="w-4 h-4 mr-2" />
                Save (Not Connected)
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
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
                  <p className="text-white/80 mb-4">Social media management dashboard requires backend integration to display real data.</p>
                  <ListChecks className="w-12 h-12 text-gray-500 mx-auto my-4" />
                  <p className="text-center text-gray-400">Backend service integration required</p>
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
                  <p className="text-white/80 mb-4">Connect your social media accounts for AI-powered management.</p>
                  <div className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled>
                      <Users className="w-4 h-4 mr-2" />
                      Connect Twitter (OAuth Required)
                    </Button>
                    <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white" disabled>
                      <Users className="w-4 h-4 mr-2" />
                      Connect Facebook (OAuth Required)
                    </Button>
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white" disabled>
                      <Users className="w-4 h-4 mr-2" />
                      Connect Instagram (OAuth Required)
                    </Button>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white" disabled>
                      <Users className="w-4 h-4 mr-2" />
                      Connect YouTube (OAuth Required)
                    </Button>
                    <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white" disabled>
                      <Users className="w-4 h-4 mr-2" />
                      Connect LinkedIn (OAuth Required)
                    </Button>
                    <Button className="w-full bg-black hover:bg-gray-900 text-white" disabled>
                      <Users className="w-4 h-4 mr-2" />
                      Connect TikTok (OAuth Required)
                    </Button>
                  </div>
                  <p className="text-center text-gray-400 mt-4 text-sm">OAuth integration and backend services required for account connections</p>
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
                  <p className="text-white/80 mb-4">AI-powered content creation and scheduling requires backend integration.</p>
                  <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white/50 mb-4" disabled>
                    Create AI-Generated Post (Backend Required)
                  </Button>
                  <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white/50" disabled>
                    Schedule Posts (Backend Required)
                  </Button>
                  <p className="text-center text-gray-400 mt-4 text-sm">Content management features require API integration</p>
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
                  <p className="text-white/80 mb-4">AI-powered analytics and performance insights require connected accounts.</p>
                  <BarChartBig className="w-12 h-12 text-gray-500 mx-auto my-4" />
                  <p className="text-center text-gray-400">Analytics integration in progress</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Chat Panel */}
      <div className="w-96">
        <AIChat
          title="Social Media AI"
          placeholder="Backend AI integration required"
          initialMessage="Social media AI assistant requires backend integration. Please configure social media API connections and AI services."
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
