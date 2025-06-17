
import { useState } from "react";
import { 
  MessageSquare, 
  Bot, 
  Settings as SettingsIcon, 
  Mic, 
  MicOff,
  Shield,
  Cpu,
  Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface SidebarProps {
  activeView: 'chat' | 'agents' | 'settings';
  onViewChange: (view: 'chat' | 'agents' | 'settings') => void;
  selectedAgent: string | null;
}

export const Sidebar = ({ activeView, onViewChange, selectedAgent }: SidebarProps) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'loading'>('connected');

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

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

      {/* Server Status */}
      <div className="p-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Power className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Backend</span>
              </div>
              <Badge 
                variant={serverStatus === 'connected' ? 'default' : 'destructive'}
                className={serverStatus === 'connected' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
              >
                {serverStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{selectedAgent}</div>
                  <div className="text-xs text-gray-400">Running</div>
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
          <span>Permissions: File Access, Terminal</span>
        </div>
      </div>
    </div>
  );
};
