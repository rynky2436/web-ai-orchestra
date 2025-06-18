"""
AI Core Routes - Main AI processing and decision-making endpoints
"""
from flask import Blueprint, request, jsonify
import json
import time
from datetime import datetime

ai_bp = Blueprint('ai', __name__)

class AIDecisionEngine:
    """
    Multi-level decision making system that mimics advanced AI reasoning
    """
    def __init__(self):
        self.context_memory = []
        self.decision_history = []
        
    def analyze_request(self, user_input, context=None):
        """
        Analyze user request and determine appropriate response strategy
        """
        analysis = {
            "intent": self._classify_intent(user_input),
            "complexity": self._assess_complexity(user_input),
            "required_modules": self._identify_modules(user_input),
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

# Global AI engine instance
ai_engine = AIDecisionEngine()

@ai_bp.route('/chat', methods=['POST'])
def ai_chat():
    """
    Main AI chat endpoint with intelligent response generation
    """
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        context = data.get('context', {})
        
        if not user_message:
            return jsonify({"error": "Message is required"}), 400
        
        # Analyze the request
        analysis = ai_engine.analyze_request(user_message, context)
        
        # Generate intelligent response based on analysis
        response = generate_ai_response(user_message, analysis)
        
        return jsonify({
            "response": response,
            "analysis": analysis,
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

@ai_bp.route('/context', methods=['GET'])
def get_context():
    """
    Get current AI context and memory
    """
    return jsonify({
        "context_memory": ai_engine.context_memory[-10:],  # Last 10 interactions
        "decision_history": ai_engine.decision_history[-5:],  # Last 5 decisions
        "memory_size": len(ai_engine.context_memory)
    })

def generate_ai_response(user_message, analysis):
    """
    Generate intelligent AI response based on analysis
    """
    intent = analysis.get("intent", "general_chat")
    complexity = analysis.get("complexity", "low")
    modules = analysis.get("required_modules", [])
    
    # Base response templates
    responses = {
        "coding": f"I understand you want to work on coding. Based on my analysis, this appears to be a {complexity} complexity task. I'll engage the coding agent module to help you build what you need.",
        
        "browsing": f"I can help you with web browsing and automation. This looks like a {complexity} complexity task. I'll use the browser automation module to assist you.",
        
        "file_management": f"I'll help you organize and manage your files. This appears to be a {complexity} complexity task. The file manager module will handle this efficiently.",
        
        "research": f"I'll conduct thorough research for you. This is a {complexity} complexity research task. I'll use the research system to gather comprehensive information.",
        
        "general_chat": f"I understand your request. This appears to be a {complexity} complexity task. I'm ready to help you with whatever you need."
    }
    
    base_response = responses.get(intent, responses["general_chat"])
    
    # Add module information if modules are identified
    if modules:
        module_text = ", ".join(modules)
        base_response += f" I'll be using these modules: {module_text}."
    
    # Add intelligent context
    base_response += " I'm analyzing your request using my multi-level decision engine and will provide the most effective solution."
    
    return base_response

