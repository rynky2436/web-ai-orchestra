
import { useState, useEffect } from "react";
import { Search, Globe, BookOpen, ExternalLink, Brain, Monitor, Filter, TrendingUp, Shield, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/shared/ChatInterface";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  datePublished?: string;
}

const PRE_PROMPT = "You are a research assistant AI. You gather and synthesize information from reliable web sources and present summaries.";

export const ResearchTool = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchEngine, setSearchEngine] = useState("all");
  const [contentFilter, setContentFilter] = useState("academic");
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
        setConnectionError("No AI providers connected. Research features are unavailable.");
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError("Backend services are not available.");
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Research requires backend connection",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nPerform research on: "${searchQuery}" using ${searchEngine} sources with ${contentFilter} content filter.`, 
        { 
          component: 'research_tool',
          action: 'search',
          searchEngine,
          contentFilter,
          query: searchQuery
        }
      );
      
      // Parse response for search results if available
      if (response.results && Array.isArray(response.results)) {
        setSearchResults(response.results);
      } else if (response.content) {
        // If no structured results, show response in a single result
        setSearchResults([{
          title: `Research Results for: ${searchQuery}`,
          url: '',
          snippet: response.content,
          source: 'AI Research Assistant',
          datePublished: new Date().toISOString().split('T')[0]
        }]);
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to perform research. Backend service unavailable.",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Research assistant requires backend connection",
        variant: "destructive"
      });
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\n${message}`, 
        { 
          component: 'research_tool',
          context: searchResults.length > 0 ? { searchResults } : {},
          searchQuery: searchQuery || undefined
        }
      );
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.content || "No response received from AI backend"
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Error: Unable to process request. Backend service unavailable."
      }]);
    }
  };

  const saveResearch = async () => {
    if (!isConnected) {
      toast({
        title: "Service Unavailable",
        description: "Save functionality requires backend connection",
        variant: "destructive"
      });
      return;
    }

    if (searchResults.length === 0) {
      toast({
        title: "No Data to Save",
        description: "Perform a search first to save results",
        variant: "destructive"
      });
      return;
    }

    try {
      const researchData = {
        query: searchQuery,
        results: searchResults,
        timestamp: new Date().toISOString(),
        searchEngine,
        contentFilter
      };

      const blob = new Blob([JSON.stringify(researchData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-${searchQuery.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Research Saved",
        description: "Research data downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save research data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Research Tool</h2>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                AI Research
              </Badge>
              <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/5 border-white/10 text-white hover:bg-white/10" 
                onClick={saveResearch}
                disabled={!isConnected || searchResults.length === 0}
              >
                <Database className="w-4 h-4 mr-2" />
                Save Research
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {connectionError && (
            <Alert className="border-red-500/30 bg-red-500/10 mb-4">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {connectionError}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10">
              <TabsTrigger value="search" className="text-white data-[state=active]:bg-blue-500/20">Search</TabsTrigger>
              <TabsTrigger value="results" className="text-white data-[state=active]:bg-blue-500/20">Results</TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-500/20">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-4 space-y-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Research Query</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter your research query..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                      onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                      disabled={!isConnected}
                    />
                    <Button 
                      onClick={performSearch}
                      disabled={isSearching || !isConnected || !searchQuery.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white text-sm">Search Source</Label>
                      <Select value={searchEngine} onValueChange={setSearchEngine} disabled={!isConnected}>
                        <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          <SelectItem value="all">All Sources</SelectItem>
                          <SelectItem value="academic">Academic Only</SelectItem>
                          <SelectItem value="news">News Sources</SelectItem>
                          <SelectItem value="expert">Expert Opinions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white text-sm">Content Filter</Label>
                      <Select value={contentFilter} onValueChange={setContentFilter} disabled={!isConnected}>
                        <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Research Results
                    {searchResults.length > 0 && (
                      <Badge variant="outline" className="text-blue-400">
                        {searchResults.length} results
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {searchResults.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No search results yet. {isConnected ? "Enter a query to start researching." : "Connect backend services to enable research."}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((result, index) => (
                        <Card key={index} className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <h4 className="text-white font-medium mb-2 flex items-center justify-between">
                              {result.title}
                              {result.url && (
                                <a 
                                  href={result.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </h4>
                            <p className="text-gray-300 text-sm mb-2">{result.snippet}</p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{result.source}</span>
                              {result.datePublished && <span>{result.datePublished}</span>}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Research Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">Maximum Results</Label>
                    <Select disabled={!isConnected}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select max results" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="10">10 Results</SelectItem>
                        <SelectItem value="20">20 Results</SelectItem>
                        <SelectItem value="50">50 Results</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Date Range</Label>
                    <Select disabled={!isConnected}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                        <SelectItem value="all-time">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="w-96">
        <ChatInterface
          title="Research Assistant"
          placeholder={isConnected ? "Ask research questions..." : "Connect AI service to enable chat"}
          messages={messages}
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
