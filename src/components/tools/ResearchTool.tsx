
import { useState } from "react";
import { Search, Globe, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/shared/ChatInterface";

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
}

export const ResearchTool = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Simulate search results
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResults: SearchResult[] = [
        {
          title: "Understanding " + searchQuery,
          url: "https://example.com/1",
          snippet: "Comprehensive guide to " + searchQuery + " with detailed explanations and examples.",
          source: "TechDocs"
        },
        {
          title: searchQuery + " Best Practices",
          url: "https://example.com/2", 
          snippet: "Learn the industry standards and best practices for implementing " + searchQuery,
          source: "DevGuide"
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Simulate AI research response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on my research about "${message}", I found several key insights. Let me search for the latest information...` 
      }]);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex">
      {/* Main Research Panel */}
      <div className="flex-1 p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Research Tool</h2>
            <Badge variant="secondary">AI-Powered</Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Globe className="w-4 h-4 mr-2" />
              Web Search
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your research query..."
                className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
              <Button 
                onClick={performSearch}
                disabled={isSearching}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card className="bg-white/5 border-white/10 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Search Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div key={index} className="border border-white/10 rounded-lg p-4 bg-white/5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-blue-400 font-medium">{result.title}</h3>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{result.snippet}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{result.source}</Badge>
                    <span className="text-xs text-gray-500">{result.url}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No results yet. Start by entering a search query.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Research Assistant */}
      <div className="w-96">
        <ChatInterface
          title="Research Assistant"
          placeholder="Ask me to research anything..."
          messages={messages}
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  );
};
