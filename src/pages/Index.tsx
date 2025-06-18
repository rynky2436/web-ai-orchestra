import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
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
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [activeView, setActiveView] = useState<'chat' | 'agents' | 'settings'>('chat');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const renderMainContent = () => {
    // Handle new agent modules
    if (selectedAgent === 'social-media-manager') {
      return <AISocialManager />;
    }
    if (selectedAgent === 'smart-home-controller') {
      return <SmartHomeController />;
    }
    if (selectedAgent === 'code-creator') {
      return <CodeCreatorAgent />;
    }
    
    // Handle renamed deep research (was professional-ai)
    if (selectedAgent === 'deep-research' || selectedAgent === 'professional-ai') {
      return <ProfessionalAI />;
    }
    
    // Handle new module views
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
    
    // Handle existing tool views
    if (selectedAgent === 'research') {
      return <ResearchTool />;
    }
    if (selectedAgent === 'sandbox') {
      return <CodeSandbox />;
    }
    if (selectedAgent === 'files') {
      return <FileManager />;
    }

    // Handle main views
    switch (activeView) {
      case 'chat':
        return <ChatPanel selectedAgent={selectedAgent} />;
      case 'agents':
        return <AgentLauncher onSelectAgent={setSelectedAgent} onViewChange={setActiveView} />;
      case 'settings':
        return <Settings />;
      default:
        return <ChatPanel selectedAgent={selectedAgent} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex w-full">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          selectedAgent={selectedAgent}
        />
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
