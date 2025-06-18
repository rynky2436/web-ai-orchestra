
import { useState } from "react";
import { Shield, ShieldOff, Monitor, Globe, FileText, Terminal, Camera, Mic, Database, Network } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/stores/settingsStore";

export const OperatorPermissions = () => {
  const { settings, updateSettings } = useSettingsStore();

  const handlePermissionChange = (permission: string, enabled: boolean) => {
    updateSettings({
      permissions: {
        ...settings.permissions,
        [permission]: enabled
      }
    });
  };

  const permissions = [
    {
      id: 'unrestricted_browsing',
      name: 'Unrestricted Web Browsing',
      description: 'Allow AI to browse any website without content filters',
      icon: Globe,
      category: 'Internet Access',
      risk: 'low',
      enabled: settings.permissions.unrestricted_browsing ?? true
    },
    {
      id: 'adult_content',
      name: 'Adult Content Access',
      description: 'Allow AI to access adult websites and mature content',
      icon: ShieldOff,
      category: 'Content Filters',
      risk: 'low',
      enabled: settings.permissions.adult_content ?? true
    },
    {
      id: 'system_control',
      name: 'Full System Control',
      description: 'Complete access to system settings and configurations',
      icon: Monitor,
      category: 'System Access',
      risk: 'high',
      enabled: settings.permissions.systemControl ?? true
    },
    {
      id: 'terminal_access',
      name: 'Terminal & Command Line',
      description: 'Execute any system commands and scripts',
      icon: Terminal,
      category: 'System Access',
      risk: 'high',
      enabled: settings.permissions.terminalAccess ?? true
    },
    {
      id: 'file_system',
      name: 'Complete File System Access',
      description: 'Read, write, delete any files on the system',
      icon: FileText,
      category: 'File Operations',
      risk: 'high',
      enabled: settings.permissions.fileAccess ?? true
    },
    {
      id: 'network_access',
      name: 'Network Operations',
      description: 'Make network requests, download files, access APIs',
      icon: Network,
      category: 'Network',
      risk: 'medium',
      enabled: settings.permissions.networkAccess ?? true
    },
    {
      id: 'camera_control',
      name: 'Camera Access',
      description: 'Access and control camera devices',
      icon: Camera,
      category: 'Hardware',
      risk: 'medium',
      enabled: settings.permissions.camera_control ?? false
    },
    {
      id: 'microphone_control',
      name: 'Microphone Access',
      description: 'Access and control microphone devices',
      icon: Mic,
      category: 'Hardware',
      risk: 'medium',
      enabled: settings.permissions.voiceInput ?? true
    },
    {
      id: 'database_access',
      name: 'Database Operations',
      description: 'Full access to databases and data storage',
      icon: Database,
      category: 'Data',
      risk: 'high',
      enabled: settings.permissions.database_access ?? true
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const enabledCount = permissions.filter(p => p.enabled).length;
  const totalCount = permissions.length;

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <CardTitle className="text-white">AI Operator Permissions</CardTitle>
          </div>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            {enabledCount}/{totalCount} Active
          </Badge>
        </div>
        <CardDescription className="text-gray-400">
          Control what your AI operator can access and do. Default is unrestricted access - disable only what you want to limit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex space-x-4">
          <button
            onClick={() => {
              permissions.forEach(p => handlePermissionChange(p.id, true));
            }}
            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors"
          >
            Enable All
          </button>
          <button
            onClick={() => {
              permissions.forEach(p => handlePermissionChange(p.id, false));
            }}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
          >
            Disable All
          </button>
        </div>

        <Separator className="bg-white/10" />

        {/* Permission Groups */}
        {['Internet Access', 'System Access', 'File Operations', 'Network', 'Hardware', 'Data', 'Content Filters'].map(category => {
          const categoryPermissions = permissions.filter(p => p.category === category);
          if (categoryPermissions.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h4 className="text-white font-medium text-sm uppercase tracking-wide opacity-80">
                {category}
              </h4>
              <div className="space-y-3">
                {categoryPermissions.map(permission => {
                  const Icon = permission.icon;
                  return (
                    <div key={permission.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3 flex-1">
                        <Icon className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Label className="text-white font-medium">
                              {permission.name}
                            </Label>
                            <Badge className={getRiskColor(permission.risk)}>
                              {permission.risk} risk
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={permission.enabled}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <Separator className="bg-white/10" />

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ShieldOff className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-medium">Freedom by Default</span>
          </div>
          <p className="text-gray-300 text-sm">
            Your AI operator starts with unrestricted access to maximize its capabilities. 
            Only disable permissions if you specifically want to limit certain functions. 
            The AI can browse any content, access any system function, and perform any operation unless you choose to restrict it.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
