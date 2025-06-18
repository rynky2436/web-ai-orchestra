
import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { AgentLauncher } from "@/components/agents/AgentLauncher";
import { CodeCreatorAgent } from "@/components/agents/CodeCreatorAgent";
import { AISocialManager } from "@/components/agents/AISocialManager";
import { SmartHomeController } from "@/components/agents/SmartHomeController";
import { Settings } from "@/components/settings/Settings";
import { ResearchTool } from "@/components/tools/ResearchTool";
import { CodeSandbox } from "@/components/tools/CodeSandbox";
import { FileManager } from "@/components/tools/FileManager";
import { OperatorModule } from "@/components/modules/OperatorModule";
import { BrowserAutomation } from "@/components/modules/BrowserAutomation";
import { PluginSystem } from "@/components/modules/PluginSystem";
import { AISwitch } from "@/components/modules/AISwitch";
import { ProfessionalAI } from "@/components/modules/ProfessionalAI";
import { CustomerManager } from "@/components/agents/CustomerManager";
import { AIImageCreator } from "@/components/agents/AIImageCreator";
import { useSettingsStore } from "@/stores/settingsStore";

const Index = () => {
  const [activeView, setActiveView] = useState<'chat' | 'agents' | 'settings'>('chat');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const { currentTheme } = useSettingsStore();

  const handleAgentChange = (agent: string | null) => {
    setSelectedAgent(agent);
  };

  const handleSelectAgent = (agent: string) => {
    setSelectedAgent(agent);
    setActiveView('chat');
  };

  const handleViewChange = (view: 'chat' | 'agents' | 'settings') => {
    setActiveView(view);
    if (view === 'agents') {
      setSelectedAgent(null);
    }
  };

  const getBackgroundClasses = () => {
    switch (currentTheme) {
      case 'professional':
        return 'bg-gradient-to-br from-gray-100 to-gray-200';
      case 'dark-professional':
        return 'bg-gradient-to-br from-gray-800 to-gray-900';
      case 'minimal':
        return 'bg-white';
      default:
        return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
    }
  };

  const renderMainContent = () => {
    // Handle agent modules
    if (selectedAgent === 'customer-manager') {
      return <CustomerManager />;
    }
    if (selectedAgent === 'ai-image-creator') {
      return <AIImageCreator />;
    }
    if (selectedAgent === 'social-media-manager') {
      return <AISocialManager />;
    }
    if (selectedAgent === 'smart-home-controller') {
      return <SmartHomeController />;
    }
    if (selectedAgent === 'code-creator') {
      return <CodeCreatorAgent />;
    }
    
    // Handle deep research
    if (selectedAgent === 'deep-research' || selectedAgent === 'professional-ai') {
      return <ProfessionalAI />;
    }
    
    // Handle module views
    if (selectedAgent === 'operator') {
      return <OperatorModule />;
    }
    if (selectedAgent === 'browser-automation') {
      return <BrowserAutomation />;
    }
    if (selectedAgent === 'plugins') {
      return <PluginSystem />;
    }
    if (selectedAgent === 'ai-switch') {
      return <AISwitch />;
    }
    
    // Handle tools
    if (selectedAgent === 'coder' || selectedAgent === 'sandbox') {
      return <CodeSandbox />;
    }
    if (selectedAgent === 'files' || selectedAgent === 'ai-file-manager') {
      return <FileManager />;
    }
    if (selectedAgent === 'research') {
      return <ResearchTool />;
    }

    // Handle main views
    switch (activeView) {
      case 'chat':
        return <ChatPanel selectedAgent={selectedAgent} />;
      case 'agents':
        return <AgentLauncher onSelectAgent={handleSelectAgent} onViewChange={setActiveView} />;
      case 'settings':
        return <Settings />;
      default:
        return <ChatPanel selectedAgent={selectedAgent} />;
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} flex w-full`}>
      <AppSidebar 
        activeView={activeView} 
        onViewChange={handleViewChange}
        selectedAgent={selectedAgent}
        onAgentChange={handleAgentChange}
      />
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Index;
