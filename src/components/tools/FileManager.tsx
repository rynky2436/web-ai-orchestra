import { useState, useEffect } from "react";
import { 
  FolderOpen, 
  ImageIcon, 
  Video, 
  Music, 
  FileText,
  Trash2, 
  Copy,
  Search,
  Filter,
  ScanLine,
  AlertCircle,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Settings,
  Monitor,
  Brain,
  Shield,
  Database,
  Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AIChat } from "@/components/shared/AIChat";

export const FileManager = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [aiMonitoring, setAiMonitoring] = useState(true);
  const [autoOrganize, setAutoOrganize] = useState(false);
  const [smartBackup, setSmartBackup] = useState(true);
  const [threatDetection, setThreatDetection] = useState(true);
  
  const [duplicates, setDuplicates] = useState([
    {
      id: '1',
      name: 'IMG_0123.jpg',
      size: '2.4 MB',
      path: '/Users/photos/vacation/',
      duplicateCount: 3,
      type: 'image',
      similarity: 100,
      threat: false
    },
    {
      id: '2',
      name: 'video_call_recording.mp4',
      size: '45.2 MB',
      path: '/Users/downloads/',
      duplicateCount: 2,
      type: 'video',
      similarity: 98,
      threat: false
    },
    {
      id: '3',
      name: 'suspicious_file.exe',
      size: '12.1 MB',
      path: '/Users/downloads/',
      duplicateCount: 1,
      type: 'executable',
      similarity: 100,
      threat: true
    }
  ]);
  
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [aiSettings, setAiSettings] = useState({
    autoScan: true,
    smartCategories: true,
    contentAnalysis: true,
    privacyProtection: true,
    cloudSync: false
  });

  // AI monitoring effect
  useEffect(() => {
    if (aiMonitoring) {
      const interval = setInterval(() => {
        // Simulate AI monitoring activity
        console.log('AI File Manager: Monitoring file system...');
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [aiMonitoring]);

  const startAIScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    toast({
      title: "AI Scan Started",
      description: "Advanced AI analysis in progress..."
    });
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast({
            title: "AI Scan Complete",
            description: "Found 15 duplicates, 3 security threats, and 24 optimization opportunities"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const organizeByAI = async () => {
    toast({
      title: "AI Organization Started",
      description: "Analyzing content and organizing files intelligently..."
    });
    
    setTimeout(() => {
      toast({
        title: "Organization Complete",
        description: "Files organized by content type, date, and AI-detected categories"
      });
    }, 3000);
  };

  const handleThreatAnalysis = () => {
    toast({
      title: "AI Threat Analysis",
      description: "Scanning for malware, suspicious files, and privacy risks..."
    });
    
    setTimeout(() => {
      toast({
        title: "Threat Analysis Complete",
        description: "1 potential threat detected and quarantined"
      });
    }, 2000);
  };

  const handleAIMessage = (message: string) => {
    console.log('File Manager AI received:', message);
    
    // AI logic for file management
    if (message.toLowerCase().includes('scan') || message.toLowerCase().includes('find duplicates')) {
      startAIScan();
    } else if (message.toLowerCase().includes('organize')) {
      organizeByAI();
    } else if (message.toLowerCase().includes('clean') || message.toLowerCase().includes('delete')) {
      toast({
        title: "AI Cleanup",
        description: "Analyzing files for safe cleanup..."
      });
    } else if (message.toLowerCase().includes('backup')) {
      toast({
        title: "AI Backup",
        description: "Creating intelligent backup strategy..."
      });
    } else if (message.toLowerCase().includes('security') || message.toLowerCase().includes('threat')) {
      handleThreatAnalysis();
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return Music;
      default: return FileText;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI File Manager</h2>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Intelligent Organization
            </Badge>
            {aiMonitoring && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Monitor className="w-3 h-3 mr-1" />
                AI Active
              </Badge>
            )}
            {threatDetection && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Protected
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={startAIScan}
              disabled={isScanning}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isScanning ? 'AI Scanning...' : 'AI Deep Scan'}
            </Button>
            <Button
              onClick={organizeByAI}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              AI Organize
            </Button>
          </div>
        </div>

        {isScanning && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">AI Deep Scan Progress</span>
              <span className="text-sm text-gray-400">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}
      </div>

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Tabs defaultValue="duplicates" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/5 border-white/10">
              <TabsTrigger value="duplicates" className="text-white data-[state=active]:bg-blue-500/20">Duplicates</TabsTrigger>
              <TabsTrigger value="threats" className="text-white data-[state=active]:bg-blue-500/20">Security</TabsTrigger>
              <TabsTrigger value="organize" className="text-white data-[state=active]:bg-blue-500/20">AI Organize</TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500/20">Analytics</TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-500/20">AI Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="duplicates" className="mt-6 space-y-4">
              {selectedFiles.length > 0 && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 text-sm">
                      {selectedFiles.length} duplicate(s) selected for removal
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={removeDuplicates}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Selected
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedFiles([])}
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {duplicates.map((file) => {
                  const IconComponent = file.type === 'image' ? ImageIcon : 
                                      file.type === 'video' ? Video : 
                                      file.type === 'audio' ? Music : FileText;
                  return (
                    <Card 
                      key={file.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        file.threat ? 'bg-red-500/20 border-red-500/30' :
                        selectedFiles.includes(file.id) ? 'bg-orange-500/20 border-orange-500/30' :
                        'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => !file.threat && setSelectedFiles(prev => 
                        prev.includes(file.id) ? prev.filter(id => id !== file.id) : [...prev, file.id]
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <IconComponent className="w-8 h-8 text-blue-400" />
                            <div>
                              <h3 className="text-white font-medium">{file.name}</h3>
                              <p className="text-sm text-gray-400">{file.path}</p>
                              <p className="text-xs text-gray-500">{file.size}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {file.threat && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Threat
                              </Badge>
                            )}
                            <div className="text-center">
                              <div className="text-orange-400 font-bold">{file.duplicateCount}</div>
                              <div className="text-xs text-gray-400">duplicates</div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-400 font-bold">{file.similarity}%</div>
                              <div className="text-xs text-gray-400">similarity</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="threats" className="mt-6 space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-400" />
                    AI Security Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">1</div>
                      <div className="text-sm text-gray-400">Threats Detected</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="text-2xl font-bold text-yellow-400">3</div>
                      <div className="text-sm text-gray-400">Suspicious Files</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">2.4GB</div>
                      <div className="text-sm text-gray-400">Protected Data</div>
                    </div>
                  </div>
                  
                  <Button onClick={handleThreatAnalysis} className="w-full bg-red-500 hover:bg-red-600 text-white">
                    <Shield className="w-4 h-4 mr-2" />
                    Run Security Scan
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organize" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">AI Organization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <Brain className="w-4 h-4 mr-2" />
                      Smart Content Analysis
                    </Button>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Auto-categorize by Type
                    </Button>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                      <Database className="w-4 h-4 mr-2" />
                      Organize by Usage Pattern
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">AI Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Smart Cleanup
                    </Button>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                      <Cloud className="w-4 h-4 mr-2" />
                      Intelligent Backup
                    </Button>
                    <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Optimize Storage
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Storage Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Images</span>
                        <span className="text-white">15.2 GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Videos</span>
                        <span className="text-white">42.8 GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Documents</span>
                        <span className="text-white">3.1 GB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">AI Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">87%</div>
                      <div className="text-sm text-gray-400">Organization Score</div>
                      <div className="text-sm text-green-400 mt-1">+12% this week</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Security Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>System Protected</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span>1 threat quarantined</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6 space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Enable AI Monitoring</Label>
                    <Switch checked={aiMonitoring} onCheckedChange={setAiMonitoring} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto-organize Files</Label>
                    <Switch checked={autoOrganize} onCheckedChange={setAutoOrganize} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Smart Backup</Label>
                    <Switch checked={smartBackup} onCheckedChange={setSmartBackup} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Threat Detection</Label>
                    <Switch checked={threatDetection} onCheckedChange={setThreatDetection} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Content Analysis</Label>
                    <Switch checked={aiSettings.contentAnalysis} onCheckedChange={(checked) => 
                      setAiSettings(prev => ({ ...prev, contentAnalysis: checked }))
                    } />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Privacy Protection</Label>
                    <Switch checked={aiSettings.privacyProtection} onCheckedChange={(checked) => 
                      setAiSettings(prev => ({ ...prev, privacyProtection: checked }))
                    } />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Model Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">Content Analysis Model</Label>
                    <Select defaultValue="gpt-4-vision">
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="gpt-4-vision">GPT-4 Vision</SelectItem>
                        <SelectItem value="claude-3-vision">Claude 3 Vision</SelectItem>
                        <SelectItem value="gemini-vision">Gemini Vision</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white text-sm">Security Analysis Model</Label>
                    <Select defaultValue="security-ai">
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="security-ai">Security AI Pro</SelectItem>
                        <SelectItem value="threat-detector">Threat Detector</SelectItem>
                        <SelectItem value="malware-scanner">Malware Scanner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Standardized AI Chat Interface */}
        <div className="w-96 border-l border-white/10">
          <AIChat
            title="File Management AI"
            placeholder="Ask me to organize files, find duplicates, scan for threats..."
            initialMessage="Hello! I'm your AI file manager with advanced security and organization capabilities. I can scan for duplicates, detect threats, organize content intelligently, and protect your privacy. What would you like me to help you with?"
            onSendMessage={handleAIMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
