
import { useState } from "react";
import { 
  MessageSquare, 
  Bot, 
  Settings as SettingsIcon, 
  Mic, 
  MicOff,
  Shield,
  Cpu,
  Power,
  Brain,
  Zap,
  ArrowLeft,
  Home,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfessionalStore } from "@/stores/professionalStore";

interface AppSidebarProps {
  activeView: 'chat' | 'agents' | 'settings';
  onViewChange: (view: 'chat' | 'agents' | 'settings') => void;
  selectedAgent: string | null;
  onAgentChange?: (agent: string | null) => void;
}

export const AppSidebar = ({ activeView, onViewChange, selectedAgent, onAgentChange }: AppSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'loading'>('connected');

  const { 
    currentModule, 
    currentProvider,
    isProcessing,
    moduleManager,
    setCurrentModule,
    setCurrentProvider
  } = useProfessionalStore();

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const getAvailableProviders = () => {
    if (!moduleManager || typeof moduleManager.getAvailableProviders !== 'function') {
      return ['custom', 'openai', 'claude', 'ollama'];
    }
    return moduleManager.getAvailableProviders();
  };

  const availableProviders = getAvailableProviders();

  const getProviderDisplayName = (providerId: string) => {
    const providerNames = {
      'custom': 'Custom Reasoning',
      'openai': 'OpenAI',
      'claude': 'Claude',
      'ollama': 'Ollama (Local)'
    };
    return providerNames[providerId] || providerId;
  };

  const modules = [
    { id: 'research', name: 'Deep Research', description: 'Advanced research with reasoning' },
    { id: 'coding', name: 'Strategic Coding', description: 'Intelligent code generation' },
    { id: 'decision', name: 'Decision Engine', description: 'Multi-level decision making' },
    { id: 'analysis', name: 'Deep Analysis', description: 'Pattern recognition & insights' },
    { id: 'memory', name: 'Memory System', description: 'Semantic memory & learning' }
  ];

  const getAgentDisplayName = (agent: string | null) => {
    if (!agent) return null;
    
    const agentNames: Record<string, string> = {
      'professional-ai': 'Professional AI',
      'deep-research': 'Deep Research',
      'operator': 'Operator',
      'browser-automation': 'Browser Automation',
      'research': 'Research Tool',
      'sandbox': 'Code Sandbox',
      'files': 'File Manager',
      'plugins': 'Plugin System',
      'ai-switch': 'AI Switch',
      'voice': 'Voice Control',
      'customer-manager': 'Customer Manager',
      'ai-image-creator': 'AI Image Creator',
      'social-media-manager': 'Social Media Manager',
      'smart-home-controller': 'Smart Home Controller',
      'code-creator': 'Code Creator Agent'
    };
    
    return agentNames[agent] || agent;
  };

  const getAgentIcon = (agent: string | null) => {
    if (!agent) return Bot;
    
    const agentIcons: Record<string, any> = {
      'professional-ai': Brain,
      'deep-research': Brain,
      'operator': Cpu,
      'browser-automation': Bot,
      'research': MessageSquare,
      'sandbox': Cpu,
      'files': SettingsIcon,
      'plugins': Zap,
      'ai-switch': Zap,
      'voice': Mic,
      'customer-manager': Bot,
      'ai-image-creator': Bot,
      'social-media-manager': Bot,
      'smart-home-controller': Bot,
      'code-creator': Bot
    };
    
    return agentIcons[agent] || Bot;
  };

  const handleBackToAgents = () => {
    if (onAgentChange) {
      onAgentChange(null);
    }
    onViewChange('agents');
  };

  const handleBackToChat = () => {
    if (onAgentChange) {
      onAgentChange(null);
    }
    onViewChange('chat');
  };

  const handleMenuItemClick = (viewId: 'chat' | 'agents' | 'settings') => {
    if (viewId === 'agents' && onAgentChange) {
      onAgentChange(null);
    }
    onViewChange(viewId);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`
        bg-black/20 backdrop-blur-lg border-r border-white/10 flex flex-col
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[60px]' : 'w-[240px]'}
      `}
    >
      {/* Header with toggle */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-white truncate">NexusAI</h1>
              <p className="text-xs text-gray-400 truncate">AI Automation Platform</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10 flex-shrink-0 w-8 h-8 p-0"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Back Navigation */}
      {selectedAgent && !isCollapsed && (
        <div className="p-3 border-b border-white/10">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToAgents}
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Agents
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToChat}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 w-8 h-8 p-0"
            >
              <Home className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="p-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className={`p-2 ${isCollapsed ? 'flex justify-center' : 'space-y-2'}`}>
            <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-1' : 'justify-between'}`}>
              <div className="flex items-center space-x-2">
                <Power className="w-3 h-3 text-gray-400 flex-shrink-0" />
                {!isCollapsed && <span className="text-xs text-gray-300">System</span>}
              </div>
              <Badge 
                variant={serverStatus === 'connected' ? 'default' : 'destructive'}
                className={`
                  ${serverStatus === 'connected' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                  ${isCollapsed ? 'w-2 h-2 p-0 rounded-full' : 'text-xs'}
                `}
              >
                {isCollapsed ? '' : serverStatus}
              </Badge>
            </div>
            
            {isProcessing && !isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-400">Processing...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Configuration */}
      {(selectedAgent === 'professional-ai' || selectedAgent === 'deep-research') && !isCollapsed && (
        <div className="p-3 space-y-2">
          <div className="text-xs text-gray-400">AI Configuration</div>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-2 space-y-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Reasoning Module</label>
                <Select value={currentModule} onValueChange={setCurrentModule}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id} className="text-white hover:bg-white/10 text-xs">
                        <span>{module.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">AI Provider</label>
                <Select value={currentProvider} onValueChange={setCurrentProvider}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {availableProviders.map((provider) => (
                      <SelectItem key={provider} value={provider} className="text-white hover:bg-white/10 text-xs">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-3 h-3" />
                          <span>{getProviderDisplayName(provider)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-400">Module</span>
                <Badge variant="outline" className="border-white/20 text-gray-300 text-xs">
                  {currentModule}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? 'default' : 'ghost'}
            className={`
              w-full transition-all duration-200
              ${isCollapsed ? 'px-0 justify-center' : 'justify-start px-3'}
              ${activeView === item.id 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
              }
              h-9
            `}
            onClick={() => handleMenuItemClick(item.id as any)}
          >
            <item.icon className={`w-4 h-4 flex-shrink-0 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Active Agent Display */}
      {selectedAgent && !isCollapsed && (
        <div className="p-3 border-t border-white/10">
          <div className="text-xs text-gray-400 mb-2">Active Agent</div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const IconComponent = getAgentIcon(selectedAgent);
                    return <IconComponent className="w-3 h-3 text-white" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">
                    {getAgentDisplayName(selectedAgent)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {isProcessing ? 'Processing...' : 'Ready'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Voice Controls */}
      <div className="p-3 border-t border-white/10">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {voiceEnabled ? <Mic className="w-3 h-3 text-green-400" /> : <MicOff className="w-3 h-3 text-gray-400" />}
                <span className="text-xs text-gray-300">Voice Control</span>
              </div>
              <Switch 
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
                className="scale-75"
              />
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Shield className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Multi-Provider Ready</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="w-8 h-8 p-0 text-gray-400 hover:text-white"
            >
              {voiceEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};
