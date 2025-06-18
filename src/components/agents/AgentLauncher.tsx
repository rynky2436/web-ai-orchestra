
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
  Volume2,
  Settings,
  ImageIcon,
  Video,
  Music,
  Archive,
  Workflow,
  MessageSquare,
  TrendingUp,
  Lock,
  Wifi,
  HardDrive,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfessionalStore } from "@/stores/professionalStore";
import { toast } from "@/hooks/use-toast";

interface AgentLauncherProps {
  onSelectAgent: (agent: string) => void;
  onViewChange: (view: 'chat' | 'agents' | 'settings') => void;
}

const coreModules = [
  {
    id: 'deep-research',
    name: 'Deep Research',
    description: 'Multi-provider AI research with synthesis and analysis',
    icon: Search,
    color: 'from-orange-500 to-red-500',
    permissions: ['Multi-AI Access', 'Web Research', 'Data Analysis'],
    status: 'ready'
  },
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
    id: 'ai-file-manager',
    name: 'AI File Manager',
    description: 'Intelligent file organization, duplicate detection, and media management',
    icon: FolderOpen,
    color: 'from-teal-500 to-green-500',
    permissions: ['File System Access', 'Image Analysis', 'Content Detection'],
    status: 'ready'
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Create and execute complex automation workflows',
    icon: Workflow,
    color: 'from-purple-500 to-indigo-500',
    permissions: ['Multi-App Control', 'Task Scheduling', 'Event Triggers'],
    status: 'ready'
  },
  {
    id: 'ai-social-manager',
    name: 'AI Social Manager',
    description: 'Manage social media, content creation, and engagement',
    icon: MessageSquare,
    color: 'from-pink-500 to-rose-500',
    permissions: ['Social API Access', 'Content Generation', 'Analytics'],
    status: 'ready'
  }
];

const aiAgents = [
  {
    id: 'media-organizer',
    name: 'Media Organizer',
    description: 'AI-powered photo/video organization and duplicate removal',
    icon: ImageIcon,
    color: 'from-violet-500 to-purple-500',
    category: 'media'
  },
  {
    id: 'content-curator',
    name: 'Content Curator',
    description: 'Analyze and categorize documents, images, and media files',
    icon: Archive,
    color: 'from-emerald-500 to-teal-500',
    category: 'ai'
  },
  {
    id: 'system-optimizer',
    name: 'System Optimizer',
    description: 'AI-driven system performance monitoring and optimization',
    icon: TrendingUp,
    color: 'from-blue-500 to-indigo-500',
    category: 'system'
  },
  {
    id: 'security-guardian',
    name: 'Security Guardian',
    description: 'AI security monitoring, threat detection, and protection',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    category: 'security'
  },
  {
    id: 'network-monitor',
    name: 'Network Monitor',
    description: 'Intelligent network traffic analysis and optimization',
    icon: Wifi,
    color: 'from-cyan-500 to-blue-500',
    category: 'system'
  },
  {
    id: 'data-miner',
    name: 'Data Miner',
    description: 'Extract insights from large datasets and databases',
    icon: Database,
    color: 'from-gray-500 to-slate-500',
    category: 'ai'
  },
  {
    id: 'mobile-assistant',
    name: 'Mobile Assistant',
    description: 'Control and automate mobile device interactions',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    category: 'automation'
  },
  {
    id: 'disk-cleaner',
    name: 'AI Disk Cleaner',
    description: 'Intelligent storage management and cleanup automation',
    icon: HardDrive,
    color: 'from-orange-500 to-amber-500',
    category: 'system'
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

  const { setCurrentProvider, setCurrentModule, initializePlatform } = useProfessionalStore();

  const handleLaunchModule = (moduleId: string) => {
    if (moduleId === 'deep-research') {
      initializePlatform();
      toast({
        title: "Deep Research Activated",
        description: "Multi-provider AI research platform is now ready"
      });
    }
    
    onSelectAgent(moduleId);
    onViewChange('chat');
  };

  const handleLaunchAgent = (agentId: string) => {
    onSelectAgent(agentId);
    onViewChange('chat');
    
    toast({
      title: `${agentId.replace('-', ' ')} Agent Launched`,
      description: "AI agent is now active and ready for tasks"
    });
  };

  const handleLaunchTool = (toolId: string) => {
    // Set appropriate module based on tool
    switch (toolId) {
      case 'research':
        setCurrentModule('research');
        break;
      case 'sandbox':
        setCurrentModule('coding');
        break;
      case 'files':
        setCurrentModule('files');
        break;
      case 'voice':
        setCurrentModule('voice');
        break;
      default:
        setCurrentModule('research');
    }
    
    onSelectAgent(toolId);
    onViewChange('chat');
    
    toast({
      title: `${toolId} Tool Launched`,
      description: "Tool is now active and ready for use"
    });
  };

  const handleQuickStart = () => {
    setCurrentProvider('openai');
    setCurrentModule('research');
    initializePlatform();
    onSelectAgent('deep-research');
    onViewChange('chat');
    
    toast({
      title: "Quick Start Activated",
      description: "NexusAI is ready with Deep Research module"
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">NexusAI Control Center</h2>
          <p className="text-gray-400 mb-4">Launch AI modules and agents for complete automation, research, and system control</p>
          
          <Button 
            onClick={handleQuickStart}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-2"
          >
            <Play className="w-4 h-4 mr-2" />
            Quick Start NexusAI
          </Button>
        </div>

        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
            <TabsTrigger value="modules" className="text-white data-[state=active]:bg-blue-500/20">Core Modules</TabsTrigger>
            <TabsTrigger value="agents" className="text-white data-[state=active]:bg-blue-500/20">AI Agents</TabsTrigger>
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

          <TabsContent value="agents" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiAgents.map((agent) => (
                <Card key={agent.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center`}>
                        <agent.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className="border-white/20 text-gray-300 capitalize">
                        {agent.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
                    <Button 
                      onClick={() => handleLaunchAgent(agent.id)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      Launch Agent
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => handleLaunchModule('professional-ai')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Launch Professional AI
                  </Button>
                  
                  <Button 
                    onClick={() => handleLaunchTool('research')}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Start Research
                  </Button>
                  
                  <Button 
                    onClick={() => handleLaunchTool('sandbox')}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Open Code Editor
                  </Button>
                  
                  <Button 
                    onClick={() => onViewChange('settings')}
                    variant="outline"
                    className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
