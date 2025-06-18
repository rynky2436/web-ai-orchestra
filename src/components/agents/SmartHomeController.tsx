
import { useState } from "react";
import { Home, Lightbulb, Thermometer, Shield, Camera, Wifi, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SmartHomeController = () => {
  const [haConnected, setHaConnected] = useState(false);
  const [haUrl, setHaUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const devices = [
    { id: 'living_room_lights', name: 'Living Room Lights', type: 'light', status: 'on', brightness: 75 },
    { id: 'thermostat', name: 'Main Thermostat', type: 'climate', status: 'heating', temperature: 72 },
    { id: 'front_door', name: 'Front Door Lock', type: 'lock', status: 'locked' },
    { id: 'security_cam', name: 'Security Camera', type: 'camera', status: 'recording' },
    { id: 'garage_door', name: 'Garage Door', type: 'cover', status: 'closed' }
  ];

  const scenes = [
    { id: 'good_morning', name: 'Good Morning', devices: 8 },
    { id: 'leaving_home', name: 'Leaving Home', devices: 12 },
    { id: 'movie_time', name: 'Movie Time', devices: 6 },
    { id: 'bedtime', name: 'Bedtime', devices: 10 }
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Smart Home Controller</h2>
            <Badge className={`${haConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
              {haConnected ? 'Home Assistant Connected' : 'Setup Required'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue={haConnected ? "dashboard" : "setup"} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
            <TabsTrigger value="setup" className="text-white data-[state=active]:bg-blue-500/20">Setup</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-blue-500/20">Dashboard</TabsTrigger>
            <TabsTrigger value="devices" className="text-white data-[state=active]:bg-blue-500/20">Devices</TabsTrigger>
            <TabsTrigger value="automation" className="text-white data-[state=active]:bg-blue-500/20">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Home Assistant Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium">Home Assistant URL</label>
                  <Input
                    value={haUrl}
                    onChange={(e) => setHaUrl(e.target.value)}
                    placeholder="http://homeassistant.local:8123"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400 mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium">Long-Lived Access Token</label>
                  <Input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="Your Home Assistant access token"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400 mt-1"
                  />
                </div>
                
                <Button
                  onClick={() => setHaConnected(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Connect to Home Assistant
                </Button>
                
                <div className="text-sm text-gray-400">
                  <p>This integration supports:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All Home Assistant entities and devices</li>
                    <li>Custom integrations and add-ons</li>
                    <li>Voice control through AI</li>
                    <li>Intelligent automation suggestions</li>
                    <li>Energy monitoring and optimization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">Lights</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">12/15</p>
                  <p className="text-gray-400 text-sm">Active</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-red-400" />
                    <span className="text-white font-medium">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">72°F</p>
                  <p className="text-gray-400 text-sm">Heating</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Security</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">Armed</p>
                  <p className="text-gray-400 text-sm">All secure</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Energy</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">2.4kW</p>
                  <p className="text-gray-400 text-sm">Current usage</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Scenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {scenes.map((scene) => (
                    <Button
                      key={scene.id}
                      variant="outline"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 p-3 h-auto flex flex-col"
                    >
                      <span className="font-medium">{scene.name}</span>
                      <span className="text-xs text-gray-400">{scene.devices} devices</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.map((device) => (
                <Card key={device.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">{device.name}</h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {device.status}
                      </Badge>
                    </div>
                    
                    {device.type === 'light' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Power</span>
                          <Switch defaultChecked />
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Brightness: {device.brightness}%</span>
                          <Slider
                            defaultValue={[device.brightness || 50]}
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                    
                    {device.type === 'climate' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Target</span>
                          <span className="text-white">{device.temperature}°F</span>
                        </div>
                        <Slider
                          defaultValue={[device.temperature || 70]}
                          min={60}
                          max={80}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    )}
                    
                    {(device.type === 'lock' || device.type === 'cover') && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status</span>
                        <Switch defaultChecked={device.status === 'locked' || device.status === 'closed'} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">AI-Powered Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Advanced automation rules and AI suggestions will appear here when connected to Home Assistant.
                </p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Create Smart Automation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
