import { useState } from "react";
import { Image, Wand2, Download, Share2, Copy, Palette, Sparkles, Settings, Play, Pause, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AIChat } from "@/components/shared/AIChat";

export const AIImageCreator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('stable-diffusion-xl');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [steps, setSteps] = useState([20]);
  const [guidance, setGuidance] = useState([7.5]);
  const [autoPostToSocial, setAutoPostToSocial] = useState(false);

  const models = [
    { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', description: 'High-quality, versatile' },
    { id: 'midjourney-style', name: 'Midjourney Style', description: 'Artistic, creative' },
    { id: 'realistic-vision', name: 'Realistic Vision', description: 'Photo-realistic results' },
    { id: 'anime-diffusion', name: 'Anime Diffusion', description: 'Anime/manga style' },
    { id: 'dalle-3', name: 'DALL-E 3', description: 'OpenAI\'s latest model' }
  ];

  const styles = [
    'Photorealistic', 'Digital Art', 'Oil Painting', 'Watercolor', 'Anime', 'Cartoon',
    'Cyberpunk', 'Fantasy', 'Sci-Fi', 'Vintage', 'Minimalist', 'Abstract'
  ];

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Landscape (16:9)' },
    { value: '9:16', label: 'Portrait (9:16)' },
    { value: '4:3', label: 'Standard (4:3)' },
    { value: '3:2', label: 'Photo (3:2)' }
  ];

  const generatedImages = [
    {
      id: '1',
      url: '/api/placeholder/400/400',
      prompt: 'Futuristic cyberpunk cityscape at night',
      model: 'Stable Diffusion XL',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      url: '/api/placeholder/400/400',
      prompt: 'Beautiful mountain landscape with aurora',
      model: 'Realistic Vision',
      timestamp: '5 minutes ago'
    },
    {
      id: '3',
      url: '/api/placeholder/400/400',
      prompt: 'Abstract geometric art with vibrant colors',
      model: 'Digital Art',
      timestamp: '10 minutes ago'
    }
  ];

  const promptSuggestions = [
    'A serene mountain lake at sunset with perfect reflections',
    'Futuristic robot in a cyberpunk city with neon lights',
    'Abstract geometric patterns with vibrant rainbow colors',
    'Mystical forest with glowing mushrooms and fairy lights',
    'Vintage steampunk airship floating through cloudy skies',
    'Minimalist product photography of a luxury watch'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      console.log('Generated image with:', {
        prompt,
        model: selectedModel,
        style: selectedStyle,
        aspectRatio,
        steps: steps[0],
        guidance: guidance[0]
      });
    }, 3000);
  };

  const handlePostToSocial = (imageId: string) => {
    console.log('Posting image to social media:', imageId);
    // This would integrate with the AI Social Manager
  };

  const handleAIMessage = (message: string) => {
    console.log('Image Creator AI received:', message);
    // Handle AI image creation requests
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Image Creator</h2>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Multi-Model
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Auto-post to Social:</span>
            <Switch checked={autoPostToSocial} onCheckedChange={setAutoPostToSocial} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
              <TabsTrigger value="create" className="text-white data-[state=active]:bg-purple-500/20">Create</TabsTrigger>
              <TabsTrigger value="gallery" className="text-white data-[state=active]:bg-purple-500/20">Gallery</TabsTrigger>
              <TabsTrigger value="templates" className="text-white data-[state=active]:bg-purple-500/20">Templates</TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-purple-500/20">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Wand2 className="w-5 h-5 mr-2" />
                        Image Generation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
                        <Textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe the image you want to create..."
                          className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-24"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                          <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              {models.map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  <div>
                                    <div className="font-medium">{model.name}</div>
                                    <div className="text-xs text-gray-400">{model.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              {styles.map((style) => (
                                <SelectItem key={style.toLowerCase()} value={style.toLowerCase()}>
                                  {style}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                          <Select value={aspectRatio} onValueChange={setAspectRatio}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              {aspectRatios.map((ratio) => (
                                <SelectItem key={ratio.value} value={ratio.value}>
                                  {ratio.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Steps: {steps[0]}</label>
                          <Slider
                            value={steps}
                            onValueChange={setSteps}
                            max={50}
                            min={10}
                            step={5}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Guidance: {guidance[0]}</label>
                          <Slider
                            value={guidance}
                            onValueChange={setGuidance}
                            max={15}
                            min={1}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Image
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Quick Prompts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {promptSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(suggestion)}
                          className="w-full text-left p-2 text-xs text-gray-300 bg-white/5 rounded hover:bg-white/10 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </CardContent>
                  </Card>

                  {isGenerating && (
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                          <div>
                            <p className="text-white font-medium">Generating...</p>
                            <p className="text-gray-400 text-sm">This may take 30-60 seconds</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((image) => (
                  <Card key={image.id} className="bg-white/5 border-white/10 group hover:bg-white/10 transition-all">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white text-sm font-medium mb-2 line-clamp-2">{image.prompt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>{image.model}</span>
                        <span>{image.timestamp}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                          onClick={() => handlePostToSocial(image.id)}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Image Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Pre-made templates for common use cases coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">API Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Configure API keys for different image generation services...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Standardized AI Chat Interface */}
        <div className="w-96 border-l border-white/10">
          <AIChat
            title="Image Creation AI"
            placeholder="Describe images to create, ask for style suggestions..."
            initialMessage="Hello! I'm your AI image creation assistant. I can help you generate stunning images, suggest prompts, optimize settings, and create visual content. What would you like to create?"
            onSendMessage={handleAIMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
