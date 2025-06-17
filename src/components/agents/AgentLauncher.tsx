
import { useState } from "react";
import { 
  Bot, 
  Code, 
  Globe, 
  FileText, 
  Terminal, 
  Brain,
  Search,
  Beaker,
  FolderOpen,
  Database,
  Zap,
  Shield,
  Play,
  Eye,
  Monitor,
  Chrome,
  Puzzle,
  Mic,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentLauncherProps {
  onSelectAgent: (agent: string) => void;
  onViewChange: (view: 'chat' | 'agents' | 'settings') => void;
}

const coreModules = [
  {
    id: 'operator',
    name: 'Operator',
    description: 'Full system and browser control with Chrome automation',
    icon: Monitor,
    color: 'from-red-500 to-orange-500',
    permissions: ['System Control', 'Browser Control', 'Terminal Access'],
    status: 'ready'
  },
  {
    id: 'coder',
    name: 'Coder',
    description: 'Live code writer, editor, and debugger with preview',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    permissions: ['File Access', 'Code Execution'],
    status: 'ready'
  },
  {
    id: 'browser-automation',
    name: 'Browser Automation',
    description: 'Automate Chrome with Puppeteer-like functionality',
    icon: Chrome,
    color: 'from-blue-500 to-green-500',
    permissions: ['Web Access', 'Browser Control'],
    status: 'ready'
  }
];

const tools = [
  {
    id: 'research',
    name: 'Deep Research',
    description: 'AI-powered research with multiple sources and synthesis',
    icon: Search,
    color: 'from-orange-500 to-red-500',
    category: 'research'
  },
  {
    id: 'sandbox',
    name: 'Code Sandbox',
    description: 'Live coding environment with instant preview',
    icon: Beaker,
    color: 'from-indigo-500 to-purple-500',
    category: 'development'
  },
  {
    id: 'files',
    name: 'File Manager',
    description: 'Browse, edit, and manage local files and directories',
    icon: FolderOpen,
    color: 'from-teal-500 to-green-500',
    category: 'system'
  },
  {
    id: 'plugins',
    name: 'Plugin System',
    description: 'Manage and install custom plugins (.ts/.py files)',
    icon: Puzzle,
    color: 'from-violet-500 to-purple-500',
    category: 'system'
  },
  {
    id: 'ai-switch',
    name: 'AI Provider Switch',
    description: 'Switch between OpenAI, Claude, Ollama, and Gemini',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    category: 'ai'
  },
  {
    id: 'voice',
    name: 'Voice Control',
    description: 'ElevenLabs TTS and speech-to-text integration',
    icon: Mic,
    color: 'from-purple-500 to-pink-500',
    category: 'ai'
  }
];

export const AgentLauncher = ({ onSelectAgent, onViewChange }: AgentLauncherProps) => {
  const [permissions, setPermissions] = useState({
    fileAccess: false,
    terminalAccess: false,
    browserControl: false,
    systemControl: false
  });

  const handleLaunchModule = (moduleId: string) => {
    onSelectAgent(moduleId);
    onViewChange('chat');
  };

  const handleLaunchTool = (toolId: string) => {
    onSelectAgent(toolId);
    onViewChange('chat');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">NexusAI Control Center</h2>
          <p className="text-gray-400">Launch AI modules and tools for complete automation, development, and system control</p>
        </div>

        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10">
            <TabsTrigger value="modules" className="text-white data-[state=active]:bg-blue-500/20">Core Modules</TabsTrigger>
            <TabsTrigger value="tools" className="text-white data-[state=active]:bg-blue-500/20">Tools</TabsTrigger>
            <TabsTrigger value="permissions" className="text-white data-[state=active]:bg-blue-500/20">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreModules.map((module) => (
                <Card key={module.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                        <module.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${module.status === 'ready' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                        {module.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{module.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {module.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs border-white/20 text-gray-300">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => handleLaunchModule(module.id)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white group-hover:bg-blue-400"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Launch Module
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <Card key={tool.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className="border-white/20 text-gray-300 capitalize">
                        {tool.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                    <Button 
                      onClick={() => handleLaunchTool(tool.id)}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white group-hover:bg-purple-400"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open Tool
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <CardTitle className="text-white">Security Permissions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">File System Access</h4>
                    <p className="text-gray-400 text-sm">Allow agents to read and write local files</p>
                  </div>
                  <Switch 
                    checked={permissions.fileAccess}
                    onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, fileAccess: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Terminal Access</h4>
                    <p className="text-gray-400 text-sm">Allow agents to execute terminal commands</p>
                  </div>
                  <Switch 
                    checked={permissions.terminalAccess}
                    onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, terminalAccess: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Browser Control</h4>
                    <p className="text-gray-400 text-sm">Allow agents to control web browsers</p>
                  </div>
                  <Switch 
                    checked={permissions.browserControl}
                    onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, browserControl: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">System Control</h4>
                    <p className="text-gray-400 text-sm">Allow full system access (Operator Agent only)</p>
                  </div>
                  <Switch 
                    checked={permissions.systemControl}
                    onCheckedChange={(checked) => setPermissions(prev => ({ ...prev, systemControl: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
