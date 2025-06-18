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
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

const PRE_PROMPT = "You are an intelligent file system AI. You help organize, summarize, clean, and search through file directories and documents.";

export const AIFileManager = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const providers = await aiRoutingService.getProviderStatus();
      const hasConnectedProvider = providers.some(p => p.connected);
      setIsConnected(hasConnectedProvider);
      
      if (!hasConnectedProvider) {
        setConnectionError("No AI providers connected. File management features are unavailable.");
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError("Backend services are not available.");
    }
  };

  const startScan = async () => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "File scanning requires backend connection",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nScan the file system for duplicate files and similar content. Analyze files by hash, content similarity, and metadata.`,
        { 
          component: 'ai_file_manager',
          action: 'scan_duplicates'
        }
      );

      if (response.duplicates && Array.isArray(response.duplicates)) {
        setDuplicates(response.duplicates);
      }

      setScanProgress(100);
      toast({
        title: "Scan Complete",
        description: response.content || "File system scan completed"
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to scan files. Backend service unavailable.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const organizeByAI = async () => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "AI organization requires backend connection",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nOrganize files intelligently by date, type, content similarity, and usage patterns. Create a logical folder structure.`,
        { 
          component: 'ai_file_manager',
          action: 'organize_files'
        }
      );

      toast({
        title: "AI Organization Started",
        description: response.content || "Files are being organized by AI"
      });
    } catch (error) {
      toast({
        title: "Organization Failed",
        description: "Unable to organize files. Backend service unavailable.",
        variant: "destructive"
      });
    }
  };

  const removeDuplicates = async () => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Duplicate removal requires backend connection",
        variant: "destructive"
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select duplicates to remove",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nRemove the following duplicate files safely: ${selectedFiles.join(', ')}`,
        { 
          component: 'ai_file_manager',
          action: 'remove_duplicates',
          fileIds: selectedFiles
        }
      );

      toast({
        title: "Duplicates Removed",
        description: response.content || `Removed ${selectedFiles.length} duplicate files`
      });
      setSelectedFiles([]);
      setDuplicates(prev => prev.filter(d => !selectedFiles.includes(d.id)));
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: "Unable to remove duplicates. Backend service unavailable.",
        variant: "destructive"
      });
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
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 overflow-y-auto">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI File Manager</h2>
            <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={startScan}
              disabled={isScanning || !isConnected}
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              <ScanLine className="w-4 h-4 mr-2" />
              {isScanning ? 'Scanning...' : 'AI Scan'}
            </Button>
            <Button
              onClick={organizeByAI}
              disabled={!isConnected}
              className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              AI Organize
            </Button>
          </div>
        </div>

        {isScanning && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">AI Scanning Progress</span>
              <span className="text-sm text-gray-400">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}
      </div>

      <div className="p-6">
        {connectionError && (
          <Alert className="border-red-500/30 bg-red-500/10 mb-4">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {connectionError}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="duplicates" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
            <TabsTrigger value="duplicates" className="text-white data-[state=active]:bg-blue-500/20">Duplicates</TabsTrigger>
            <TabsTrigger value="similar" className="text-white data-[state=active]:bg-blue-500/20">Similar Media</TabsTrigger>
            <TabsTrigger value="organize" className="text-white data-[state=active]:bg-blue-500/20">Smart Organize</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500/20">Analytics</TabsTrigger>
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
                      disabled={!isConnected}
                      className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
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
              {duplicates.length === 0 ? (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-8 text-center">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">
                      {isConnected ? "No duplicates found. Run a scan to analyze your files." : "Connect AI services to scan for duplicates."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                duplicates.map((file) => {
                  const IconComponent = getFileIcon(file.type);
                  return (
                    <Card 
                      key={file.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedFiles.includes(file.id)
                          ? 'bg-red-500/20 border-red-500/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => toggleFileSelection(file.id)}
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
                            <div className="text-center">
                              <div className="text-orange-400 font-bold">{file.duplicateCount}</div>
                              <div className="text-xs text-gray-400">duplicates</div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-400 font-bold">{file.similarity}%</div>
                              <div className="text-xs text-gray-400">similarity</div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`capitalize ${
                                file.type === 'image' ? 'border-blue-500/30 text-blue-400' :
                                file.type === 'video' ? 'border-purple-500/30 text-purple-400' :
                                'border-green-500/30 text-green-400'
                              }`}
                            >
                              {file.type}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="similar" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Similar Media Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {isConnected 
                    ? "AI will identify visually similar images and videos that you might want to organize or merge."
                    : "Connect AI services to find similar content."
                  }
                </p>
                <Button 
                  disabled={!isConnected}
                  className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Similar Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organize" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Smart Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 mb-4">
                  {isConnected 
                    ? "Use AI to intelligently organize your files by content, date, and usage patterns."
                    : "Connect AI services to enable smart organization."
                  }
                </p>
                <Button 
                  onClick={organizeByAI}
                  disabled={!isConnected}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Organize by AI
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">File Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {isConnected 
                    ? "AI-powered file analytics and storage optimization suggestions."
                    : "Connect AI services to view file analytics."
                  }
                </p>
                <BarChart3 className="w-12 h-12 text-gray-500 mx-auto my-4" />
                <p className="text-center text-gray-400">Analytics integration in progress</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
