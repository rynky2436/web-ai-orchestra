
import { useState } from "react";
import { Search, Globe, BookOpen, FileText, Download, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ResearchTool = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate research API call
    setTimeout(() => {
      setResults([
        {
          id: 1,
          title: "Advanced AI Research Methodologies",
          source: "Nature AI",
          summary: "Comprehensive overview of modern AI research approaches and methodologies...",
          url: "https://example.com/research1",
          type: "academic",
          relevance: 95
        },
        {
          id: 2,
          title: "Machine Learning Best Practices 2024",
          source: "MIT Technology Review",
          summary: "Latest best practices and emerging trends in machine learning applications...",
          url: "https://example.com/research2",
          type: "article",
          relevance: 88
        }
      ]);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Deep Research Tool</h2>
        
        <div className="flex space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your research query..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSearching ? (
              <>Searching...</>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Research
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {results.length > 0 && (
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10 mb-4">
              <TabsTrigger value="results" className="text-white">Results</TabsTrigger>
              <TabsTrigger value="synthesis" className="text-white">AI Synthesis</TabsTrigger>
              <TabsTrigger value="export" className="text-white">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="results">
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={result.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg mb-1">{result.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-white/20 text-gray-300">
                              {result.source}
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {result.relevance}% relevant
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm mb-3">{result.summary}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">{result.url}</span>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                          <FileText className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="synthesis">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI-Generated Research Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 space-y-4">
                    <p>Based on the research findings, here are the key insights:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Advanced AI methodologies are focusing on interpretability and robustness</li>
                      <li>Machine learning best practices emphasize data quality and model validation</li>
                      <li>Emerging trends include federated learning and edge AI deployment</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Export Research</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF Report
                  </Button>
                  <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export as Markdown
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};
