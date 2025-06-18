
import { useState } from "react";
import { Play, Download, Save, Code, Eye, FileCode, Zap, Globe, Palette, Settings, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CodeSandbox = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusAI Live Preview</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        .header {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            margin-bottom: 30px;
        }
        .button {
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        .button:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to NexusAI</h1>
            <p>Live Preview Coding Assistant</p>
            <button class="button" onclick="alert('Hello from NexusAI!')">Click Me!</button>
        </div>
        <div id="content">
            <p>Edit the code on the left to see changes here in real-time!</p>
        </div>
    </div>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(`/* Custom CSS for your website */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.header {
    background: rgba(255,255,255,0.1);
    padding: 30px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    margin-bottom: 30px;
    animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.button {
    background: #4CAF50;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.button:hover {
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}`);

  const [jsCode, setJsCode] = useState(`// JavaScript for your website
console.log('NexusAI Live Preview Ready!');

// Add interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic content updates
    const updateContent = () => {
        const content = document.getElementById('content');
        if (content) {
            const time = new Date().toLocaleTimeString();
            content.innerHTML = \`
                <p>Last updated: \${time}</p>
                <p>Edit the code to see live changes!</p>
                <div style="margin-top: 20px;">
                    <button class="button" onclick="changeTheme()">Change Theme</button>
                </div>
            \`;
        }
    };
    
    // Update content every 5 seconds
    updateContent();
    setInterval(updateContent, 5000);
});

// Theme changer function
function changeTheme() {
    const body = document.body;
    const themes = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ];
    
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    body.style.background = randomTheme;
}`);

  const [projectType, setProjectType] = useState('website');
  const [previewKey, setPreviewKey] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your coding assistant. I can help you write HTML, CSS, and JavaScript. What would you like to create?' }
  ]);

  const getPreviewContent = () => {
    if (projectType === 'website') {
      return htmlCode;
    } else if (projectType === 'theme') {
      return `<!DOCTYPE html>
<html>
<head>
    <style>${cssCode}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CSS Preview</h1>
            <p>Your custom styles in action</p>
        </div>
    </div>
</body>
</html>`;
    } else {
      return `<!DOCTYPE html>
<html>
<head>
    <style>${cssCode}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JavaScript Plugin</h1>
            <p>Interactive functionality preview</p>
            <div id="plugin-demo"></div>
        </div>
    </div>
    <script>${jsCode}</script>
</body>
</html>`;
    }
  };

  const updatePreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const downloadProject = () => {
    const content = getPreviewContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusai-${projectType}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: chatInput },
      { role: 'assistant', content: `I'll help you with "${chatInput}". Let me generate or modify the code for you.` }
    ]);
    setChatInput('');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Live Coding Assistant</h2>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Eye className="w-3 h-3 mr-1" />
              Live Preview
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="website">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </div>
                </SelectItem>
                <SelectItem value="theme">
                  <div className="flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Theme/CSS
                  </div>
                </SelectItem>
                <SelectItem value="plugin">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Plugin/JS
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={updatePreview}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={downloadProject}
              variant="outline" 
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 border-r border-white/10">
          <Tabs defaultValue="html" className="h-full flex flex-col">
            <TabsList className="bg-white/5 border-b border-white/10 rounded-none">
              <TabsTrigger value="html" className="text-white">
                <FileCode className="w-4 h-4 mr-2" />
                HTML
              </TabsTrigger>
              <TabsTrigger value="css" className="text-white">
                <Palette className="w-4 h-4 mr-2" />
                CSS
              </TabsTrigger>
              <TabsTrigger value="js" className="text-white">
                <Zap className="w-4 h-4 mr-2" />
                JavaScript
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-white">
                <Send className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="flex-1 m-0">
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-full bg-slate-900 text-gray-300 p-4 font-mono text-sm resize-none border-none outline-none"
                placeholder="Write your HTML here..."
              />
            </TabsContent>

            <TabsContent value="css" className="flex-1 m-0">
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full h-full bg-slate-900 text-gray-300 p-4 font-mono text-sm resize-none border-none outline-none"
                placeholder="Write your CSS here..."
              />
            </TabsContent>

            <TabsContent value="js" className="flex-1 m-0">
              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="w-full h-full bg-slate-900 text-gray-300 p-4 font-mono text-sm resize-none border-none outline-none"
                placeholder="Write your JavaScript here..."
              />
            </TabsContent>

            <TabsContent value="chat" className="flex-1 m-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500/20 text-blue-100' 
                        : 'bg-white/5 text-gray-300'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me to help with your code..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  />
                  <Button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim()}
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="border-b border-white/10 p-2 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Live Preview - {projectType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Live</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-white">
            <iframe
              key={previewKey}
              srcDoc={getPreviewContent()}
              className="w-full h-full border-none"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
