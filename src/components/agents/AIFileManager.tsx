
import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";

export const AIFileManager = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [duplicates, setDuplicates] = useState([
    {
      id: '1',
      name: 'IMG_0123.jpg',
      size: '2.4 MB',
      path: '/Users/photos/vacation/',
      duplicateCount: 3,
      type: 'image',
      similarity: 100
    },
    {
      id: '2',
      name: 'video_call_recording.mp4',
      size: '45.2 MB',
      path: '/Users/downloads/',
      duplicateCount: 2,
      type: 'video',
      similarity: 98
    }
  ]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate AI scanning process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast({
            title: "Scan Complete",
            description: "Found 15 duplicate files and 3 similar media groups"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const organizeByAI = () => {
    toast({
      title: "AI Organization Started",
      description: "Files are being organized by date, type, and content similarity"
    });
  };

  const removeDuplicates = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select duplicates to remove",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Duplicates Removed",
      description: `Successfully removed ${selectedFiles.length} duplicate files`
    });
    setSelectedFiles([]);
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
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Intelligent Organization
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={startScan}
              disabled={isScanning}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ScanLine className="w-4 h-4 mr-2" />
              {isScanning ? 'Scanning...' : 'AI Scan'}
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
              <span className="text-sm text-white">AI Scanning Progress</span>
              <span className="text-sm text-gray-400">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}
      </div>

      <div className="p-6">
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
              })}
            </div>
          </TabsContent>

          <TabsContent value="similar" className="mt-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Similar Media Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">AI has identified visually similar images and videos that you might want to organize or merge.</p>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Find Similar Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organize" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Smart Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Organize by Date
                  </Button>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Group by Content Type
                  </Button>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    AI Content Analysis
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clean Temporary Files
                  </Button>
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                    <Copy className="w-4 h-4 mr-2" />
                    Backup Important Files
                  </Button>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Find Large Files
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
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
                  <CardTitle className="text-white text-lg">Duplicates Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">24</div>
                    <div className="text-sm text-gray-400">duplicate files</div>
                    <div className="text-sm text-green-400 mt-1">8.4 GB recoverable</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-blue-400">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Organize photos by date</span>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>Remove old downloads</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
