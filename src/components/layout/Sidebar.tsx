
import { useState, useEffect } from "react";
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
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfessionalStore } from "@/stores/professionalStore";

interface SidebarProps {
  activeView: 'chat' | 'agents' | 'settings';
  onViewChange: (view: 'chat' | 'agents' | 'settings') => void;
  selectedAgent: string | null;
}

export const Sidebar = ({ activeView, onViewChange, selectedAgent }: SidebarProps) => {
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

  const availableProviders = moduleManager?.getAvailableProviders() || ['custom'];

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

  // Update server status based on AI system state
  useEffect(() => {
    if (moduleManager) {
      setServerStatus('connected');
    } else {
      setServerStatus('disconnected');
    }
  }, [moduleManager]);

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
      'voice': 'Voice Control'
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
      'voice': Mic
    };
    
    return agentIcons[agent] || Bot;
  };

  return (
    <div className="w-80 bg-black/20 backdrop-blur-lg border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">NexusAI</h1>
            <p className="text-sm text-gray-400">AI Automation Platform</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="p-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Power className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">System</span>
              </div>
              <Badge 
                variant={serverStatus === 'connected' ? 'default' : 'destructive'}
                className={serverStatus === 'connected' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
              >
                {serverStatus}
              </Badge>
            </div>
            
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-400">Processing...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Configuration - Only show when Professional AI is active */}
      {(selectedAgent === 'professional-ai' || selectedAgent === 'deep-research') && (
        <div className="p-4 space-y-3">
          <div className="text-sm text-gray-400 mb-2">AI Configuration</div>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-3 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Reasoning Module</label>
                <Select value={currentModule} onValueChange={setCurrentModule}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id} className="text-white hover:bg-white/10">
                        <span>{module.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">AI Provider</label>
                <Select value={currentProvider} onValueChange={setCurrentProvider}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {availableProviders.map((provider) => (
                      <SelectItem key={provider} value={provider} className="text-white hover:bg-white/10">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-3 h-3" />
                          <span>{getProviderDisplayName(provider)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
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
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? 'default' : 'ghost'}
            className={`w-full justify-start ${
              activeView === item.id 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => onViewChange(item.id as any)}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Active Agent Display */}
      {selectedAgent && (
        <div className="p-4 border-t border-white/10">
          <div className="text-sm text-gray-400 mb-2">Active Agent</div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  {(() => {
                    const IconComponent = getAgentIcon(selectedAgent);
                    return <IconComponent className="w-4 h-4 text-white" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
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
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {voiceEnabled ? <Mic className="w-4 h-4 text-green-400" /> : <MicOff className="w-4 h-4 text-gray-400" />}
            <span className="text-sm text-gray-300">Voice Control</span>
          </div>
          <Switch 
            checked={voiceEnabled}
            onCheckedChange={setVoiceEnabled}
          />
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Shield className="w-3 h-3" />
          <span>AI Platform: Multi-Provider Ready</span>
        </div>
      </div>
    </div>
  );
};
