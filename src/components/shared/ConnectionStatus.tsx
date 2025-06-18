
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { aiRoutingService } from "@/services/aiRoutingService";

interface ConnectionStatusProps {
  className?: string;
  showAlert?: boolean;
}

export const ConnectionStatus = ({ className, showAlert = true }: ConnectionStatusProps) => {
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
        setConnectionError("No AI providers connected. Backend features are unavailable.");
      } else {
        setConnectionError(null);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError("Backend services are not available.");
    }
  };

  return (
    <div className={className}>
      <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
        {isConnected ? "Connected" : "Disconnected"}
      </Badge>
      
      {connectionError && showAlert && (
        <Alert className="border-red-500/30 bg-red-500/10 mt-4">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            {connectionError}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
