
import { useState, useEffect } from "react";
import { MessageSquare, Users, TrendingUp, Calendar, Settings, Shield, Brain, Monitor, Globe, Camera, Video, Heart, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIChat } from "@/components/shared/AIChat";
import { toast } from "@/hooks/use-toast";

interface BaseSocialAccount {
  platform: string;
  isConnected: boolean;
}

interface TwitterAccount extends BaseSocialAccount {
  platform: 'twitter';
  username: string;
  password: string;
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

interface InstagramAccount extends BaseSocialAccount {
  platform: 'instagram';
  username: string;
  password: string;
  accessToken: string;
  clientId: string;
  clientSecret: string;
}

interface LinkedInAccount extends BaseSocialAccount {
  platform: 'linkedin';
  email: string;
  password: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
}

interface FacebookAccount extends BaseSocialAccount {
  platform: 'facebook';
  username: string;
  password: string;
  appId: string;
  appSecret: string;
  accessToken: string;
}

interface TikTokAccount extends BaseSocialAccount {
  platform: 'tiktok';
  username: string;
  password: string;
  clientKey: string;
  clientSecret: string;
  accessToken: string;
}

interface YouTubeAccount extends BaseSocialAccount {
  platform: 'youtube';
  email: string;
  password: string;
  apiKey: string;
  clientId: string;
  clientSecret: string;
}

interface RedditAccount extends BaseSocialAccount {
  platform: 'reddit';
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
}

interface PinterestAccount extends BaseSocialAccount {
  platform: 'pinterest';
  email: string;
  password: string;
  appId: string;
  appSecret: string;
  accessToken: string;
}

interface SnapchatAccount extends BaseSocialAccount {
  platform: 'snapchat';
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
}

interface DiscordAccount extends BaseSocialAccount {
  platform: 'discord';
  username: string;
  password: string;
  botToken: string;
  clientId: string;
  guildId: string;
}

interface TelegramAccount extends BaseSocialAccount {
  platform: 'telegram';
  botToken: string;
  chatId: string;
  apiHash: string;
}

interface WhatsAppAccount extends BaseSocialAccount {
  platform: 'whatsapp';
  phoneNumber: string;
  apiKey: string;
  webhookUrl: string;
}

type SocialAccount = TwitterAccount | InstagramAccount | LinkedInAccount | FacebookAccount | 
                   TikTokAccount | YouTubeAccount | RedditAccount | PinterestAccount | 
                   SnapchatAccount | DiscordAccount | TelegramAccount | WhatsAppAccount;

export const AISocialManager = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { platform: 'twitter', isConnected: false, username: '', password: '', apiKey: '', apiSecret: '', accessToken: '', accessTokenSecret: '' },
    { platform: 'instagram', isConnected: false, username: '', password: '', accessToken: '', clientId: '', clientSecret: '' },
    { platform: 'linkedin', isConnected: false, email: '', password: '', clientId: '', clientSecret: '', accessToken: '' },
    { platform: 'facebook', isConnected: false, username: '', password: '', appId: '', appSecret: '', accessToken: '' },
    { platform: 'tiktok', isConnected: false, username: '', password: '', clientKey: '', clientSecret: '', accessToken: '' },
    { platform: 'youtube', isConnected: false, email: '', password: '', apiKey: '', clientId: '', clientSecret: '' },
    { platform: 'reddit', isConnected: false, username: '', password: '', clientId: '', clientSecret: '', accessToken: '' },
    { platform: 'pinterest', isConnected: false, email: '', password: '', appId: '', appSecret: '', accessToken: '' },
    { platform: 'snapchat', isConnected: false, username: '', password: '', clientId: '', clientSecret: '' },
    { platform: 'discord', isConnected: false, username: '', password: '', botToken: '', clientId: '', guildId: '' },
    { platform: 'telegram', isConnected: false, botToken: '', chatId: '', apiHash: '' },
    { platform: 'whatsapp', isConnected: false, phoneNumber: '', apiKey: '', webhookUrl: '' }
  ]);

  const [aiSettings, setAiSettings] = useState({
    autoPost: false,
    contentGeneration: false,
    sentimentAnalysis: false,
    engagement: false,
    scheduling: false
  });

  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleAccountUpdate = (platform: string, field: string, value: string) => {
    setSocialAccounts(prev => prev.map(account => 
      account.platform === platform 
        ? { ...account, [field]: value }
        : account
    ));
  };

  const connectAccount = (platform: string) => {
    const account = socialAccounts.find(acc => acc.platform === platform);
    if (!account) return;

    // Check if account has required credentials
    const hasRequiredCredentials = (() => {
      switch (platform) {
        case 'twitter':
          const twitterAcc = account as TwitterAccount;
          return twitterAcc.username && twitterAcc.password && twitterAcc.apiKey && twitterAcc.apiSecret;
        case 'instagram':
          const instaAcc = account as InstagramAccount;
          return instaAcc.username && instaAcc.password && instaAcc.clientId;
        case 'telegram':
          const telegramAcc = account as TelegramAccount;
          return telegramAcc.botToken && telegramAcc.chatId;
        default:
          return false;
      }
    })();

    if (!hasRequiredCredentials) {
      toast({
        title: "Missing Credentials",
        description: `Please fill in all required fields for ${platform}`,
        variant: "destructive"
      });
      return;
    }

    // Real connection logic would go here
    toast({
      title: "Connection Not Implemented",
      description: `${platform} integration is not yet connected to backend services`,
      variant: "destructive"
    });
  };

  const schedulePost = () => {
    if (!postContent.trim()) {
      toast({
        title: "No Content",
        description: "Please enter content to post",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one platform",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feature Not Available",
      description: "Post scheduling is not yet connected to backend services",
      variant: "destructive"
    });
  };

  const handleAIMessage = (message: string) => {
    toast({
      title: "AI Assistant Not Connected",
      description: "AI chat functionality requires backend integration",
      variant: "destructive"
    });
  };

  const getPlatformDisplayName = (platform: string) => {
    const names: { [key: string]: string } = {
      twitter: "Twitter/X",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      facebook: "Facebook",
      tiktok: "TikTok",
      youtube: "YouTube",
      reddit: "Reddit",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      discord: "Discord",
      telegram: "Telegram",
      whatsapp: "WhatsApp"
    };
    return names[platform] || platform;
  };

  const renderAccountFields = (account: SocialAccount) => {
    const commonFields = (
      <>
        {'username' in account && (
          <div>
            <Label className="text-white text-sm">Username</Label>
            <Input
              value={account.username}
              onChange={(e) => handleAccountUpdate(account.platform, 'username', e.target.value)}
              className="mt-1 bg-white/5 border-white/10 text-white"
              placeholder="Enter username"
            />
          </div>
        )}
        {'email' in account && (
          <div>
            <Label className="text-white text-sm">Email</Label>
            <Input
              value={account.email}
              onChange={(e) => handleAccountUpdate(account.platform, 'email', e.target.value)}
              className="mt-1 bg-white/5 border-white/10 text-white"
              placeholder="Enter email"
            />
          </div>
        )}
        {'password' in account && (
          <div>
            <Label className="text-white text-sm">Password</Label>
            <Input
              type="password"
              value={account.password}
              onChange={(e) => handleAccountUpdate(account.platform, 'password', e.target.value)}
              className="mt-1 bg-white/5 border-white/10 text-white"
              placeholder="Enter password"
            />
          </div>
        )}
      </>
    );

    switch (account.platform) {
      case 'twitter':
        const twitterAcc = account as TwitterAccount;
        return (
          <div className="space-y-4">
            {commonFields}
            <div>
              <Label className="text-white text-sm">API Key</Label>
              <Input
                value={twitterAcc.apiKey}
                onChange={(e) => handleAccountUpdate(account.platform, 'apiKey', e.target.value)}
                className="mt-1 bg-white/5 border-white/10 text-white"
                placeholder="Enter API key"
              />
            </div>
            <div>
              <Label className="text-white text-sm">API Secret</Label>
              <Input
                type="password"
                value={twitterAcc.apiSecret}
                onChange={(e) => handleAccountUpdate(account.platform, 'apiSecret', e.target.value)}
                className="mt-1 bg-white/5 border-white/10 text-white"
                placeholder="Enter API secret"
              />
            </div>
          </div>
        );

      case 'telegram':
        const telegramAcc = account as TelegramAccount;
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white text-sm">Bot Token</Label>
              <Input
                value={telegramAcc.botToken}
                onChange={(e) => handleAccountUpdate(account.platform, 'botToken', e.target.value)}
                className="mt-1 bg-white/5 border-white/10 text-white"
                placeholder="Enter bot token"
              />
            </div>
            <div>
              <Label className="text-white text-sm">Chat ID</Label>
              <Input
                value={telegramAcc.chatId}
                onChange={(e) => handleAccountUpdate(account.platform, 'chatId', e.target.value)}
                className="mt-1 bg-white/5 border-white/10 text-white"
                placeholder="Enter chat ID"
              />
            </div>
          </div>
        );

      default:
        return commonFields;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">AI Social Media Manager</h2>
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                Multi-Platform
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
              <TabsTrigger value="accounts" className="text-white data-[state=active]:bg-blue-500/20">Accounts</TabsTrigger>
              <TabsTrigger value="compose" className="text-white data-[state=active]:bg-blue-500/20">Compose</TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500/20">Analytics</TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-500/20">AI Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialAccounts.map((account) => (
                  <Card key={account.platform} className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">
                          {getPlatformDisplayName(account.platform)}
                        </CardTitle>
                        <Badge 
                          variant={account.isConnected ? "default" : "outline"}
                          className={account.isConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                        >
                          {account.isConnected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {renderAccountFields(account)}
                      <Button
                        onClick={() => connectAccount(account.platform)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={account.isConnected}
                      >
                        {account.isConnected ? "Connected" : "Connect Account"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compose" className="mt-6 space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Create Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">Content</Label>
                    <Textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="mt-1 bg-white/5 border-white/10 text-white min-h-[120px]"
                      placeholder="What's on your mind?"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm">Select Platforms</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {socialAccounts.slice(0, 6).map((account) => (
                        <div key={account.platform} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={account.platform}
                            checked={selectedPlatforms.includes(account.platform)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPlatforms(prev => [...prev, account.platform]);
                              } else {
                                setSelectedPlatforms(prev => prev.filter(p => p !== account.platform));
                              }
                            }}
                            className="rounded"
                            disabled={!account.isConnected}
                          />
                          <Label htmlFor={account.platform} className="text-white text-sm">
                            {getPlatformDisplayName(account.platform)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={schedulePost}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                      disabled={!postContent.trim() || selectedPlatforms.length === 0}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Post
                    </Button>
                    <Button
                      onClick={schedulePost}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      disabled={!postContent.trim() || selectedPlatforms.length === 0}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Post Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                    <p className="text-gray-400">Analytics features require connected accounts and backend integration</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto-posting</Label>
                        <p className="text-sm text-gray-400">Enable AI to automatically create and schedule posts</p>
                      </div>
                      <Switch 
                        checked={aiSettings.autoPost} 
                        onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, autoPost: checked }))}
                        disabled={true}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Content Generation</Label>
                        <p className="text-sm text-gray-400">AI-powered content creation</p>
                      </div>
                      <Switch 
                        checked={aiSettings.contentGeneration} 
                        onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, contentGeneration: checked }))}
                        disabled={true}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Sentiment Analysis</Label>
                        <p className="text-sm text-gray-400">Monitor brand sentiment across platforms</p>
                      </div>
                      <Switch 
                        checked={aiSettings.sentimentAnalysis} 
                        onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, sentimentAnalysis: checked }))}
                        disabled={true}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ AI features require backend integration and API connections to function
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Chat Sidebar */}
      <div className="w-96 border-l border-white/10">
        <AIChat
          title="Social Media AI"
          placeholder="Social media AI assistant is not yet connected..."
          initialMessage="Hello! I'm your social media AI assistant. Currently, I'm not connected to backend services, so I can't provide real responses yet."
          onSendMessage={handleAIMessage}
          className="h-full"
          disabled={true}
        />
      </div>
    </div>
  );
};
