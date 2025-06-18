
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { aiRoutingService } from "@/services/aiRoutingService";

const PRE_PROMPT = "You are a system operator AI. You help the user execute OS-level commands, launch programs, and manage processes.";

export const useOperatorAI = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsRunning(true);
    setLogs(prev => [...prev, `> ${command}`]);
    
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nExecute this system command: ${command}`,
        { 
          component: 'operator_module',
          action: 'execute_command',
          command
        }
      );
      
      setLogs(prev => [...prev, response.content || 'Command executed - no output received']);
      return response;
    } catch (error) {
      const errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
      setLogs(prev => [...prev, errorMessage]);
      toast({
        title: "Command Failed",
        description: "Unable to execute command. Backend service unavailable.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  const launchTool = async (tool: string) => {
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\nLaunch ${tool} application or tool.`,
        { 
          component: 'operator_module',
          action: 'launch_tool',
          tool
        }
      );

      setLogs(prev => [...prev, `Launching ${tool}...`, response.content || `${tool} launched successfully`]);
      return response;
    } catch (error) {
      toast({
        title: "Launch Failed",
        description: `Unable to launch ${tool}. Backend service unavailable.`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const sendChatMessage = async (message: string, context?: Record<string, any>) => {
    try {
      const response = await aiRoutingService.sendMessageWithRouting(
        `${PRE_PROMPT}\n\n${message}`,
        { 
          component: 'operator_module',
          context: context || { recentCommands: logs.slice(-5) }
        }
      );
      
      return response;
    } catch (error) {
      toast({
        title: "Chat Failed",
        description: "Unable to process request. Backend service unavailable.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    executeCommand,
    launchTool,
    sendChatMessage,
    isRunning,
    logs,
    setLogs
  };
};
