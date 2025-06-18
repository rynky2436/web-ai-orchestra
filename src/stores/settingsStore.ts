
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIProvider, AppSettings } from '@/types/modules';

interface SettingsStore {
  settings: AppSettings;
  aiProviders: AIProvider[];
  elevenLabsApiKey: string;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateAIProvider: (providerId: string, updates: Partial<AIProvider>) => void;
  addAIProvider: (provider: AIProvider) => void;
  setElevenLabsApiKey: (key: string) => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  fontSize: 'medium',
  voiceEnabled: false,
  aiProvider: 'openai',
  permissions: {
    fileAccess: true,
    terminalAccess: true,
    browserControl: true,
    systemControl: true,
    voiceInput: true,
    networkAccess: true,
    unrestricted_browsing: true,
    adult_content: true,
    camera_control: false,
    microphone_control: true,
    database_access: true,
  }
};

const defaultProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    enabled: false,
    models: ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo']
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    enabled: false,
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    enabled: false,
    models: ['llama2', 'codellama', 'mistral']
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    enabled: false,
    models: ['gemini-pro', 'gemini-pro-vision']
  }
];

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      aiProviders: defaultProviders,
      elevenLabsApiKey: '',
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      updateAIProvider: (providerId, updates) =>
        set((state) => ({
          aiProviders: state.aiProviders.map((provider) =>
            provider.id === providerId ? { ...provider, ...updates } : provider
          )
        })),
      addAIProvider: (provider) =>
        set((state) => ({
          aiProviders: [...state.aiProviders, provider]
        })),
      setElevenLabsApiKey: (key) =>
        set({ elevenLabsApiKey: key })
    }),
    {
      name: 'nexusai-settings'
    }
  )
);
