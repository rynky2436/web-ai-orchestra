
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Config, AIProviderManager, ProfessionalModuleManager } from '@/services/professionalAI';

interface ProfessionalStore {
  config: Config;
  aiProvider: AIProviderManager | null;
  moduleManager: ProfessionalModuleManager | null;
  currentProvider: string;
  currentModule: string;
  isProcessing: boolean;
  conversations: Array<{
    id: string;
    timestamp: string;
    userMessage: string;
    aiResponse: any;
    provider: string;
    module: string;
  }>;
  
  updateConfig: (updates: Partial<Config>) => void;
  setCurrentProvider: (provider: string) => void;
  setCurrentModule: (module: string) => void;
  processRequest: (message: string) => Promise<any>;
  addConversation: (conversation: any) => void;
  initializePlatform: () => void;
}

const defaultConfig: Config = {
  openai_api_key: '',
  anthropic_api_key: '',
  grok_api_key: '',
  elevenlabs_api_key: '',
  ollama_url: 'http://localhost:11434',
  database_path: 'data/ai_platform.db',
  port: 5000,
  host: '0.0.0.0',
  debug: false
};

export const useProfessionalStore = create<ProfessionalStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      aiProvider: null,
      moduleManager: null,
      currentProvider: 'openai',
      currentModule: 'research',
      isProcessing: false,
      conversations: [],

      updateConfig: (updates) => {
        const newConfig = { ...get().config, ...updates };
        const aiProvider = new AIProviderManager(newConfig);
        const moduleManager = new ProfessionalModuleManager(newConfig, aiProvider);
        
        set({ 
          config: newConfig,
          aiProvider,
          moduleManager
        });
      },

      setCurrentProvider: (provider) => set({ currentProvider: provider }),
      
      setCurrentModule: (module) => set({ currentModule: module }),

      processRequest: async (message) => {
        const { moduleManager, currentProvider, currentModule } = get();
        
        if (!moduleManager) {
          throw new Error('Platform not initialized');
        }

        set({ isProcessing: true });

        try {
          const result = await moduleManager.processRequest(message, currentModule, currentProvider);
          
          const conversation = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            userMessage: message,
            aiResponse: result,
            provider: currentProvider,
            module: currentModule
          };

          get().addConversation(conversation);
          return result;
        } finally {
          set({ isProcessing: false });
        }
      },

      addConversation: (conversation) => {
        set(state => ({
          conversations: [conversation, ...state.conversations].slice(0, 100) // Keep last 100
        }));
      },

      initializePlatform: () => {
        const { config } = get();
        const aiProvider = new AIProviderManager(config);
        const moduleManager = new ProfessionalModuleManager(config, aiProvider);
        
        set({ aiProvider, moduleManager });
      }
    }),
    {
      name: 'nexusai-professional'
    }
  )
);
