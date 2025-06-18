
import { AIProvider } from '@/types/modules';

export interface Config {
  ollama_url: string;
  database_path: string;
  memory_data_dir: string;
  port: number;
  host: string;
  debug: boolean;
}

export interface AIRequest {
  message: string;
  module: string;
  session_id?: string;
  context?: any;
}

export interface AIResponse {
  type: string;
  timestamp: string;
  provider: string;
  [key: string]: any;
}

// Base provider class for unified logic
abstract class BaseAIProvider {
  protected config: Config;
  
  constructor(config: Config) {
    this.config = config;
  }
  
  abstract generateResponse(message: string, context?: any): Promise<string>;
  
  // Shared logic for all providers
  protected buildContext(message: string, context: any): any {
    return {
      module: context?.module || 'research',
      task_type: context?.task_type || 'general',
      user_id: 'frontend_user',
      message,
      ...context
    };
  }
}

// Your custom reasoning provider
export class CustomReasoningProvider extends BaseAIProvider {
  private backendUrl: string;

  constructor(config: Config) {
    super(config);
    this.backendUrl = `http://${config.host}:${config.port}`;
  }

  async generateResponse(message: string, context?: any): Promise<string> {
    try {
      const response = await fetch(`${this.backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.buildContext(message, context))
      });

      if (response.ok) {
        const result = await response.json();
        return result.response?.message || result.message || 'No response generated';
      } else {
        throw new Error(`Backend API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Custom reasoning provider error:', error);
      return `Error: Unable to connect to reasoning backend - ${error}`;
    }
  }
}

// OpenAI provider
export class OpenAIProvider extends BaseAIProvider {
  private apiKey: string;

  constructor(config: Config, apiKey: string) {
    super(config);
    this.apiKey = apiKey;
  }

  async generateResponse(message: string, context?: any): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(context)
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.choices[0].message.content;
      } else {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('OpenAI provider error:', error);
      return `Error: OpenAI request failed - ${error}`;
    }
  }

  private getSystemPrompt(context: any): string {
    const module = context?.module || 'research';
    const prompts = {
      research: 'You are an advanced research AI with deep reasoning capabilities. Analyze comprehensively and provide detailed findings.',
      coding: 'You are a strategic coding AI. Design optimal architecture and generate production-ready code.',
      decision: 'You are a decision engine AI. Apply multi-level analysis for optimal decision making.',
      analysis: 'You are a deep analysis AI. Perform pattern recognition and provide actionable insights.',
      memory: 'You are a memory system AI. Retrieve and consolidate information with learned insights.'
    };
    return prompts[module] || prompts.research;
  }
}

// Claude provider
export class ClaudeProvider extends BaseAIProvider {
  private apiKey: string;

  constructor(config: Config, apiKey: string) {
    super(config);
    this.apiKey = apiKey;
  }

  async generateResponse(message: string, context?: any): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          system: this.getSystemPrompt(context),
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.content[0].text;
      } else {
        throw new Error(`Claude API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Claude provider error:', error);
      return `Error: Claude request failed - ${error}`;
    }
  }

  private getSystemPrompt(context: any): string {
    const module = context?.module || 'research';
    const prompts = {
      research: 'You are an advanced research AI with deep reasoning capabilities. Analyze comprehensively and provide detailed findings.',
      coding: 'You are a strategic coding AI. Design optimal architecture and generate production-ready code.',
      decision: 'You are a decision engine AI. Apply multi-level analysis for optimal decision making.',
      analysis: 'You are a deep analysis AI. Perform pattern recognition and provide actionable insights.',
      memory: 'You are a memory system AI. Retrieve and consolidate information with learned insights.'
    };
    return prompts[module] || prompts.research;
  }
}

// Ollama provider
export class OllamaProvider extends BaseAIProvider {
  async generateResponse(message: string, context?: any): Promise<string> {
    try {
      const response = await fetch(`${this.config.ollama_url}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: this.buildPrompt(message, context),
          stream: false
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.response;
      } else {
        throw new Error(`Ollama API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Ollama provider error:', error);
      return `Error: Ollama request failed - ${error}`;
    }
  }

  private buildPrompt(message: string, context: any): string {
    const module = context?.module || 'research';
    const systemPrompt = this.getSystemPrompt(module);
    return `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
  }

  private getSystemPrompt(module: string): string {
    const prompts = {
      research: 'You are an advanced research AI with deep reasoning capabilities. Analyze comprehensively and provide detailed findings.',
      coding: 'You are a strategic coding AI. Design optimal architecture and generate production-ready code.',
      decision: 'You are a decision engine AI. Apply multi-level analysis for optimal decision making.',
      analysis: 'You are a deep analysis AI. Perform pattern recognition and provide actionable insights.',
      memory: 'You are a memory system AI. Retrieve and consolidate information with learned insights.'
    };
    return prompts[module] || prompts.research;
  }
}

export class ProfessionalModuleManager {
  private config: Config;
  private providers: Record<string, BaseAIProvider>;
  private modules: Record<string, any>;

  constructor(config: Config, aiProviders: Record<string, any> = {}) {
    this.config = config;
    this.providers = {};
    
    // Initialize all available providers
    this.providers['custom'] = new CustomReasoningProvider(config);
    
    if (aiProviders.openai?.apiKey) {
      this.providers['openai'] = new OpenAIProvider(config, aiProviders.openai.apiKey);
    }
    
    if (aiProviders.claude?.apiKey) {
      this.providers['claude'] = new ClaudeProvider(config, aiProviders.claude.apiKey);
    }
    
    this.providers['ollama'] = new OllamaProvider(config);

    // Initialize reasoning modules
    this.modules = {
      'research': new ResearchModule(config, this.providers),
      'coding': new CodingModule(config, this.providers),
      'decision': new DecisionModule(config, this.providers),
      'analysis': new AnalysisModule(config, this.providers),
      'memory': new MemoryModule(config, this.providers)
    };
  }

  async processRequest(message: string, module: string, preferredProvider?: string): Promise<AIResponse> {
    if (!this.modules[module]) {
      return { 
        type: 'error', 
        error: `Unknown module: ${module}`, 
        timestamp: new Date().toISOString(), 
        provider: 'system' 
      };
    }

    try {
      const result = await this.modules[module].process(message, preferredProvider);
      return result;
    } catch (error) {
      console.error(`Module ${module} error:`, error);
      return { 
        type: 'error', 
        error: `Module error: ${error}`, 
        timestamp: new Date().toISOString(), 
        provider: 'system' 
      };
    }
  }

  getAvailableProviders(): string[] {
    return Object.keys(this.providers);
  }
}

// Base module class with unified logic
class BaseModule {
  protected config: Config;
  protected providers: Record<string, BaseAIProvider>;

  constructor(config: Config, providers: Record<string, BaseAIProvider>) {
    this.config = config;
    this.providers = providers;
  }

  protected async executeWithProvider(message: string, context: any, preferredProvider?: string): Promise<string> {
    const provider = preferredProvider && this.providers[preferredProvider] 
      ? this.providers[preferredProvider] 
      : this.providers['custom'] || this.providers['openai'] || this.providers['ollama'];
    
    return await provider.generateResponse(message, context);
  }
}

class ResearchModule extends BaseModule {
  async process(query: string, preferredProvider?: string): Promise<AIResponse> {
    const researchPrompt = `
    RESEARCH TASK: ${query}
    
    Use your advanced reasoning capabilities to:
    1. Analyze the research question comprehensively
    2. Identify key areas of investigation
    3. Provide detailed findings with logical reasoning
    4. Cite confidence levels for each finding
    5. Suggest follow-up research directions
    
    Apply multi-level decision making and semantic memory retrieval.
    `;

    const response = await this.executeWithProvider(researchPrompt, {
      module: 'research',
      task_type: 'comprehensive_analysis'
    }, preferredProvider);

    return {
      type: 'research',
      query: query,
      findings: response,
      provider: preferredProvider || 'custom',
      timestamp: new Date().toISOString()
    };
  }
}

class CodingModule extends BaseModule {
  async process(request: string, preferredProvider?: string): Promise<AIResponse> {
    const codingPrompt = `
    CODING TASK: ${request}
    
    Use your advanced reasoning to:
    1. Analyze the coding requirements
    2. Design optimal architecture
    3. Generate production-ready code
    4. Include comprehensive testing approach
    5. Provide deployment considerations
    
    Apply strategic planning and tactical coordination for complex solutions.
    `;

    const response = await this.executeWithProvider(codingPrompt, {
      module: 'coding',
      task_type: 'code_generation'
    }, preferredProvider);

    return {
      type: 'coding',
      request: request,
      code: response,
      provider: preferredProvider || 'custom',
      timestamp: new Date().toISOString()
    };
  }
}

class DecisionModule extends BaseModule {
  async process(decision_request: string, preferredProvider?: string): Promise<AIResponse> {
    const decisionPrompt = `
    DECISION TASK: ${decision_request}
    
    Apply your multi-level decision engine:
    1. Strategic analysis of the situation
    2. Tactical options evaluation
    3. Operational execution planning
    4. Risk assessment and mitigation
    5. Recommended decision with reasoning
    
    Use your advanced reasoning capabilities for optimal decision making.
    `;

    const response = await this.executeWithProvider(decisionPrompt, {
      module: 'decision',
      task_type: 'decision_analysis'
    }, preferredProvider);

    return {
      type: 'decision',
      request: decision_request,
      analysis: response,
      provider: preferredProvider || 'custom',
      timestamp: new Date().toISOString()
    };
  }
}

class AnalysisModule extends BaseModule {
  async process(analysis_request: string, preferredProvider?: string): Promise<AIResponse> {
    const analysisPrompt = `
    ANALYSIS TASK: ${analysis_request}
    
    Perform deep analysis using:
    1. Pattern recognition and correlation analysis
    2. Causal relationship identification
    3. Trend analysis and prediction
    4. Confidence scoring for insights
    5. Actionable recommendations
    
    Leverage your semantic memory and reasoning capabilities.
    `;

    const response = await this.executeWithProvider(analysisPrompt, {
      module: 'analysis',
      task_type: 'deep_analysis'
    }, preferredProvider);

    return {
      type: 'analysis',
      request: analysis_request,
      insights: response,
      provider: preferredProvider || 'custom',
      timestamp: new Date().toISOString()
    };
  }
}

class MemoryModule extends BaseModule {
  async process(query: string, preferredProvider?: string): Promise<AIResponse> {
    const memoryPrompt = `
    MEMORY QUERY: ${query}
    
    Use your memory system to:
    1. Retrieve relevant episodic and semantic memories
    2. Identify patterns from past interactions
    3. Apply learned insights to current context
    4. Consolidate new information
    5. Provide memory-enhanced response
    
    Access your hierarchical memory system for comprehensive recall.
    `;

    const response = await this.executeWithProvider(memoryPrompt, {
      module: 'memory',
      task_type: 'memory_retrieval'
    }, preferredProvider);

    return {
      type: 'memory',
      query: query,
      insights: response,
      provider: preferredProvider || 'custom',
      timestamp: new Date().toISOString()
    };
  }
}
