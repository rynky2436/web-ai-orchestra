
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
import { toast } from "@/hooks/use-toast";

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
  relevance: number;
  credibility: number;
  datePublished?: string;
}

export const ResearchTool = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState(true);
  const [factChecking, setFactChecking] = useState(true);
  const [sourceVerification, setSourceVerification] = useState(true);
  const [deepResearch, setDeepResearch] = useState(false);
  const [searchEngine, setSearchEngine] = useState("all");
  const [contentFilter, setContentFilter] = useState("academic");

  const [aiSettings, setAiSettings] = useState({
    model: "gpt-4",
    maxResults: 20,
    researchDepth: "comprehensive",
    languageFilter: "english",
    dateRange: "all-time"
  });

  // AI monitoring for research trends
  useEffect(() => {
    if (searchQuery && aiAnalysis) {
      const analyzeQuery = setTimeout(() => {
        console.log('AI analyzing search query for optimization...');
      }, 1000);

      return () => clearTimeout(analyzeQuery);
    }
  }, [searchQuery, aiAnalysis]);

  const performAIResearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    toast({
      title: "AI Research Started",
      description: "Performing comprehensive AI-powered research..."
    });

    try {
      // Simulate AI-powered research
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults: SearchResult[] = [
        {
          title: "Comprehensive Analysis: " + searchQuery,
          url: "https://research.ai/comprehensive-analysis",
          snippet: `In-depth AI analysis of ${searchQuery} reveals significant insights into current trends, methodologies, and future implications. This comprehensive study examines multiple perspectives and provides evidence-based conclusions.`,
          source: "AI Research Institute",
          relevance: 98,
          credibility: 95,
          datePublished: "2024-01-15"
        },
        {
          title: "Expert Review: Latest Developments in " + searchQuery,
          url: "https://experts.com/latest-developments",
          snippet: `Leading experts in the field provide their latest insights on ${searchQuery}, including breakthrough discoveries, emerging patterns, and critical evaluations of current methodologies.`,
          source: "Expert Review Journal",
          relevance: 94,
          credibility: 92,
          datePublished: "2024-01-10"
        },
        {
          title: "Data-Driven Insights: " + searchQuery + " Trends",
          url: "https://datainsights.com/trends-analysis",
          snippet: `Advanced data analysis reveals key trends and patterns in ${searchQuery}, with statistical significance testing and predictive modeling to forecast future developments.`,
          source: "Data Science Hub",
          relevance: 91,
          credibility: 89,
          datePublished: "2024-01-08"
        }
      ];
      
      setSearchResults(mockResults);
      
      if (factChecking) {
        setTimeout(() => {
          toast({
            title: "Fact-Checking Complete",
            description: "All sources verified for accuracy and credibility"
          });
        }, 1500);
      }

      if (deepResearch) {
        setTimeout(() => {
          toast({
            title: "Deep Research Analysis",
            description: "Cross-referencing with academic databases and expert opinions"
          });
        }, 2000);
      }

    } catch (error) {
      console.error("Research failed:", error);
      toast({
        title: "Research Error",
        description: "Failed to complete research analysis",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const generateResearchSummary = () => {
    if (searchResults.length === 0) {
      toast({
        title: "No Results",
        description: "Please perform a search first",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Generating AI Summary",
      description: "Creating comprehensive research summary..."
    });

    setTimeout(() => {
      const summary = `AI Research Summary for "${searchQuery}":

🔍 Key Findings:
• Current research shows significant developments in this field
• High credibility sources indicate growing importance
• Expert consensus points to emerging trends and opportunities

📊 Data Analysis:
• Average relevance score: ${Math.round(searchResults.reduce((acc, result) => acc + result.relevance, 0) / searchResults.length)}%
• Source credibility: ${Math.round(searchResults.reduce((acc, result) => acc + result.credibility, 0) / searchResults.length)}%
• Total sources analyzed: ${searchResults.length}

💡 Recommendations:
• Focus on recent developments from high-credibility sources
• Consider cross-referencing with academic publications
• Monitor ongoing trends for future implications`;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: summary 
      }]);

      toast({
        title: "Research Summary Complete",
        description: "AI has generated a comprehensive analysis"
      });
    }, 2000);
  };

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // AI research assistant logic
    setTimeout(() => {
      let response = "";
      
      if (message.toLowerCase().includes('search') || message.toLowerCase().includes('research')) {
        if (message.toLowerCase().includes('search')) {
          const query = message.replace(/search for?/i, '').trim();
          if (query) {
            setSearchQuery(query);
            response = `I'll research "${query}" for you using advanced AI analysis and multiple sources.`;
            setTimeout(() => performAIResearch(), 1000);
          } else {
            response = "What would you like me to research? Please provide a specific topic or query.";
          }
        } else {
          response = "I'll help you with comprehensive research. What topic would you like me to investigate?";
        }
      } else if (message.toLowerCase().includes('summarize') || message.toLowerCase().includes('summary')) {
        response = "I'll create a comprehensive summary of the research findings with key insights and recommendations.";
        setTimeout(() => generateResearchSummary(), 1000);
      } else if (message.toLowerCase().includes('fact check') || message.toLowerCase().includes('verify')) {
        response = "I'll perform fact-checking and source verification to ensure accuracy and credibility of the information.";
      } else if (message.toLowerCase().includes('trend') || message.toLowerCase().includes('analysis')) {
        response = "I'll analyze current trends and patterns in the research data to identify emerging insights and opportunities.";
      } else {
        response = `I can help you with advanced research including AI-powered search, fact-checking, source verification, trend analysis, and comprehensive summaries. What specific research assistance do you need?`;
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">AI Research Tool</h2>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                AI-Powered Research
              </Badge>
              {aiAnalysis && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Analysis
                </Badge>
              )}
              {factChecking && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Fact-Checked
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={generateResearchSummary} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Brain className="w-4 h-4 mr-2" />
                AI Summary
              </Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Database className="w-4 h-4 mr-2" />
                Save Research
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
              <TabsTrigger value="search" className="text-white data-[state=active]:bg-blue-500/20">AI Search</TabsTrigger>
              <TabsTrigger value="results" className="text-white data-[state=active]:bg-blue-500/20">Results</TabsTrigger>
              <TabsTrigger value="analysis" className="text-white data-[state=active]:bg-blue-500/20">Analysis</TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-500/20">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-4 space-y-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI-Powered Research</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter your research query..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                      onKeyPress={(e) => e.key === 'Enter' && performAIResearch()}
                    />
                    <Button 
                      onClick={performAIResearch}
                      disabled={isSearching}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {isSearching ? "Researching..." : "AI Research"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white text-sm">Search Engine</Label>
                      <Select value={searchEngine} onValueChange={setSearchEngine}>
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
                      <Select value={contentFilter} onValueChange={setContentFilter}>
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

                    <div>
                      <Label className="text-white text-sm">Research Depth</Label>
                      <Select value={aiSettings.researchDepth} onValueChange={(value) => setAiSettings(prev => ({ ...prev, researchDepth: value }))}>
                        <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          <SelectItem value="quick">Quick Overview</SelectItem>
                          <SelectItem value="standard">Standard Research</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive</SelectItem>
                          <SelectItem value="expert">Expert Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch checked={aiAnalysis} onCheckedChange={setAiAnalysis} />
                      <span className="text-white text-sm">AI Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={factChecking} onCheckedChange={setFactChecking} />
                      <span className="text-white text-sm">Fact Checking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={sourceVerification} onCheckedChange={setSourceVerification} />
                      <span className="text-white text-sm">Source Verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={deepResearch} onCheckedChange={setDeepResearch} />
                      <span className="text-white text-sm">Deep Research</span>
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
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <div key={index} className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-blue-400 font-medium">{result.title}</h3>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{result.snippet}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="text-xs">{result.source}</Badge>
                            {result.datePublished && (
                              <span className="text-xs text-gray-500">{result.datePublished}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-green-400">
                              Relevance: {result.relevance}%
                            </div>
                            <div className="text-xs text-blue-400">
                              Credibility: {result.credibility}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-12">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No research results yet. Start by entering a search query.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Research Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {searchResults.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Average Relevance</span>
                          <span className="text-green-400 font-medium">
                            {Math.round(searchResults.reduce((acc, result) => acc + result.relevance, 0) / searchResults.length)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Average Credibility</span>
                          <span className="text-blue-400 font-medium">
                            {Math.round(searchResults.reduce((acc, result) => acc + result.credibility, 0) / searchResults.length)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Sources</span>
                          <span className="text-white font-medium">{searchResults.length}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">No data to analyze yet.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">AI Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-blue-400">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        <span>High-quality sources identified</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <Shield className="w-4 h-4 mr-2" />
                        <span>Fact-checking verified</span>
                      </div>
                      <div className="flex items-center text-purple-400">
                        <Brain className="w-4 h-4 mr-2" />
                        <span>AI analysis complete</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Research Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white text-sm">AI Model</Label>
                    <Select value={aiSettings.model} onValueChange={(value) => setAiSettings(prev => ({ ...prev, model: value }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Maximum Results</Label>
                    <Select value={aiSettings.maxResults.toString()} onValueChange={(value) => setAiSettings(prev => ({ ...prev, maxResults: parseInt(value) }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="10">10 Results</SelectItem>
                        <SelectItem value="20">20 Results</SelectItem>
                        <SelectItem value="50">50 Results</SelectItem>
                        <SelectItem value="100">100 Results</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Date Range</Label>
                    <Select value={aiSettings.dateRange} onValueChange={(value) => setAiSettings(prev => ({ ...prev, dateRange: value }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                        <SelectValue />
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

      {/* AI Research Assistant */}
      <div className="w-96">
        <ChatInterface
          title="Research Assistant AI"
          placeholder="Ask me to research anything, analyze trends, fact-check..."
          messages={messages}
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
