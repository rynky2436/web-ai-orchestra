
import { useState } from "react";
import { 
  Code, 
  Globe, 
  FolderOpen, 
  Terminal, 
  Settings,
  Play,
  Square,
  Shield,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'idle' | 'running' | 'error';
  permissions: string[];
  requiresPermission: boolean;
}

interface AgentLauncherProps {
  onSelectAgent: (agentId: string) => void;
  onViewChange: (view: 'chat' | 'agents' | 'settings') => void;
}

export const AgentLauncher = ({ onSelectAgent, onViewChange }: AgentLauncherProps) => {
  const [agents] = useState<Agent[]>([
    {
      id: 'coder',
      name: 'Coder Agent',
      description: 'Writes, reviews, and executes code with live preview capabilities',
      icon: Code,
      status: 'idle',
      permissions: ['file_write', 'code_execution'],
      requiresPermission: true
    },
    {
      id: 'browser',
      name: 'Browser Agent',
      description: 'Automates web browsing and data extraction using Playwright',
      icon: Globe,
      status: 'idle',
      permissions: ['web_access', 'automation'],
      requiresPermission: true
    },
    {
      id: 'file',
      name: 'File Agent',
      description: 'Manages local files, folders, and performs file operations',
      icon: FolderOpen,
      status: 'idle',
      permissions: ['file_read', 'file_write', 'directory_access'],
      requiresPermission: true
    },
    {
      id: 'terminal',
      name: 'Terminal Agent',
      description: 'Executes terminal commands safely within controlled environment',
      icon: Terminal,
      status: 'idle',
      permissions: ['command_execution', 'system_access'],
      requiresPermission: true
    }
  ]);

  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());
  const [permissionsEnabled, setPermissionsEnabled] = useState<{ [key: string]: boolean }>({
    file_access: false,
    terminal_access: false,
    web_automation: false,
    code_execution: false
  });

  const handleLaunchAgent = (agent: Agent) => {
    if (agent.requiresPermission && !hasRequiredPermissions(agent)) {
      // Show permission dialog
      return;
    }

    if (runningAgents.has(agent.id)) {
      // Stop agent
      setRunningAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agent.id);
        return newSet;
      });
    } else {
      // Start agent
      setRunningAgents(prev => new Set(prev).add(agent.id));
      onSelectAgent(agent.name);
      onViewChange('chat');
    }
  };

  const hasRequiredPermissions = (agent: Agent) => {
    return agent.permissions.some(permission => 
      permissionsEnabled[permission] || 
      permissionsEnabled[permission.split('_')[0] + '_access']
    );
  };

  const getStatusColor = (status: string, isRunning: boolean) => {
    if (isRunning) return 'bg-green-500/20 text-green-400 border-green-500/30';
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-slate-900/50 to-black/50">
      {/* Header */}
      <div className="border-b border-white/10 p-6 bg-black/20 backdrop-blur-lg">
        <h2 className="text-2xl font-bold text-white mb-2">Agent Launcher</h2>
        <p className="text-gray-400">Select and configure AI agents for your automation tasks</p>
      </div>

      {/* Permissions Panel */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Security Permissions</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(permissionsEnabled).map(([permission, enabled]) => (
            <div key={permission} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white capitalize">{permission.replace('_', ' ')}</span>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => 
                  setPermissionsEnabled(prev => ({ ...prev, [permission]: checked }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => {
            const isRunning = runningAgents.has(agent.id);
            const hasPermissions = hasRequiredPermissions(agent);
            
            return (
              <Card 
                key={agent.id} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <agent.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                        <Badge className={getStatusColor(agent.status, isRunning)}>
                          {isRunning ? 'Running' : agent.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLaunchAgent(agent)}
                      disabled={agent.requiresPermission && !hasPermissions}
                      className={`${
                        isRunning 
                          ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' 
                          : 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4">
                    {agent.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Required Permissions:</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.permissions.map((permission) => (
                        <Badge 
                          key={permission} 
                          variant="outline" 
                          className="text-xs bg-white/5 border-white/20 text-gray-300"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {agent.requiresPermission && !hasPermissions && (
                    <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-400">
                      ⚠️ Missing required permissions
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
