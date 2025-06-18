
import { useState } from "react";
import { MessageSquare, Users, TrendingUp, Calendar, BarChart3, Image, Hash, Settings, Play, Pause, Upload, Wand2, Key, Monitor, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AIChat } from "@/components/shared/AIChat";
import { toast } from "@/hooks/use-toast";

export const AISocialManager = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [content, setContent] = useState('');
  const [includeAIImage, setIncludeAIImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [aiMonitoring, setAiMonitoring] = useState(true);
  const [autoResponse, setAutoResponse] = useState(false);

  const [platformCredentials, setPlatformCredentials] = useState({
    twitter: { username: '', password: '', apiKey: '', apiSecret: '', accessToken: '', accessTokenSecret: '' },
    instagram: { username: '', password: '', accessToken: '', clientId: '', clientSecret: '' },
    facebook: { username: '', password: '', pageId: '', accessToken: '', appId: '', appSecret: '' },
    linkedin: { username: '', password: '', clientId: '', clientSecret: '', accessToken: '' },
    tiktok: { username: '', password: '', accessToken: '', clientKey: '', clientSecret: '' },
    youtube: { username: '', password: '', apiKey: '', channelId: '', clientId: '', clientSecret: '' },
    snapchat: { username: '', password: '', clientId: '', clientSecret: '', accessToken: '' },
    pinterest: { username: '', password: '', accessToken: '', appId: '', appSecret: '' },
    discord: { username: '', password: '', botToken: '', clientId: '', clientSecret: '' },
    telegram: { botToken: '', chatId: '', apiHash: '' },
    reddit: { username: '', password: '', clientId: '', clientSecret: '', userAgent: '' },
    whatsapp: { phoneNumber: '', accessToken: '', webhookToken: '' }
  });

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', status: 'connected', followers: '2.4K', color: 'bg-blue-500' },
    { id: 'instagram', name: 'Instagram', status: 'connected', followers: '5.1K', color: 'bg-pink-500' },
    { id: 'facebook', name: 'Facebook', status: 'disconnected', followers: '3.2K', color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', status: 'disconnected', followers: '890', color: 'bg-blue-700' },
    { id: 'tiktok', name: 'TikTok', status: 'disconnected', followers: '12K', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', status: 'connected', followers: '8.3K', color: 'bg-red-500' },
    { id: 'snapchat', name: 'Snapchat', status: 'disconnected', followers: '1.2K', color: 'bg-yellow-400' },
    { id: 'pinterest', name: 'Pinterest', status: 'disconnected', followers: '923', color: 'bg-red-600' },
    { id: 'discord', name: 'Discord', status: 'connected', followers: '456', color: 'bg-indigo-500' },
    { id: 'telegram', name: 'Telegram', status: 'disconnected', followers: '789', color: 'bg-blue-400' },
    { id: 'reddit', name: 'Reddit', status: 'disconnected', followers: '2.1K', color: 'bg-orange-500' },
    { id: 'whatsapp', name: 'WhatsApp Business', status: 'disconnected', followers: 'N/A', color: 'bg-green-500' }
  ];

  const handleCredentialUpdate = (platform: string, field: string, value: string) => {
    setPlatformCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const testConnection = async (platform: string) => {
    toast({
      title: "Testing Connection",
      description: `Connecting to ${platform}...`
    });
    
    // Simulate API connection test
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${platform}`
      });
    }, 2000);
  };

  const generateAIContent = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please describe what content you want to create",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "AI Generating Content",
      description: "Creating engaging content based on your input..."
    });

    // Simulate AI content generation
    setTimeout(() => {
      const generatedContent = `🚀 Exciting news! ${content} 

#AI #Innovation #Technology #SocialMedia

What do you think? Let me know in the comments! 👇`;
      
      setContent(generatedContent);
      toast({
        title: "Content Generated",
        description: "AI has created optimized content for your post"
      });
    }, 3000);
  };

  const handleAIMessage = (message: string) => {
    console.log('Social Media AI received:', message);
    
    // AI logic for social media management
    if (message.toLowerCase().includes('create post')) {
      generateAIContent();
    } else if (message.toLowerCase().includes('schedule')) {
      toast({
        title: "AI Scheduling",
        description: "Analyzing optimal posting times for your content..."
      });
    } else if (message.toLowerCase().includes('analyze')) {
      toast({
        title: "AI Analysis",
        description: "Performing engagement analysis across all platforms..."
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Social Media Manager</h2>
            <Badge className={`${isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {isActive ? 'Active' : 'Standby'}
            </Badge>
            {aiMonitoring && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Monitor className="w-3 h-3 mr-1" />
                AI Monitoring
              </Badge>
            )}
          </div>
          <Button
            onClick={() => setIsActive(!isActive)}
            className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isActive ? 'Pause' : 'Activate'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/5 border-white/10">
              <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-pink-500/20">Dashboard</TabsTrigger>
              <TabsTrigger value="content" className="text-white data-[state=active]:bg-pink-500/20">Content Creator</TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-pink-500/20">Analytics</TabsTrigger>
              <TabsTrigger value="platforms" className="text-white data-[state=active]:bg-pink-500/20">Platforms</TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-pink-500/20">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.slice(0, 6).map((platform) => (
                  <Card key={platform.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                        <Badge className={platform.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {platform.status === 'connected' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                          {platform.status}
                        </Badge>
                      </div>
                      <h3 className="text-white font-medium">{platform.name}</h3>
                      <p className="text-gray-400 text-sm">{platform.followers} followers</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Monitoring Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      <Label className="text-white">Enable AI Monitoring</Label>
                    </div>
                    <Switch checked={aiMonitoring} onCheckedChange={setAiMonitoring} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      <Label className="text-white">Auto-respond to Mentions</Label>
                    </div>
                    <Switch checked={autoResponse} onCheckedChange={setAutoResponse} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6 space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Content Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Platforms</SelectItem>
                      {platforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id}>{platform.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe what you want to post about, or let AI generate trending content..."
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-32"
                  />

                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch checked={includeAIImage} onCheckedChange={setIncludeAIImage} />
                      <span className="text-white text-sm">Include AI-Generated Image</span>
                    </div>
                    <Wand2 className="w-4 h-4 text-purple-400" />
                  </div>

                  {includeAIImage && (
                    <Input
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to create..."
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  )}
                  
                  <div className="flex space-x-2">
                    <Button onClick={generateAIContent} className="bg-pink-500 hover:bg-pink-600 text-white">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate AI Content
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                      Schedule Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="mt-6 space-y-6">
              <div className="grid gap-6">
                {platforms.map((platform) => (
                  <Card key={platform.id} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${platform.color}`}></div>
                          <CardTitle className="text-white">{platform.name}</CardTitle>
                          <Badge className={platform.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {platform.status}
                          </Badge>
                        </div>
                        <Button size="sm" onClick={() => testConnection(platform.name)} className="bg-blue-500 hover:bg-blue-600 text-white">
                          Test Connection
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white text-sm">Username/Email</Label>
                          <Input
                            value={platformCredentials[platform.id as keyof typeof platformCredentials]?.username || ''}
                            onChange={(e) => handleCredentialUpdate(platform.id, 'username', e.target.value)}
                            placeholder={`${platform.name} username or email`}
                            className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-sm">Password</Label>
                          <Input
                            type="password"
                            value={platformCredentials[platform.id as keyof typeof platformCredentials]?.password || ''}
                            onChange={(e) => handleCredentialUpdate(platform.id, 'password', e.target.value)}
                            placeholder="Password"
                            className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                        {platform.id === 'twitter' && (
                          <>
                            <div>
                              <Label className="text-white text-sm">API Key</Label>
                              <Input
                                value={platformCredentials.twitter.apiKey}
                                onChange={(e) => handleCredentialUpdate('twitter', 'apiKey', e.target.value)}
                                placeholder="Twitter API Key"
                                className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <Label className="text-white text-sm">API Secret</Label>
                              <Input
                                type="password"
                                value={platformCredentials.twitter.apiSecret}
                                onChange={(e) => handleCredentialUpdate('twitter', 'apiSecret', e.target.value)}
                                placeholder="API Secret"
                                className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                              />
                            </div>
                          </>
                        )}
                        {platform.id === 'instagram' && (
                          <>
                            <div>
                              <Label className="text-white text-sm">Access Token</Label>
                              <Input
                                value={platformCredentials.instagram.accessToken}
                                onChange={(e) => handleCredentialUpdate('instagram', 'accessToken', e.target.value)}
                                placeholder="Instagram Access Token"
                                className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <Label className="text-white text-sm">Client ID</Label>
                              <Input
                                value={platformCredentials.instagram.clientId}
                                onChange={(e) => handleCredentialUpdate('instagram', 'clientId', e.target.value)}
                                placeholder="Client ID"
                                className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Social Media Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">24.8K</div>
                      <div className="text-sm text-gray-400">Total Followers</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">89.2%</div>
                      <div className="text-sm text-gray-400">Engagement Rate</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">156</div>
                      <div className="text-sm text-gray-400">Posts This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6 space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Enable AI Content Generation</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto-schedule Optimal Times</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">AI Hashtag Suggestions</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Smart Engagement Monitoring</Label>
                    <Switch checked={aiMonitoring} onCheckedChange={setAiMonitoring} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">API Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">OpenAI API Key</Label>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      className="mt-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Content Generation Model</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Chat Interface */}
        <div className="w-96 border-l border-white/10">
          <AIChat
            title="Social Media AI"
            placeholder="Ask me to create posts, schedule content, analyze trends..."
            initialMessage="Hello! I'm your AI social media manager. I can help you create engaging content, schedule posts, analyze performance, and manage your social media presence across all platforms. What would you like me to do?"
            onSendMessage={handleAIMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
