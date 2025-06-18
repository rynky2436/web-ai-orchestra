
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ModelSelectorProps {
  backendUrl: string;
  apiKey?: string;
  currentModel: string;
  onModelChange: (model: string) => void;
  className?: string;
  textColor?: string;
  inputClasses?: string;
}

interface ModelInfo {
  name: string;
  size?: string;
  modified?: string;
}

export const ModelSelector = ({ 
  backendUrl, 
  apiKey, 
  currentModel, 
  onModelChange,
  className = "",
  textColor = "text-white",
  inputClasses = ""
}: ModelSelectorProps) => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectBackendType = (url: string): 'ollama' | 'openai' | 'claude' | 'unknown' => {
    if (url.includes('localhost:11434') || url.includes('ollama')) return 'ollama';
    if (url.includes('openai.com') || url.includes('api.openai.com')) return 'openai';
    if (url.includes('anthropic.com') || url.includes('api.anthropic.com')) return 'claude';
    return 'unknown';
  };

  const fetchOllamaModels = async (url: string): Promise<ModelInfo[]> => {
    try {
      const response = await fetch(`${url}/api/tags`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.models?.map((model: any) => ({
        name: model.name,
        size: model.size,
        modified: model.modified_at
      })) || [];
    } catch (error) {
      throw new Error(`Failed to fetch Ollama models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchOpenAIModels = async (apiKey: string): Promise<ModelInfo[]> => {
    if (!apiKey) throw new Error('OpenAI API key required');
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      // Filter to commonly used chat models
      const chatModels = data.data?.filter((model: any) => 
        model.id.includes('gpt') || model.id.includes('text-davinci')
      ).map((model: any) => ({
        name: model.id
      })) || [];
      
      return chatModels;
    } catch (error) {
      throw new Error(`Failed to fetch OpenAI models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchClaudeModels = (): ModelInfo[] => {
    // Claude models are predefined as they don't have a public models endpoint
    return [
      { name: 'claude-3-opus-20240229' },
      { name: 'claude-3-sonnet-20240229' },
      { name: 'claude-3-haiku-20240307' },
      { name: 'claude-2.1' },
      { name: 'claude-2.0' }
    ];
  };

  const fetchModels = async () => {
    if (!backendUrl.trim()) {
      setModels([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const backendType = detectBackendType(backendUrl);
      let fetchedModels: ModelInfo[] = [];

      switch (backendType) {
        case 'ollama':
          fetchedModels = await fetchOllamaModels(backendUrl);
          break;
        case 'openai':
          if (!apiKey) {
            throw new Error('OpenAI API key required for model fetching');
          }
          fetchedModels = await fetchOpenAIModels(apiKey);
          break;
        case 'claude':
          fetchedModels = fetchClaudeModels();
          break;
        default:
          // Try Ollama format first for unknown backends
          try {
            fetchedModels = await fetchOllamaModels(backendUrl);
          } catch {
            throw new Error('Unable to detect backend type or fetch models');
          }
      }

      setModels(fetchedModels);
      
      // If current model isn't in the list, clear it
      if (currentModel && !fetchedModels.some(m => m.name === currentModel)) {
        onModelChange('');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch models');
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchModels();
    }, 500); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [backendUrl, apiKey]);

  return (
    <div className={className}>
      <Label htmlFor="default-model" className={textColor}>Default AI Model</Label>
      
      {error && (
        <Alert className="mt-2 mb-2 border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300 text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="relative">
        <Select 
          value={currentModel} 
          onValueChange={onModelChange}
          disabled={isLoading || models.length === 0}
        >
          <SelectTrigger className={`mt-1 ${inputClasses}`}>
            <SelectValue placeholder={
              isLoading ? "Loading models..." : 
              models.length === 0 ? "No models available" : 
              "Select a model"
            } />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                <div className="flex flex-col">
                  <span>{model.name}</span>
                  {model.size && (
                    <span className="text-xs text-gray-500">Size: {model.size}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isLoading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="mt-1 text-xs text-gray-500">
        {models.length > 0 && `${models.length} model(s) available`}
        {backendUrl && !isLoading && models.length === 0 && !error && "No models found"}
      </div>
    </div>
  );
};
