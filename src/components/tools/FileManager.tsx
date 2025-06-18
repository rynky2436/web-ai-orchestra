
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
  RefreshCw,
  Send,
  MessageSquare,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FileManager = () => {
  const [currentPath, setCurrentPath] = useState('/home/user/projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [aiRequest, setAiRequest] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your file management assistant. I can help you organize, edit, and manage your files.' }
  ]);

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

  const handleEditFile = (fileName: string) => {
    setEditingFile(fileName);
    // Simulate loading file content
    setFileContent(`// Content of ${fileName}
// This is a simulated file editor
// You can modify the content here

console.log('Editing ${fileName}');
`);
  };

  const handleSaveFile = () => {
    setChatMessages(prev => [
      ...prev,
      { role: 'assistant', content: `File "${editingFile}" has been saved successfully!` }
    ]);
    setEditingFile(null);
    setFileContent('');
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: chatInput },
      { role: 'assistant', content: `I'll help you with "${chatInput}". What specific file operation would you like me to perform?` }
    ]);
    setChatInput('');
  };

  const handleAiFileOperation = () => {
    if (!aiRequest.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { role: 'assistant', content: `I'll help you with "${aiRequest}". Let me process this file operation.` }
    ]);
    setAiRequest('');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      {/* Prominent Header with Communication */}
      <div className="border-b border-white/10 p-6 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI File Manager</h2>
              <p className="text-gray-400 text-sm">Organize and manage files with AI assistance</p>
            </div>
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

        {/* PRIMARY AI COMMUNICATION INTERFACE */}
        <div className="bg-gradient-to-r from-teal-500/20 to-green-500/20 p-4 rounded-lg border border-teal-500/30 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-teal-400" />
            <h3 className="text-white font-semibold">AI File Assistant - Tell me what to do with files</h3>
          </div>
          <div className="flex space-x-3">
            <Input
              value={aiRequest}
              onChange={(e) => setAiRequest(e.target.value)}
              placeholder="Ask me to organize files, find duplicates, create folders, analyze content... (e.g., 'organize images by date', 'find all Python files')"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-300 h-12 text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleAiFileOperation()}
            />
            <Button 
              onClick={handleAiFileOperation}
              disabled={!aiRequest.trim()}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 h-12"
            >
              <Brain className="w-4 h-4 mr-2" />
              Execute
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

      {/* Main Content */}
      <div className="flex-1 flex">
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      onClick={() => selectedFiles[0] && handleEditFile(selectedFiles[0])}
                    >
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

        {/* PROMINENT AI Assistant */}
        <div className="w-96 border-l border-white/10 flex flex-col bg-gradient-to-b from-teal-900/20 to-green-900/20">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="bg-white/5 border-b border-white/10 rounded-none">
              <TabsTrigger value="chat" className="text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              {editingFile && (
                <TabsTrigger value="editor" className="text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Editor
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="chat" className="flex-1 m-0 flex flex-col">
              <div className="p-4 border-b border-white/10 bg-black/20">
                <h3 className="text-white font-bold text-lg">AI File Assistant</h3>
                <p className="text-gray-300 text-sm mt-1">Ask me to help with file operations</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500/30 text-blue-100 border border-blue-400/30' 
                        : 'bg-white/10 text-gray-200 border border-white/20'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about file operations..."
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-300 h-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  />
                  <Button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim()}
                    size="sm"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 h-10"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {editingFile && (
              <TabsContent value="editor" className="flex-1 m-0 flex flex-col">
                <div className="p-4 border-b border-white/10 bg-black/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Editing: {editingFile}</h3>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveFile}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingFile(null)}
                        size="sm"
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <Textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="w-full h-full bg-slate-900 text-gray-300 font-mono text-sm resize-none border-none rounded-none"
                    placeholder="File content will appear here..."
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};
