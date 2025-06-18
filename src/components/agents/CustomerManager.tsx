import { useState } from "react";
import { Users, UserPlus, MessageSquare, Phone, Mail, Calendar, TrendingUp, Brain, Search, Filter, MoreVertical, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AIChat } from "@/components/shared/AIChat";

export const CustomerManager = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const customers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      status: 'active',
      value: '$12,500',
      lastContact: '2 days ago',
      tags: ['VIP', 'Tech'],
      sentiment: 'positive',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@startup.com',
      phone: '+1 (555) 987-6543',
      company: 'Startup Solutions',
      status: 'prospect',
      value: '$8,200',
      lastContact: '1 week ago',
      tags: ['Startup', 'Growth'],
      sentiment: 'neutral',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma@design.co',
      phone: '+1 (555) 456-7890',
      company: 'Creative Designs',
      status: 'inactive',
      value: '$5,800',
      lastContact: '3 weeks ago',
      tags: ['Design', 'Creative'],
      sentiment: 'negative',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const aiInsights = [
    {
      type: 'opportunity',
      title: 'High-Value Follow-up',
      description: 'Sarah Johnson hasn\'t been contacted in 2 days. AI suggests scheduling a call.',
      priority: 'high'
    },
    {
      type: 'churn_risk',
      title: 'Churn Risk Alert',
      description: 'Emma Wilson shows declining engagement. Consider re-engagement campaign.',
      priority: 'medium'
    },
    {
      type: 'upsell',
      title: 'Upsell Opportunity',
      description: 'Mike Chen\'s usage patterns suggest readiness for premium package.',
      priority: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'prospect': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'neutral': return 'text-yellow-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleAIMessage = (message: string) => {
    console.log('Customer Manager AI received:', message);
    // Handle AI customer management requests
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900/50 to-black/50 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Customer Manager</h2>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              AI Powered
            </Badge>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Tabs defaultValue="customers" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
              <TabsTrigger value="customers" className="text-white data-[state=active]:bg-blue-500/20">Customers</TabsTrigger>
              <TabsTrigger value="insights" className="text-white data-[state=active]:bg-blue-500/20">AI Insights</TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500/20">Analytics</TabsTrigger>
              <TabsTrigger value="automation" className="text-white data-[state=active]:bg-blue-500/20">Automation</TabsTrigger>
            </TabsList>

            <TabsContent value="customers" className="mt-6 space-y-6">
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customers by name, email, or company..."
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="prospect">Prospects</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                  <Card key={customer.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-white font-medium">{customer.name}</h3>
                            <p className="text-gray-400 text-sm">{customer.company}</p>
                          </div>
                        </div>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                        <span className="text-white font-semibold">{customer.value}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Last contact: {customer.lastContact}</span>
                        <Star className={`w-4 h-4 ${getSentimentColor(customer.sentiment)}`} />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-white/20 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                          <Calendar className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiInsights.map((insight, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-5 h-5 text-purple-400" />
                          <CardTitle className="text-white">{insight.title}</CardTitle>
                        </div>
                        <Badge className={insight.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}>
                          {insight.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 mb-4">{insight.description}</p>
                      <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                        Take Action
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Customers</p>
                        <p className="text-2xl font-bold text-white">1,247</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Active Rate</p>
                        <p className="text-2xl font-bold text-white">78%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">$186K</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Satisfaction</p>
                        <p className="text-2xl font-bold text-white">4.8/5</p>
                      </div>
                      <Star className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">AI Automation Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Set up intelligent automation rules for customer management...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Standardized AI Chat Interface */}
        <div className="w-96 border-l border-white/10">
          <AIChat
            title="Customer AI"
            placeholder="Ask me about customers, insights, follow-ups, analytics..."
            initialMessage="Hello! I'm your AI customer manager. I can help you analyze customer data, identify opportunities, manage relationships, and automate workflows. What would you like to know about your customers?"
            onSendMessage={handleAIMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
