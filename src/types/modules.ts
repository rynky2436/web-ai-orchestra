
export interface Module {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  permissions: Permission[];
  status: 'ready' | 'disabled' | 'error';
  category: 'ai' | 'automation' | 'development' | 'system';
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  required?: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  apiKey?: string;
  enabled: boolean;
  models: string[];
  latency?: number;
  cost?: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  voiceEnabled: boolean;
  aiProvider: string;
  permissions: {
    fileAccess: boolean;
    terminalAccess: boolean;
    browserControl: boolean;
    systemControl: boolean;
    voiceInput: boolean;
    networkAccess: boolean;
    unrestricted_browsing: boolean;
    adult_content: boolean;
    camera_control: boolean;
    microphone_control: boolean;
    database_access: boolean;
  };
}
