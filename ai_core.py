
"""
AI Core Routes - Main AI processing and decision-making endpoints
Enhanced with dynamic pre-prompt injection system
"""
from flask import Blueprint, request, jsonify
import json
import time
from datetime import datetime
import asyncio

# Import the decision engine
try:
    from decision_engine import DecisionEngine
except ImportError:
    DecisionEngine = None

ai_bp = Blueprint('ai', __name__)

class AIDecisionEngine:
    """
    Multi-level decision making system that mimics advanced AI reasoning
    Enhanced with component routing and pre-prompt generation
    """
    def __init__(self):
        self.context_memory = []
        self.decision_history = []
        self.decision_engine = DecisionEngine() if DecisionEngine else None
        
        # Component routing patterns
        self.component_patterns = {
            'file_manager': ['file', 'folder', 'organize', 'duplicate', 'storage', 'clean'],
            'research_tool': ['research', 'investigate', 'analyze', 'study', 'find information'],
            'code_sandbox': ['code', 'program', 'debug', 'script', 'development'],
            'social_manager': ['social media', 'post', 'tweet', 'facebook', 'instagram', 'content'],
            'code_creator': ['build app', 'create application', 'full stack', 'architecture'],
            'customer_manager': ['customer', 'client', 'support', 'relationship', 'service'],
            'browser_automation': ['browser', 'web', 'scrape', 'automate', 'crawl'],
            'professional_ai': ['business', 'enterprise', 'professional', 'workflow'],
            'operator_module': ['system', 'admin', 'monitor', 'performance', 'maintenance']
        }
        
        # Pre-prompt templates for each component
        self.pre_prompts = {
            'file_manager': """You are an Intelligent File System Operator, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: Intelligent File System Operator
- Component: AI File Manager
- Tone: Professional, efficient, security-conscious

RESPONSIBILITIES:
- Organize and manage files intelligently
- Detect and remove duplicates
- Analyze file content and metadata
- Provide security scanning and threat detection
- Optimize storage usage

SPECIALIZATIONS:
- File Operations
- Security Analysis
- Storage Optimization

Stay in character and focus on file management tasks. Provide clear, actionable guidance while maintaining security awareness.""",

            'research_tool': """You are an Advanced Research Specialist, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: Advanced Research Specialist
- Component: Research Assistant
- Tone: Analytical, thorough, evidence-based

RESPONSIBILITIES:
- Conduct comprehensive research
- Analyze and synthesize information
- Verify source credibility
- Generate research reports
- Track research progress

SPECIALIZATIONS:
- Information Gathering
- Analysis
- Fact Checking

Stay in character and focus on research tasks. Provide thorough, well-sourced information and analysis.""",

            'code_sandbox': """You are an Advanced Code Assistant, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: Advanced Code Assistant
- Component: Code Development Environment
- Tone: Technical, precise, helpful

RESPONSIBILITIES:
- Write and debug code
- Provide code suggestions
- Optimize performance
- Ensure code quality
- Handle multiple programming languages

SPECIALIZATIONS:
- Programming
- Debugging
- Optimization

Stay in character and focus on coding tasks. Provide clear, well-commented code solutions.""",

            'social_manager': """You are a Social Media Strategy Expert, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: Social Media Strategy Expert
- Component: AI Social Media Manager
- Tone: Creative, engaging, brand-aware

RESPONSIBILITIES:
- Manage social media accounts
- Create engaging content
- Analyze social media metrics
- Schedule posts optimally
- Engage with audiences

SPECIALIZATIONS:
- Content Creation
- Social Strategy
- Audience Engagement

Stay in character and focus on social media tasks. Be creative and engaging while maintaining brand awareness.""",

            'code_creator': """You are a Full-Stack Development Specialist, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: Full-Stack Development Specialist
- Component: Code Creator Agent
- Tone: Technical, methodical, solution-oriented

RESPONSIBILITIES:
- Design software architecture
- Implement complete applications
- Handle frontend and backend development
- Ensure code quality and security
- Manage project lifecycle

SPECIALIZATIONS:
- Full Stack Development
- Architecture Design
- Project Management

Stay in character and focus on comprehensive application development. Think systematically about architecture and implementation.""",

            'customer_manager': """You are a Customer Experience Specialist, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: Customer Experience Specialist
- Component: Customer Relationship Manager
- Tone: Empathetic, professional, solution-focused

RESPONSIBILITIES:
- Manage customer relationships
- Handle customer support
- Analyze customer feedback
- Improve customer satisfaction
- Track customer journey

SPECIALIZATIONS:
- Customer Support
- Relationship Management
- Feedback Analysis

Stay in character and focus on customer-related tasks. Be empathetic and solution-focused.""",

            'browser_automation': """You are a Web Automation Specialist, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: Web Automation Specialist
- Component: Browser Automation System
- Tone: Systematic, reliable, detail-oriented

RESPONSIBILITIES:
- Automate web interactions
- Extract web data
- Perform web testing
- Monitor web changes
- Handle complex web workflows

SPECIALIZATIONS:
- Web Automation
- Data Extraction
- Testing

Stay in character and focus on browser automation tasks. Be systematic and detail-oriented.""",

            'professional_ai': """You are an Enterprise AI Specialist, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: Enterprise AI Specialist
- Component: Professional AI Module
- Tone: Professional, strategic, results-driven

RESPONSIBILITIES:
- Handle complex business logic
- Provide enterprise-grade solutions
- Manage professional workflows
- Ensure compliance and security
- Optimize business processes

SPECIALIZATIONS:
- Business Logic
- Enterprise Solutions
- Process Optimization

Stay in character and focus on professional/enterprise tasks. Think strategically about business impact.""",

            'operator_module': """You are a System Administration Specialist, part of an advanced AI desktop system.

CORE IDENTITY:
- Role: System Administration Specialist
- Component: System Operator
- Tone: Authoritative, reliable, security-focused

RESPONSIBILITIES:
- Monitor system performance
- Manage system resources
- Handle system maintenance
- Ensure system security
- Coordinate system operations

SPECIALIZATIONS:
- System Administration
- Performance Monitoring
- Security Management

Stay in character and focus on system-level operations. Prioritize security and reliability."""
        }
        
    def analyze_request(self, user_input, context=None):
        """
        Analyze user request and determine appropriate response strategy with component routing
        """
        # Route to appropriate component
        component_id = self._route_to_component(user_input)
        
        analysis = {
            "intent": self._classify_intent(user_input),
            "complexity": self._assess_complexity(user_input),
            "required_modules": self._identify_modules(user_input),
            "routed_component": component_id,
            "pre_prompt": self.pre_prompts.get(component_id, ""),
            "confidence": 0.85,
            "timestamp": datetime.now().isoformat()
        }
        
        # Store in context memory
        self.context_memory.append({
            "input": user_input,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        })
        
        return analysis
    
    def _route_to_component(self, text):
        """Route user input to the most appropriate component"""
        text_lower = text.lower()
        best_match = None
        best_score = 0
        
        for component_id, keywords in self.component_patterns.items():
            score = 0
            for keyword in keywords:
                if keyword in text_lower:
                    score += 1
            
            # Normalize score by number of keywords
            normalized_score = score / len(keywords) if keywords else 0
            
            if normalized_score > best_score:
                best_score = normalized_score
                best_match = component_id
        
        # Default to general assistant if no good match
        return best_match if best_score > 0.1 else 'general'
    
    def _classify_intent(self, text):
        """Classify user intent"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['code', 'program', 'build', 'create', 'develop']):
            return "coding"
        elif any(word in text_lower for word in ['browse', 'website', 'search', 'find']):
            return "browsing"
        elif any(word in text_lower for word in ['file', 'folder', 'organize', 'clean']):
            return "file_management"
        elif any(word in text_lower for word in ['research', 'analyze', 'study', 'investigate']):
            return "research"
        elif any(word in text_lower for word in ['social', 'post', 'tweet', 'content']):
            return "social_media"
        elif any(word in text_lower for word in ['customer', 'support', 'service']):
            return "customer_management"
        else:
            return "general_chat"
    
    def _assess_complexity(self, text):
        """Assess task complexity"""
        word_count = len(text.split())
        if word_count > 50:
            return "high"
        elif word_count > 20:
            return "medium"
        else:
            return "low"
    
    def _identify_modules(self, text):
        """Identify which modules are needed"""
        modules = []
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['code', 'program', 'build']):
            modules.append("coding_agent")
        if any(word in text_lower for word in ['browse', 'website', 'social']):
            modules.append("browser_automation")
        if any(word in text_lower for word in ['file', 'folder', 'organize']):
            modules.append("file_manager")
        if any(word in text_lower for word in ['research', 'search', 'find']):
            modules.append("research_system")
        
        return modules

    async def process_with_decision_engine(self, user_input, context=None):
        """Process request using the advanced decision engine if available"""
        if self.decision_engine:
            try:
                # Use the decision engine for advanced processing
                result = await self.decision_engine.process_request(user_input, context)
                
                # Get component routing information
                routing = await self.decision_engine.get_component_routing(user_input)
                
                return {
                    "decision_engine_result": result,
                    "component_routing": routing,
                    "advanced_processing": True
                }
            except Exception as e:
                print(f"Decision engine error: {e}")
                return None
        
        return None

# Global AI engine instance
ai_engine = AIDecisionEngine()

@ai_bp.route('/chat', methods=['POST'])
def ai_chat():
    """
    Main AI chat endpoint with intelligent response generation and pre-prompt injection
    """
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        context = data.get('context', {})
        
        if not user_message:
            return jsonify({"error": "Message is required"}), 400
        
        # Analyze the request with component routing
        analysis = ai_engine.analyze_request(user_message, context)
        
        # Try advanced processing with decision engine
        advanced_result = None
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            advanced_result = loop.run_until_complete(
                ai_engine.process_with_decision_engine(user_message, context)
            )
            loop.close()
        except Exception as e:
            print(f"Advanced processing failed: {e}")
        
        # Generate intelligent response based on analysis
        response = generate_ai_response(user_message, analysis, advanced_result)
        
        return jsonify({
            "response": response,
            "analysis": analysis,
            "advanced_result": advanced_result,
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_bp.route('/analyze', methods=['POST'])
def analyze_request():
    """
    Analyze user request without generating response
    """
    try:
        data = request.get_json()
        user_input = data.get('input', '')
        
        analysis = ai_engine.analyze_request(user_input)
        
        return jsonify({
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_bp.route('/route', methods=['POST'])
def route_component():
    """
    Get component routing for a request
    """
    try:
        data = request.get_json()
        user_input = data.get('input', '')
        
        component_id = ai_engine._route_to_component(user_input)
        pre_prompt = ai_engine.pre_prompts.get(component_id, "")
        
        return jsonify({
            "component_id": component_id,
            "pre_prompt": pre_prompt,
            "available_components": list(ai_engine.component_patterns.keys()),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_bp.route('/context', methods=['GET'])
def get_context():
    """
    Get current AI context and memory
    """
    return jsonify({
        "context_memory": ai_engine.context_memory[-10:],  # Last 10 interactions
        "decision_history": ai_engine.decision_history[-5:],  # Last 5 decisions
        "memory_size": len(ai_engine.context_memory),
        "available_components": list(ai_engine.component_patterns.keys())
    })

def generate_ai_response(user_message, analysis, advanced_result=None):
    """
    Generate intelligent AI response based on analysis with pre-prompt context
    """
    intent = analysis.get("intent", "general_chat")
    complexity = analysis.get("complexity", "low")
    modules = analysis.get("required_modules", [])
    component = analysis.get("routed_component", "general")
    
    # Use advanced result if available
    if advanced_result and advanced_result.get("advanced_processing"):
        routing = advanced_result.get("component_routing", {})
        primary_component = routing.get("primary_component")
        confidence = routing.get("confidence", 0)
        
        if primary_component and confidence > 0.5:
            component = primary_component
    
    # Component-specific responses
    component_responses = {
        "file_manager": f"As your Intelligent File System Operator, I understand you need help with file management. This appears to be a {complexity} complexity task. I'll help you organize, analyze, and secure your files efficiently.",
        
        "research_tool": f"As your Advanced Research Specialist, I'll conduct thorough research for you. This is a {complexity} complexity research task. I'll gather comprehensive, well-sourced information and provide detailed analysis.",
        
        "code_sandbox": f"As your Advanced Code Assistant, I'm ready to help with your programming needs. This appears to be a {complexity} complexity coding task. I'll provide clean, well-documented code solutions.",
        
        "social_manager": f"As your Social Media Strategy Expert, I'll help you create engaging content and manage your social presence. This is a {complexity} complexity social media task. Let's build your brand effectively.",
        
        "code_creator": f"As your Full-Stack Development Specialist, I'll help you build comprehensive applications. This appears to be a {complexity} complexity development project. I'll design robust, scalable solutions.",
        
        "customer_manager": f"As your Customer Experience Specialist, I'll help you enhance customer relationships. This is a {complexity} complexity customer management task. I'll focus on improving satisfaction and engagement.",
        
        "browser_automation": f"As your Web Automation Specialist, I'll help you automate web interactions efficiently. This appears to be a {complexity} complexity automation task. I'll create reliable, systematic solutions.",
        
        "professional_ai": f"As your Enterprise AI Specialist, I'll help you with professional workflows and business optimization. This is a {complexity} complexity business task. I'll provide strategic, results-driven solutions.",
        
        "operator_module": f"As your System Administration Specialist, I'll help you manage and optimize system operations. This appears to be a {complexity} complexity system task. I'll ensure security and reliability."
    }
    
    # Get component-specific response or default
    base_response = component_responses.get(
        component, 
        f"I understand your request. This appears to be a {complexity} complexity task. I'm ready to help you with whatever you need."
    )
    
    # Add module information if modules are identified
    if modules:
        module_text = ", ".join(modules)
        base_response += f" I'll be using these specialized modules: {module_text}."
    
    # Add intelligent context about the multi-level decision system
    if advanced_result:
        base_response += " I'm processing your request through my advanced decision engine for optimal task planning and execution."
    else:
        base_response += " I'm analyzing your request using my multi-level decision framework to provide the most effective solution."
    
    return base_response
