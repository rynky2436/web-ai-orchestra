"""
AI Desktop System - Learning System Module

This module implements adaptive learning capabilities that enable the AI system
to improve its performance over time through experience and feedback.

Author: Manus AI
Date: June 17, 2025
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import json
import uuid
import numpy as np
from collections import defaultdict, deque


class LearningType(Enum):
    """Types of learning"""
    REINFORCEMENT = "reinforcement"
    SUPERVISED = "supervised"
    UNSUPERVISED = "unsupervised"
    IMITATION = "imitation"
    META_LEARNING = "meta_learning"


class FeedbackType(Enum):
    """Types of feedback"""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    CORRECTIVE = "corrective"


@dataclass
class LearningEvent:
    """Represents a learning event"""
    id: str
    event_type: str
    context: Dict[str, Any]
    action_taken: Dict[str, Any]
    outcome: Dict[str, Any]
    feedback: Optional[Dict[str, Any]] = None
    timestamp: datetime = field(default_factory=datetime.now)
    importance: float = 0.5
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'event_type': self.event_type,
            'context': self.context,
            'action_taken': self.action_taken,
            'outcome': self.outcome,
            'feedback': self.feedback,
            'timestamp': self.timestamp.isoformat(),
            'importance': self.importance
        }


@dataclass
class LearningPattern:
    """Represents a learned pattern"""
    id: str
    pattern_type: str
    conditions: Dict[str, Any]
    recommended_action: Dict[str, Any]
    confidence: float
    success_rate: float
    usage_count: int = 0
    last_used: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'pattern_type': self.pattern_type,
            'conditions': self.conditions,
            'recommended_action': self.recommended_action,
            'confidence': self.confidence,
            'success_rate': self.success_rate,
            'usage_count': self.usage_count,
            'last_used': self.last_used.isoformat() if self.last_used else None,
            'created_at': self.created_at.isoformat()
        }


class LearningAlgorithm(ABC):
    """Abstract base class for learning algorithms"""
    
    def __init__(self, algorithm_name: str):
        self.algorithm_name = algorithm_name
        self.logger = logging.getLogger(f"LearningAlgorithm.{algorithm_name}")
    
    @abstractmethod
    async def learn_from_event(self, event: LearningEvent) -> List[LearningPattern]:
        """Learn from a single event"""
        pass
    
    @abstractmethod
    async def update_patterns(self, patterns: List[LearningPattern], event: LearningEvent) -> List[LearningPattern]:
        """Update existing patterns based on new event"""
        pass
    
    @abstractmethod
    async def predict_action(self, context: Dict[str, Any], patterns: List[LearningPattern]) -> Optional[Dict[str, Any]]:
        """Predict best action for given context"""
        pass


class ReinforcementLearning(LearningAlgorithm):
    """Reinforcement learning implementation"""
    
    def __init__(self):
        super().__init__("reinforcement_learning")
        self.q_table: Dict[str, Dict[str, float]] = defaultdict(lambda: defaultdict(float))
        self.learning_rate = 0.1
        self.discount_factor = 0.9
        self.exploration_rate = 0.1
    
    async def learn_from_event(self, event: LearningEvent) -> List[LearningPattern]:
        """Learn from reinforcement learning event"""
        patterns = []
        
        # Extract state, action, and reward
        state = self._extract_state(event.context)
        action = self._extract_action(event.action_taken)
        reward = self._extract_reward(event.outcome, event.feedback)
        
        # Update Q-table
        current_q = self.q_table[state][action]
        
        # Q-learning update rule
        max_future_q = max(self.q_table[state].values()) if self.q_table[state] else 0
        new_q = current_q + self.learning_rate * (reward + self.discount_factor * max_future_q - current_q)
        
        self.q_table[state][action] = new_q
        
        # Create learning pattern if Q-value is significant
        if abs(new_q) > 0.1:
            pattern = LearningPattern(
                id=f"rl_pattern_{uuid.uuid4().hex[:8]}",
                pattern_type="reinforcement",
                conditions={"state": state},
                recommended_action={"action": action, "q_value": new_q},
                confidence=min(1.0, abs(new_q)),
                success_rate=max(0.0, new_q),
                usage_count=1
            )
            patterns.append(pattern)
        
        return patterns
    
    async def update_patterns(self, patterns: List[LearningPattern], event: LearningEvent) -> List[LearningPattern]:
        """Update reinforcement learning patterns"""
        state = self._extract_state(event.context)
        action = self._extract_action(event.action_taken)
        reward = self._extract_reward(event.outcome, event.feedback)
        
        updated_patterns = []
        
        for pattern in patterns:
            if (pattern.pattern_type == "reinforcement" and 
                pattern.conditions.get("state") == state and
                pattern.recommended_action.get("action") == action):
                
                # Update pattern based on new experience
                old_success_rate = pattern.success_rate
                old_usage_count = pattern.usage_count
                
                # Update success rate with exponential moving average
                alpha = 0.1
                new_success_rate = (1 - alpha) * old_success_rate + alpha * max(0.0, reward)
                
                pattern.success_rate = new_success_rate
                pattern.usage_count += 1
                pattern.last_used = datetime.now()
                pattern.confidence = min(1.0, pattern.usage_count / 10.0)
                
                updated_patterns.append(pattern)
            else:
                updated_patterns.append(pattern)
        
        return updated_patterns
    
    async def predict_action(self, context: Dict[str, Any], patterns: List[LearningPattern]) -> Optional[Dict[str, Any]]:
        """Predict best action using reinforcement learning"""
        state = self._extract_state(context)
        
        # Find relevant patterns
        relevant_patterns = [
            p for p in patterns 
            if p.pattern_type == "reinforcement" and p.conditions.get("state") == state
        ]
        
        if not relevant_patterns:
            return None
        
        # Select action with highest Q-value (exploitation) or random (exploration)
        if np.random.random() < self.exploration_rate:
            # Exploration: random action
            pattern = np.random.choice(relevant_patterns)
        else:
            # Exploitation: best action
            pattern = max(relevant_patterns, key=lambda p: p.recommended_action.get("q_value", 0))
        
        return {
            "action": pattern.recommended_action.get("action"),
            "confidence": pattern.confidence,
            "reasoning": f"Reinforcement learning (Q-value: {pattern.recommended_action.get('q_value', 0):.3f})"
        }
    
    def _extract_state(self, context: Dict[str, Any]) -> str:
        """Extract state representation from context"""
        # Simplified state extraction - in practice, use feature engineering
        key_features = ["task_type", "user_intent", "available_tools", "time_constraint"]
        state_parts = []
        
        for feature in key_features:
            value = context.get(feature, "unknown")
            if isinstance(value, list):
                value = ",".join(str(v) for v in value[:3])  # Limit list size
            state_parts.append(f"{feature}:{value}")
        
        return "|".join(state_parts)
    
    def _extract_action(self, action_taken: Dict[str, Any]) -> str:
        """Extract action representation"""
        action_type = action_taken.get("type", "unknown")
        action_params = action_taken.get("parameters", {})
        
        # Create simplified action representation
        param_str = ",".join(f"{k}:{v}" for k, v in list(action_params.items())[:3])
        return f"{action_type}({param_str})"
    
    def _extract_reward(self, outcome: Dict[str, Any], feedback: Optional[Dict[str, Any]]) -> float:
        """Extract reward signal from outcome and feedback"""
        reward = 0.0
        
        # Outcome-based reward
        if outcome.get("success", False):
            reward += 1.0
        else:
            reward -= 0.5
        
        # Performance-based reward
        execution_time = outcome.get("execution_time", 0)
        if execution_time > 0:
            # Reward faster execution (normalized)
            time_reward = max(-0.5, 1.0 - (execution_time / 60.0))  # 60 seconds baseline
            reward += time_reward * 0.3
        
        # Quality-based reward
        quality_score = outcome.get("quality_score", 0.5)
        reward += (quality_score - 0.5) * 0.5
        
        # Feedback-based reward
        if feedback:
            feedback_type = feedback.get("type", "neutral")
            if feedback_type == "positive":
                reward += 0.5
            elif feedback_type == "negative":
                reward -= 0.5
            elif feedback_type == "corrective":
                reward -= 0.2
        
        return np.clip(reward, -2.0, 2.0)


class PatternRecognition(LearningAlgorithm):
    """Pattern recognition and unsupervised learning"""
    
    def __init__(self):
        super().__init__("pattern_recognition")
        self.pattern_clusters: Dict[str, List[LearningEvent]] = defaultdict(list)
        self.similarity_threshold = 0.7
    
    async def learn_from_event(self, event: LearningEvent) -> List[LearningPattern]:
        """Learn patterns from events"""
        patterns = []
        
        # Find similar events
        similar_events = await self._find_similar_events(event)
        
        if len(similar_events) >= 3:  # Minimum cluster size
            # Create or update pattern
            pattern = await self._create_pattern_from_cluster(similar_events + [event])
            if pattern:
                patterns.append(pattern)
        
        # Add event to appropriate cluster
        cluster_key = self._get_cluster_key(event)
        self.pattern_clusters[cluster_key].append(event)
        
        # Limit cluster size
        if len(self.pattern_clusters[cluster_key]) > 100:
            self.pattern_clusters[cluster_key] = self.pattern_clusters[cluster_key][-100:]
        
        return patterns
    
    async def update_patterns(self, patterns: List[LearningPattern], event: LearningEvent) -> List[LearningPattern]:
        """Update patterns based on new event"""
        updated_patterns = []
        
        for pattern in patterns:
            if pattern.pattern_type == "pattern_recognition":
                # Check if event matches pattern conditions
                if self._matches_pattern_conditions(event, pattern.conditions):
                    # Update pattern statistics
                    pattern.usage_count += 1
                    pattern.last_used = datetime.now()
                    
                    # Update success rate based on outcome
                    success = event.outcome.get("success", False)
                    alpha = 0.1
                    pattern.success_rate = (1 - alpha) * pattern.success_rate + alpha * (1.0 if success else 0.0)
                    
                    # Update confidence based on usage
                    pattern.confidence = min(1.0, pattern.usage_count / 20.0)
            
            updated_patterns.append(pattern)
        
        return updated_patterns
    
    async def predict_action(self, context: Dict[str, Any], patterns: List[LearningPattern]) -> Optional[Dict[str, Any]]:
        """Predict action based on recognized patterns"""
        # Find patterns that match current context
        matching_patterns = []
        
        for pattern in patterns:
            if pattern.pattern_type == "pattern_recognition":
                match_score = self._calculate_context_match(context, pattern.conditions)
                if match_score > 0.6:
                    matching_patterns.append((pattern, match_score))
        
        if not matching_patterns:
            return None
        
        # Select best matching pattern
        best_pattern, match_score = max(matching_patterns, key=lambda x: x[1] * x[0].confidence)
        
        return {
            "action": best_pattern.recommended_action,
            "confidence": best_pattern.confidence * match_score,
            "reasoning": f"Pattern recognition (match: {match_score:.3f}, pattern confidence: {best_pattern.confidence:.3f})"
        }
    
    async def _find_similar_events(self, target_event: LearningEvent) -> List[LearningEvent]:
        """Find events similar to target event"""
        similar_events = []
        
        for cluster_events in self.pattern_clusters.values():
            for event in cluster_events:
                similarity = self._calculate_event_similarity(target_event, event)
                if similarity > self.similarity_threshold:
                    similar_events.append(event)
        
        return similar_events
    
    def _calculate_event_similarity(self, event1: LearningEvent, event2: LearningEvent) -> float:
        """Calculate similarity between two events"""
        similarity = 0.0
        
        # Event type similarity
        if event1.event_type == event2.event_type:
            similarity += 0.3
        
        # Context similarity
        context_sim = self._calculate_context_similarity(event1.context, event2.context)
        similarity += context_sim * 0.4
        
        # Action similarity
        action_sim = self._calculate_action_similarity(event1.action_taken, event2.action_taken)
        similarity += action_sim * 0.3
        
        return similarity
    
    def _calculate_context_similarity(self, context1: Dict[str, Any], context2: Dict[str, Any]) -> float:
        """Calculate similarity between contexts"""
        if not context1 or not context2:
            return 0.0
        
        common_keys = set(context1.keys()) & set(context2.keys())
        if not common_keys:
            return 0.0
        
        matches = 0
        for key in common_keys:
            if context1[key] == context2[key]:
                matches += 1
        
        return matches / len(common_keys)
    
    def _calculate_action_similarity(self, action1: Dict[str, Any], action2: Dict[str, Any]) -> float:
        """Calculate similarity between actions"""
        if action1.get("type") == action2.get("type"):
            return 0.8  # Same action type
        return 0.0
    
    async def _create_pattern_from_cluster(self, events: List[LearningEvent]) -> Optional[LearningPattern]:
        """Create a pattern from a cluster of similar events"""
        if len(events) < 3:
            return None
        
        # Extract common conditions
        common_conditions = self._extract_common_conditions(events)
        
        # Determine most successful action
        action_outcomes = defaultdict(list)
        for event in events:
            action_key = str(event.action_taken)
            success = event.outcome.get("success", False)
            action_outcomes[action_key].append(success)
        
        # Find action with highest success rate
        best_action = None
        best_success_rate = 0.0
        
        for action_key, outcomes in action_outcomes.items():
            success_rate = sum(outcomes) / len(outcomes)
            if success_rate > best_success_rate:
                best_success_rate = success_rate
                best_action = eval(action_key)  # Convert back to dict (simplified)
        
        if best_action and best_success_rate > 0.5:
            pattern = LearningPattern(
                id=f"pattern_{uuid.uuid4().hex[:8]}",
                pattern_type="pattern_recognition",
                conditions=common_conditions,
                recommended_action=best_action,
                confidence=min(1.0, len(events) / 10.0),
                success_rate=best_success_rate,
                usage_count=len(events)
            )
            return pattern
        
        return None
    
    def _extract_common_conditions(self, events: List[LearningEvent]) -> Dict[str, Any]:
        """Extract common conditions from events"""
        if not events:
            return {}
        
        # Find keys that appear in most events
        key_counts = defaultdict(int)
        for event in events:
            for key in event.context.keys():
                key_counts[key] += 1
        
        # Keep keys that appear in at least 70% of events
        threshold = len(events) * 0.7
        common_keys = [key for key, count in key_counts.items() if count >= threshold]
        
        # Extract common values
        common_conditions = {}
        for key in common_keys:
            values = [event.context.get(key) for event in events if key in event.context]
            # If all values are the same, include in conditions
            if len(set(str(v) for v in values)) == 1:
                common_conditions[key] = values[0]
        
        return common_conditions
    
    def _get_cluster_key(self, event: LearningEvent) -> str:
        """Get cluster key for event"""
        # Simple clustering based on event type and key context features
        key_features = ["task_type", "user_intent"]
        cluster_parts = [event.event_type]
        
        for feature in key_features:
            value = event.context.get(feature, "unknown")
            cluster_parts.append(f"{feature}:{value}")
        
        return "|".join(cluster_parts)
    
    def _matches_pattern_conditions(self, event: LearningEvent, conditions: Dict[str, Any]) -> bool:
        """Check if event matches pattern conditions"""
        for key, expected_value in conditions.items():
            if event.context.get(key) != expected_value:
                return False
        return True
    
    def _calculate_context_match(self, context: Dict[str, Any], conditions: Dict[str, Any]) -> float:
        """Calculate how well context matches pattern conditions"""
        if not conditions:
            return 0.0
        
        matches = 0
        for key, expected_value in conditions.items():
            if context.get(key) == expected_value:
                matches += 1
        
        return matches / len(conditions)


class LearningSystem:
    """Main learning system that coordinates all learning activities"""
    
    def __init__(self):
        self.logger = logging.getLogger("LearningSystem")
        
        # Initialize learning algorithms
        self.algorithms = {
            LearningType.REINFORCEMENT: ReinforcementLearning(),
            LearningType.UNSUPERVISED: PatternRecognition()
        }
        
        # Storage for learning data
        self.learning_events: deque = deque(maxlen=10000)
        self.learned_patterns: List[LearningPattern] = []
        self.performance_metrics = {
            "total_events": 0,
            "patterns_learned": 0,
            "successful_predictions": 0,
            "total_predictions": 0
        }
    
    async def record_learning_event(self, event_type: str, context: Dict[str, Any], 
                                  action_taken: Dict[str, Any], outcome: Dict[str, Any],
                                  feedback: Optional[Dict[str, Any]] = None) -> str:
        """Record a learning event"""
        event = LearningEvent(
            id=f"event_{uuid.uuid4().hex[:8]}",
            event_type=event_type,
            context=context,
            action_taken=action_taken,
            outcome=outcome,
            feedback=feedback,
            importance=self._calculate_event_importance(outcome, feedback)
        )
        
        # Store event
        self.learning_events.append(event)
        self.performance_metrics["total_events"] += 1
        
        # Learn from event
        await self._learn_from_event(event)
        
        self.logger.info(f"Recorded learning event: {event.id}")
        return event.id
    
    async def _learn_from_event(self, event: LearningEvent):
        """Learn from a single event using all applicable algorithms"""
        new_patterns = []
        
        # Apply each learning algorithm
        for learning_type, algorithm in self.algorithms.items():
            try:
                patterns = await algorithm.learn_from_event(event)
                new_patterns.extend(patterns)
                
                # Update existing patterns
                self.learned_patterns = await algorithm.update_patterns(self.learned_patterns, event)
                
            except Exception as e:
                self.logger.error(f"Learning algorithm {learning_type.value} failed: {str(e)}")
        
        # Add new patterns
        self.learned_patterns.extend(new_patterns)
        self.performance_metrics["patterns_learned"] += len(new_patterns)
        
        # Prune old or low-confidence patterns
        await self._prune_patterns()
    
    async def predict_best_action(self, context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Predict the best action for given context"""
        predictions = []
        
        # Get predictions from all algorithms
        for learning_type, algorithm in self.algorithms.items():
            try:
                prediction = await algorithm.predict_action(context, self.learned_patterns)
                if prediction:
                    prediction["algorithm"] = learning_type.value
                    predictions.append(prediction)
            except Exception as e:
                self.logger.error(f"Prediction from {learning_type.value} failed: {str(e)}")
        
        self.performance_metrics["total_predictions"] += 1
        
        if not predictions:
            return None
        
        # Select best prediction based on confidence
        best_prediction = max(predictions, key=lambda p: p.get("confidence", 0))
        
        self.logger.info(f"Predicted action: {best_prediction['action']} (confidence: {best_prediction['confidence']:.3f})")
        return best_prediction
    
    async def provide_feedback(self, event_id: str, feedback_type: FeedbackType, 
                             feedback_data: Optional[Dict[str, Any]] = None):
        """Provide feedback on a learning event"""
        # Find the event
        target_event = None
        for event in self.learning_events:
            if event.id == event_id:
                target_event = event
                break
        
        if not target_event:
            self.logger.warning(f"Event {event_id} not found for feedback")
            return
        
        # Update event with feedback
        feedback = {
            "type": feedback_type.value,
            "data": feedback_data or {},
            "timestamp": datetime.now().isoformat()
        }
        target_event.feedback = feedback
        
        # Re-learn from event with feedback
        await self._learn_from_event(target_event)
        
        self.logger.info(f"Provided feedback for event {event_id}: {feedback_type.value}")
    
    def _calculate_event_importance(self, outcome: Dict[str, Any], feedback: Optional[Dict[str, Any]]) -> float:
        """Calculate importance score for an event"""
        importance = 0.5  # Base importance
        
        # Outcome-based importance
        if outcome.get("success", False):
            importance += 0.2
        else:
            importance += 0.3  # Failures are often more informative
        
        # Performance-based importance
        quality_score = outcome.get("quality_score", 0.5)
        importance += (abs(quality_score - 0.5)) * 0.2  # Extreme scores are more important
        
        # Feedback-based importance
        if feedback:
            feedback_type = feedback.get("type", "neutral")
            if feedback_type in ["positive", "negative", "corrective"]:
                importance += 0.2
        
        # Novelty-based importance (simplified)
        execution_time = outcome.get("execution_time", 0)
        if execution_time > 0:
            # Unusual execution times might indicate novel situations
            if execution_time < 1 or execution_time > 60:
                importance += 0.1
        
        return min(1.0, importance)
    
    async def _prune_patterns(self):
        """Remove old or low-confidence patterns"""
        # Remove patterns with very low confidence
        min_confidence = 0.1
        self.learned_patterns = [p for p in self.learned_patterns if p.confidence >= min_confidence]
        
        # Remove patterns that haven't been used recently
        cutoff_date = datetime.now() - timedelta(days=30)
        self.learned_patterns = [
            p for p in self.learned_patterns 
            if p.last_used is None or p.last_used > cutoff_date or p.usage_count > 10
        ]
        
        # Limit total number of patterns
        max_patterns = 1000
        if len(self.learned_patterns) > max_patterns:
            # Keep patterns with highest confidence and usage
            self.learned_patterns.sort(key=lambda p: p.confidence * p.usage_count, reverse=True)
            self.learned_patterns = self.learned_patterns[:max_patterns]
    
    def get_learning_stats(self) -> Dict[str, Any]:
        """Get learning system statistics"""
        stats = self.performance_metrics.copy()
        
        # Add pattern statistics
        stats["active_patterns"] = len(self.learned_patterns)
        
        if self.learned_patterns:
            stats["average_pattern_confidence"] = sum(p.confidence for p in self.learned_patterns) / len(self.learned_patterns)
            stats["average_pattern_success_rate"] = sum(p.success_rate for p in self.learned_patterns) / len(self.learned_patterns)
        else:
            stats["average_pattern_confidence"] = 0.0
            stats["average_pattern_success_rate"] = 0.0
        
        # Calculate prediction accuracy
        if stats["total_predictions"] > 0:
            stats["prediction_accuracy"] = stats["successful_predictions"] / stats["total_predictions"]
        else:
            stats["prediction_accuracy"] = 0.0
        
        # Pattern type distribution
        pattern_types = defaultdict(int)
        for pattern in self.learned_patterns:
            pattern_types[pattern.pattern_type] += 1
        stats["pattern_distribution"] = dict(pattern_types)
        
        return stats
    
    def get_recent_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent learning events"""
        recent_events = list(self.learning_events)[-limit:]
        return [event.to_dict() for event in recent_events]
    
    def get_learned_patterns(self, pattern_type: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Get learned patterns"""
        patterns = self.learned_patterns
        
        if pattern_type:
            patterns = [p for p in patterns if p.pattern_type == pattern_type]
        
        # Sort by confidence and usage
        patterns.sort(key=lambda p: p.confidence * p.usage_count, reverse=True)
        
        return [pattern.to_dict() for pattern in patterns[:limit]]


# Example usage and testing
if __name__ == "__main__":
    async def test_learning_system():
        """Test the learning system"""
        system = LearningSystem()
        
        # Simulate learning events
        events = [
            {
                "event_type": "task_execution",
                "context": {"task_type": "research", "user_intent": "information_gathering", "time_constraint": "medium"},
                "action_taken": {"type": "search", "parameters": {"query": "AI agents", "limit": 10}},
                "outcome": {"success": True, "execution_time": 5.2, "quality_score": 0.8}
            },
            {
                "event_type": "task_execution", 
                "context": {"task_type": "research", "user_intent": "information_gathering", "time_constraint": "high"},
                "action_taken": {"type": "search", "parameters": {"query": "machine learning", "limit": 5}},
                "outcome": {"success": True, "execution_time": 2.1, "quality_score": 0.9}
            },
            {
                "event_type": "task_execution",
                "context": {"task_type": "analysis", "user_intent": "data_processing", "time_constraint": "low"},
                "action_taken": {"type": "analyze", "parameters": {"method": "statistical"}},
                "outcome": {"success": False, "execution_time": 15.3, "quality_score": 0.3}
            }
        ]
        
        # Record events
        event_ids = []
        for event_data in events:
            event_id = await system.record_learning_event(**event_data)
            event_ids.append(event_id)
        
        print(f"Recorded {len(event_ids)} learning events")
        
        # Provide feedback on some events
        await system.provide_feedback(event_ids[0], FeedbackType.POSITIVE, {"user_satisfaction": 0.9})
        await system.provide_feedback(event_ids[2], FeedbackType.CORRECTIVE, {"suggested_method": "machine_learning"})
        
        # Test prediction
        test_context = {
            "task_type": "research",
            "user_intent": "information_gathering", 
            "time_constraint": "medium"
        }
        
        prediction = await system.predict_best_action(test_context)
        if prediction:
            print(f"Predicted action: {prediction}")
        else:
            print("No prediction available")
        
        # Get learning statistics
        stats = system.get_learning_stats()
        print(f"Learning stats: {json.dumps(stats, indent=2)}")
        
        # Get learned patterns
        patterns = system.get_learned_patterns(limit=5)
        print(f"Learned patterns: {len(patterns)}")
        for pattern in patterns:
            print(f"- {pattern['pattern_type']}: confidence={pattern['confidence']:.3f}, success_rate={pattern['success_rate']:.3f}")
    
    # Run test
    asyncio.run(test_learning_system())

