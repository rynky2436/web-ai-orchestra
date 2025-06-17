
import { useState } from "react";
import { 
  FolderOpen, 
  File, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const FileManager = () => {
  const [currentPath, setCurrentPath] = useState('/home/user/projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const files = [
    { name: 'nexusai-backend', type: 'folder', size: '—', modified: '2 hours ago' },
    { name: 'nexusai-frontend', type: 'folder', size: '—', modified: '1 hour ago' },
    { name: 'config.json', type: 'file', size: '2.4 KB', modified: '30 min ago' },
    { name: 'requirements.txt', type: 'file', size: '1.2 KB', modified: '1 hour ago' },
    { name: 'README.md', type: 'file', size: '4.8 KB', modified: '2 hours ago' },
    { name: 'main.py', type: 'file', size: '12.3 KB', modified: '45 min ago' },
    { name: 'package.json', type: 'file', size: '3.1 KB', modified: '1 hour ago' },
  ];

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName) 
        ? prev.filter(f => f !== fileName)
        : [...prev, fileName]
    );
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">File Manager</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Upload className="w-4 h-4 mr-1" />
              Upload
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Path and Search */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">Current Path:</div>
            <div className="text-white font-mono bg-white/5 px-3 py-1 rounded border border-white/10">
              {currentPath}
            </div>
          </div>
          <div className="w-64">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="bg-white/5 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Action Bar */}
          {selectedFiles.length > 0 && (
            <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 text-sm">
                  {selectedFiles.length} file(s) selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Files Grid */}
          <div className="grid grid-cols-1 gap-2">
            {files.map((file) => (
              <Card 
                key={file.name}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedFiles.includes(file.name)
                    ? 'bg-blue-500/20 border-blue-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => toggleFileSelection(file.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {file.type === 'folder' ? (
                        <FolderOpen className="w-5 h-5 text-blue-400" />
                      ) : (
                        <File className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <div className="text-white font-medium">{file.name}</div>
                        <div className="text-xs text-gray-400">
                          {file.size} • Modified {file.modified}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.type === 'folder' && (
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                          Folder
                        </Badge>
                      )}
                      {file.name.endsWith('.py') && (
                        <Badge variant="outline" className="border-green-500/30 text-green-400">
                          Python
                        </Badge>
                      )}
                      {file.name.endsWith('.json') && (
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                          JSON
                        </Badge>
                      )}
                      {file.name.endsWith('.md') && (
                        <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                          Markdown
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
