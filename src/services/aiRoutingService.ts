
/**
 * AI Routing Service - Frontend integration for component routing and pre-prompt injection
 */

export interface ComponentRoute {
  componentId: string;
  componentType: 'tool' | 'agent' | 'module';
  confidence: number;
  prePrompt: string;
  context: Record<string, any>;
}

export interface RoutingResult {
  primaryComponent: string | null;
  confidence: number;
  allMappings: ComponentRoute[];
  prePrompt?: string;
  timestamp: string;
}

export interface ProviderStatus {
  id: string;
  name: string;
  connected: boolean;
  hasApiKey: boolean;
  baseUrl?: string;
  models?: string[];
  error?: string;
}

export class AIRoutingService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Route a user message to the appropriate component
   */
  async routeMessage(message: string): Promise<RoutingResult | null> {
    try {
      const response = await fetch(`${this.baseUrl}/route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: message
        })
      });

      if (!response.ok) {
        throw new Error(`Routing failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        primaryComponent: data.component_id,
        confidence: 1.0, // Backend doesn't provide confidence yet
        allMappings: [],
        prePrompt: data.pre_prompt,
        timestamp: data.timestamp
      };
    } catch (error) {
      console.error('AI routing error:', error);
      return null;
    }
  }

  /**
   * Get available AI providers and their status
   */
  async getProviderStatus(): Promise<ProviderStatus[]> {
    try {
      const response = await fetch(`${this.baseUrl}/providers/status`);
      
      if (!response.ok) {
        throw new Error(`Provider status fetch failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Provider status error:', error);
      // Return empty array if backend is not available
      return [];
    }
  }

  /**
   * Get the current active provider
   */
  async getActiveProvider(): Promise<ProviderStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/providers/active`);
      
      if (!response.ok) {
        throw new Error(`Active provider fetch failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Active provider error:', error);
      return null;
    }
  }

  /**
   * Set the active provider
   */
  async setActiveProvider(providerId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/providers/active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: providerId
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Set active provider error:', error);
      return false;
    }
  }

  /**
   * Send a message with automatic component routing
   */
  async sendMessageWithRouting(
    message: string, 
    context?: Record<string, any>
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: context || {}
        })
      });

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }

  /**
   * Analyze a message without generating a response
   */
  async analyzeMessage(message: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: message
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  }

  /**
   * Get the current AI context
   */
  async getContext(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/context`);

      if (!response.ok) {
        throw new Error(`Context fetch failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Context fetch error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiRoutingService = new AIRoutingService();

// Component type mappings for the frontend
export const COMPONENT_MAPPINGS = {
  file_manager: {
    name: 'AI File Manager',
    icon: 'FolderOpen',
    description: 'Intelligent file organization and management',
    route: '/tools/file-manager'
  },
  research_tool: {
    name: 'Research Assistant',
    icon: 'Search',
    description: 'Advanced research and information gathering',
    route: '/tools/research'
  },
  code_sandbox: {
    name: 'Code Development',
    icon: 'Code',
    description: 'Code writing, debugging, and optimization',
    route: '/tools/code-sandbox'
  },
  social_manager: {
    name: 'Social Media Manager',
    icon: 'Users',
    description: 'Social media strategy and content creation',
    route: '/agents/social-manager'
  },
  code_creator: {
    name: 'Code Creator Agent',
    icon: 'Cpu',
    description: 'Full-stack application development',
    route: '/agents/code-creator'
  },
  customer_manager: {
    name: 'Customer Manager',
    icon: 'UserCheck',
    description: 'Customer relationship and support management',
    route: '/agents/customer-manager'
  },
  browser_automation: {
    name: 'Browser Automation',
    icon: 'Globe',
    description: 'Web automation and data extraction',
    route: '/modules/browser-automation'
  },
  professional_ai: {
    name: 'Professional AI',
    icon: 'Briefcase',
    description: 'Enterprise-grade AI workflows',
    route: '/modules/professional-ai'
  },
  operator_module: {
    name: 'System Operator',
    icon: 'Settings',
    description: 'System administration and monitoring',
    route: '/modules/operator'
  }
} as const;

export type ComponentId = keyof typeof COMPONENT_MAPPINGS;
