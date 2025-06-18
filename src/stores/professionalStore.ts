
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Config, ProfessionalModuleManager } from '@/services/professionalAI';
import { useSettingsStore } from '@/stores/settingsStore';

interface ProfessionalStore {
  config: Config;
  moduleManager: ProfessionalModuleManager | null;
  currentModule: string;
  currentProvider: string;
  isProcessing: boolean;
  conversations: Array<{
    id: string;
    timestamp: string;
    userMessage: string;
    aiResponse: any;
    module: string;
    provider: string;
  }>;
  
  updateConfig: (updates: Partial<Config>) => void;
  setCurrentModule: (module: string) => void;
  setCurrentProvider: (provider: string) => void;
  processRequest: (message: string) => Promise<any>;
  addConversation: (conversation: any) => void;
  initializePlatform: () => void;
}

const defaultConfig: Config = {
  ollama_url: 'http://localhost:11434',
  database_path: 'data/ai_platform.db',
  memory_data_dir: 'data/memory',
  port: 7777,
  host: '0.0.0.0',
  debug: false
};

export const useProfessionalStore = create<ProfessionalStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      moduleManager: null,
      currentModule: 'research',
      currentProvider: 'custom',
      isProcessing: false,
      conversations: [],

      updateConfig: (updates) => {
        const newConfig = { ...get().config, ...updates };
        get().initializePlatform();
        set({ config: newConfig });
      },
      
      setCurrentModule: (module) => set({ currentModule: module }),
      setCurrentProvider: (provider) => set({ currentProvider: provider }),

      processRequest: async (message) => {
        const { moduleManager, currentModule, currentProvider } = get();
        
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
            module: currentModule,
            provider: currentProvider
          };

          get().addConversation(conversation);
          return result;
        } finally {
          set({ isProcessing: false });
        }
      },

      addConversation: (conversation) => {
        set(state => ({
          conversations: [conversation, ...state.conversations].slice(0, 100)
        }));
      },

      initializePlatform: () => {
        const { config } = get();
        const settingsStore = useSettingsStore.getState();
        
        // Get AI provider credentials from settings
        const aiProviders = {};
        settingsStore.aiProviders.forEach(provider => {
          if (provider.apiKey) {
            aiProviders[provider.id] = { apiKey: provider.apiKey };
          }
        });
        
        const moduleManager = new ProfessionalModuleManager(config, aiProviders);
        set({ moduleManager });
      }
    }),
    {
      name: 'custom-reasoning-platform'
    }
  )
);
