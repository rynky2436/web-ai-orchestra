import { useState } from "react";
import { 
  Code, 
  Palette, 
  Globe, 
  Puzzle,
  FileText,
  Download,
  Play,
  Copy,
  Save,
  Zap,
  Layers,
  Smartphone,
  Monitor,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AIChat } from "@/components/shared/AIChat";

export const CodeCreatorAgent = () => {
  const [projectType, setProjectType] = useState('website');
  const [description, setDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const projectTypes = [
    { id: 'website', name: 'Website', icon: Globe, description: 'Full websites with HTML, CSS, JavaScript' },
    { id: 'plugin', name: 'Plugin', icon: Puzzle, description: 'Browser extensions and app plugins' },
    { id: 'theme', name: 'Theme', icon: Palette, description: 'UI themes and styling systems' },
    { id: 'component', name: 'Component', icon: Layers, description: 'Reusable UI components' },
    { id: 'app', name: 'Web App', icon: Monitor, description: 'Interactive web applications' },
    { id: 'mobile', name: 'Mobile UI', icon: Smartphone, description: 'Mobile-responsive interfaces' }
  ];

  const generateCode = async () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe what you want me to create",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI code generation
    setTimeout(() => {
      const mockCode = `// ${projectName || 'Generated Project'} - ${projectType}
// Created by NexusAI Code Creator Agent

${projectType === 'website' ? `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName || 'My Website'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        h1 { 
            font-size: 3rem; 
            margin-bottom: 1rem; 
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
        .button {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .button:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .feature {
            background: rgba(255,255,255,0.05);
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${projectName || 'Welcome to NexusAI'}</h1>
        <p>${description}</p>
        <button class="button" onclick="showAlert()">Get Started</button>
        
        <div class="features">
            <div class="feature">
                <h3>🚀 Fast</h3>
                <p>Lightning fast performance</p>
            </div>
            <div class="feature">
                <h3>🎨 Beautiful</h3>
                <p>Modern, clean design</p>
            </div>
            <div class="feature">
                <h3>📱 Responsive</h3>
                <p>Works on all devices</p>
            </div>
        </div>
    </div>
    
    <script>
        function showAlert() {
            alert('Hello from NexusAI! Your website is ready to customize.');
        }
        
        // Add some interactivity
        document.addEventListener('mousemove', (e) => {
            const container = document.querySelector('.container');
            const x = (e.clientX / window.innerWidth) * 10;
            const y = (e.clientY / window.innerHeight) * 10;
            container.style.transform = \`translateX(\${x}px) translateY(\${y}px)\`;
        });
    </script>
</body>
</html>
` : projectType === 'plugin' ? `
// ${projectName || 'Plugin'} - Browser Extension
// Manifest V3

// manifest.json
{
  "manifest_version": 3,
  "name": "${projectName || 'My Plugin'}",
  "version": "1.0",
  "description": "${description}",
  "permissions": ["activeTab", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_title": "${projectName || 'My Plugin'}"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}

// popup.html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { width: 300px; padding: 20px; font-family: Arial; }
        .header { text-align: center; margin-bottom: 20px; }
        .button { 
            width: 100%; 
            padding: 10px; 
            background: #4285f4; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>${projectName || 'My Plugin'}</h2>
        <p>${description}</p>
    </div>
    <button class="button" id="actionBtn">Execute</button>
    <script src="popup.js"></script>
</body>
</html>

// popup.js
document.getElementById('actionBtn').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "execute"});
    });
});

// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "execute") {
        console.log("Plugin executed!", "${description}");
        // Your plugin logic here
    }
});
` : projectType === 'theme' ? `
/* ${projectName || 'Theme'} - Custom Theme */
/* ${description} */

:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #06b6d4;
    --background: #0f172a;
    --surface: #1e293b;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --border: #334155;
    --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: var(--background);
    color: var(--text-primary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
}

.theme-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    backdrop-filter: blur(10px);
}

.button {
    background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.button:hover {
    transform: translateY(-1px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.text-gradient {
    background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
` : `
// ${projectName || 'Component'} - React Component
import React, { useState } from 'react';

const ${projectName?.replace(/\s+/g, '') || 'MyComponent'} = () => {
    const [state, setState] = useState('');

    return (
        <div className="component-container">
            <h2>${projectName || 'My Component'}</h2>
            <p>${description}</p>
            {/* Component logic here */}
        </div>
    );
};

export default ${projectName?.replace(/\s+/g, '') || 'MyComponent'};
`}`;

      setGeneratedCode(mockCode);
      setIsGenerating(false);
      
      toast({
        title: "Code Generated!",
        description: `Successfully created ${projectType} code based on your description`
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard"
    });
  };

  const downloadCode = () => {
    const extension = projectType === 'website' ? '.html' : 
                    projectType === 'theme' ? '.css' : 
                    projectType === 'plugin' ? '.zip' : '.js';
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'generated-code'}${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `Code saved as ${projectName || 'generated-code'}${extension}`
    });
  };

  const handleAIMessage = (message: string) => {
    console.log('Code Creator AI received:', message);
    // Handle AI code creation requests
  };

  const getPreviewContent = () => {
    if (!generatedCode) return '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888; font-family: Arial;">Generate some code to see the preview</div>';
    
    if (projectType === 'website') {
      return generatedCode;
    } else if (projectType === 'theme') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            ${generatedCode}
          </style>
        </head>
        <body>
          <div class="theme-container">
            <div style="padding: 2rem;">
              <div class="card">
                <h1 class="text-gradient">Theme Preview</h1>
                <p>This is how your theme looks in action.</p>
                <button class="button">Sample Button</button>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      return `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888; font-family: Arial; text-align: center;">
          <div>
            <h3>Code Generated</h3>
            <p>Preview not available for ${projectType} projects</p>
            <p>Use the download button to get your files</p>
          </div>
        </div>
      `;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Code Creator Agent</h2>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              AI-Powered Development
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className={`${showPreview ? 'w-1/2' : 'flex-1'} p-6 overflow-y-auto border-r border-white/10`}>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10">
              <TabsTrigger value="create" className="text-white data-[state=active]:bg-purple-500/20">Create</TabsTrigger>
              <TabsTrigger value="templates" className="text-white data-[state=active]:bg-purple-500/20">Templates</TabsTrigger>
              <TabsTrigger value="examples" className="text-white data-[state=active]:bg-purple-500/20">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-6 space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Project Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Project Type</label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {projectTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center space-x-2">
                              <type.icon className="w-4 h-4" />
                              <span>{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Project Name</label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="My Awesome Project"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what you want me to create. Be as detailed as possible..."
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-24"
                    />
                  </div>

                  <Button
                    onClick={generateCode}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating Code...' : 'Generate Code'}
                  </Button>
                </CardContent>
              </Card>

              {generatedCode && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Generated Code</CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={copyToClipboard}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          onClick={downloadCode}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 max-h-96">
                      <code>{generatedCode}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTypes.map((type) => (
                  <Card key={type.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <type.icon className="w-6 h-6 text-purple-400" />
                        <CardTitle className="text-white text-lg">{type.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm">{type.description}</p>
                      <Button 
                        className="w-full mt-3 bg-purple-500 hover:bg-purple-600 text-white"
                        onClick={() => setProjectType(type.id)}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="examples" className="mt-6">
              <div className="space-y-4">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Example Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-black/30 rounded-lg">
                      <h4 className="text-white font-medium">Portfolio Website</h4>
                      <p className="text-gray-400 text-sm">A modern portfolio with animations and dark theme</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg">
                      <h4 className="text-white font-medium">Chrome Extension</h4>
                      <p className="text-gray-400 text-sm">Productivity plugin with tab management features</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg">
                      <h4 className="text-white font-medium">Dashboard Theme</h4>
                      <p className="text-gray-400 text-sm">Admin dashboard with glassmorphism design</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="w-1/2 flex flex-col border-r border-white/10">
            <div className="p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-medium">Live Preview</h3>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  {projectType}
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 bg-white">
              <iframe
                srcDoc={getPreviewContent()}
                className="w-full h-full border-none"
                title="Live Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}

        {/* AI Chat Interface */}
        <div className="w-96 border-l border-white/10">
          <AIChat
            title="Code Creation AI"
            placeholder="Describe what you want to build, ask for help with code..."
            initialMessage="Hello! I'm your AI code creator. I can help you build websites, plugins, themes, components, and full applications. Just describe what you want to create and I'll generate the code for you. What shall we build today?"
            onSendMessage={handleAIMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
