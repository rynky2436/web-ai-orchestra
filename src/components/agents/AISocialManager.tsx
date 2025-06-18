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
import { ChatInterface, AIChat } from "@/components/shared/ChatInterface";
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
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "AI assistant is not yet connected to backend services. Social media assistance features require proper integration to function." 
      }]);
    }, 1000);
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
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Connected
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Brain className="w-3 h-3 mr-1" />
                AI (Not Connected)
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10" disabled>
                <Brain className="w-4 h-4 mr-2" />
                AI Analyze
              </Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10" disabled>
                <Save className="w-4 h-4 mr-2" />
                Save
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
                  <p className="text-white/80">View a summary of your social media performance.</p>
                  <ListChecks className="w-12 h-12 text-green-500 mx-auto my-4" />
                  <p className="text-center text-gray-400">Connect accounts to view detailed analytics</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accounts Tab */}
            <TabsContent value="accounts" className="flex-1 p-4 overflow-y-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {accounts.map(account => (
                      <li key={account.id} className="flex items-center justify-between p-2 rounded-md bg-black/20">
                        <div className="flex items-center space-x-3">
                          <span className="text-white">{account.name}</span>
                          <span className="text-gray-400">{account.username}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{account.followers} Followers</Badge>
                          <Badge className={account.status === 'active' ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                            {account.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4 bg-white/5 border-white/10 text-white hover:bg-white/10">
                    Connect New Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="flex-1 p-4 overflow-y-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {posts.map(post => (
                      <li key={post.id} className="p-4 rounded-md bg-black/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white">{post.date}</span>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Scheduled</Badge>
                        </div>
                        <p className="text-gray-400">{post.content}</p>
                        <div className="flex items-center justify-end mt-3 space-x-4">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/10">
                            <FileCode className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
                            <Terminal className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4 bg-white/5 border-white/10 text-white hover:bg-white/10">
                    Create New Post
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="flex-1 p-4 overflow-y-auto">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">Track your social media performance and engagement.</p>
                  <BarChartBig className="w-12 h-12 text-purple-500 mx-auto my-4" />
                  <p className="text-center text-gray-400">Detailed analytics require connected accounts</p>
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
          placeholder="Backend AI integration required for functionality"
          initialMessage="Social media AI assistant requires backend integration to function. Please configure API connections in settings."
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
