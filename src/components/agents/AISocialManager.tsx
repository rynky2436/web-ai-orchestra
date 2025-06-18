
import { useState } from "react";
import { MessageSquare, Users, TrendingUp, Calendar, BarChart3, Image, Hash, Settings, Play, Pause, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const AISocialManager = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [content, setContent] = useState('');
  const [includeAIImage, setIncludeAIImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', status: 'connected', followers: '2.4K' },
    { id: 'instagram', name: 'Instagram', status: 'connected', followers: '5.1K' },
    { id: 'linkedin', name: 'LinkedIn', status: 'disconnected', followers: '890' },
    { id: 'facebook', name: 'Facebook', status: 'connected', followers: '3.2K' },
    { id: 'tiktok', name: 'TikTok', status: 'disconnected', followers: '12K' }
  ];

  const quickActions = [
    { id: 'generate-post', label: 'Generate Post', icon: MessageSquare },
    { id: 'create-image', label: 'Create AI Image', icon: Wand2 },
    { id: 'schedule-content', label: 'Schedule Content', icon: Calendar },
    { id: 'analyze-engagement', label: 'Analyze Engagement', icon: BarChart3 },
    { id: 'find-trending', label: 'Find Trending Topics', icon: TrendingUp },
    { id: 'create-hashtags', label: 'Generate Hashtags', icon: Hash }
  ];

  const handleGenerateWithImage = async () => {
    console.log('Generating post with AI image:', {
      content,
      imagePrompt,
      platform: selectedPlatform
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
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

      <div className="p-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-pink-500/20">Dashboard</TabsTrigger>
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-pink-500/20">Content Creator</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-pink-500/20">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-pink-500/20">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Card key={action.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Connected Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{platform.name}</p>
                        <p className="text-gray-400 text-sm">{platform.followers} followers</p>
                      </div>
                      <Badge className={platform.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {platform.status}
                      </Badge>
                    </div>
                  ))}
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
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
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
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Image Description</label>
                    <Input
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to create for this post..."
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={includeAIImage ? handleGenerateWithImage : undefined}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    {includeAIImage ? (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Content + Image
                      </>
                    ) : (
                      'Generate Content'
                    )}
                  </Button>
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    Schedule Post
                  </Button>
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Social Media Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Configure API keys and permissions for each platform...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
