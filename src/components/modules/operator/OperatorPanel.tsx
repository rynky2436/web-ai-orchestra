
import { Terminal, Chrome, Settings } from "lucide-react";
import { OperatorButton } from "./OperatorButton";
import { useOperatorAI } from "@/hooks/useOperatorAI";

interface OperatorPanelProps {
  isConnected: boolean;
}

export const OperatorPanel = ({ isConnected }: OperatorPanelProps) => {
  const { launchTool } = useOperatorAI();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <OperatorButton
        label="Open Terminal"
        description="Execute system commands and scripts with AI assistance."
        icon={Terminal}
        onClick={() => launchTool('terminal')}
        disabled={!isConnected}
        buttonColor="bg-red-500 hover:bg-red-600"
      />

      <OperatorButton
        label="Launch Browser"
        description="AI-powered Chrome automation and control capabilities."
        icon={Chrome}
        onClick={() => launchTool('browser')}
        disabled={!isConnected}
        buttonColor="bg-blue-500 hover:bg-blue-600"
      />

      <OperatorButton
        label="Open Settings"
        description="Modify system configurations with AI guidance."
        icon={Settings}
        onClick={() => launchTool('settings')}
        disabled={!isConnected}
        buttonColor="bg-green-500 hover:bg-green-600"
      />
    </div>
  );
};
