import openai
import os
from typing import Dict, Any, List, Optional
import json

class AIService:
    def __init__(self):
        """Initialize AI service with OpenAI API key"""
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def generate_workout(self, user_profile: Dict[str, Any], fitness_goals: List[str], 
                             available_time: int, available_equipment: Optional[List[str]] = None,
                             preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate a personalized workout using OpenAI"""
        try:
            # Create prompt for workout generation
            prompt = self._create_workout_prompt(user_profile, fitness_goals, available_time, 
                                               available_equipment, preferences)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert fitness trainer and AI assistant. Generate personalized workout plans based on user profiles and goals. Return responses in valid JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            # Parse the response
            workout_data = json.loads(response.choices[0].message.content)
            return workout_data
            
        except Exception as e:
            print(f"Error generating workout: {e}")
            raise

    async def get_fitness_advice(self, user_id: str, question: str, 
                                context: Optional[Dict[str, Any]] = None) -> str:
        """Get personalized fitness advice using AI"""
        try:
            # Create prompt for advice
            prompt = self._create_advice_prompt(question, context)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert fitness trainer and nutritionist. Provide personalized, evidence-based advice for fitness and health questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error getting fitness advice: {e}")
            raise

    async def get_nutrition_advice(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get personalized nutrition advice"""
        try:
            prompt = self._create_nutrition_prompt(user_data)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert nutritionist. Provide personalized nutrition advice based on user data. Return responses in valid JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            nutrition_data = json.loads(response.choices[0].message.content)
            return nutrition_data
            
        except Exception as e:
            print(f"Error getting nutrition advice: {e}")
            raise

    async def analyze_workout_progress(self, user_id: str, workout_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze workout progress and provide insights"""
        try:
            prompt = self._create_progress_analysis_prompt(workout_history)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert fitness analyst. Analyze workout progress data and provide insights and recommendations. Return responses in valid JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            analysis_data = json.loads(response.choices[0].message.content)
            return analysis_data
            
        except Exception as e:
            print(f"Error analyzing workout progress: {e}")
            raise

    def _create_workout_prompt(self, user_profile: Dict[str, Any], fitness_goals: List[str], 
                              available_time: int, available_equipment: Optional[List[str]] = None,
                              preferences: Optional[Dict[str, Any]] = None) -> str:
        """Create prompt for workout generation"""
        prompt = f"""
        Generate a personalized workout plan for the following user:
        
        User Profile:
        - Age: {user_profile.get('age', 'Not specified')}
        - Fitness Level: {user_profile.get('fitness_level', 'Not specified')}
        - Weight: {user_profile.get('weight', 'Not specified')} kg
        - Height: {user_profile.get('height', 'Not specified')} cm
        - Goals: {', '.join(fitness_goals)}
        - Available Time: {available_time} minutes
        - Available Equipment: {available_equipment or ['None']}
        - Preferences: {preferences or {}}
        
        Please return a JSON response with the following structure:
        {{
            "workout_name": "string",
            "description": "string",
            "estimated_duration": "number in minutes",
            "difficulty": "beginner/intermediate/advanced",
            "exercises": [
                {{
                    "name": "string",
                    "sets": "number",
                    "reps": "number",
                    "weight": "number or null",
                    "duration": "number in seconds or null",
                    "rest_time": "number in seconds",
                    "instructions": "string"
                }}
            ],
            "tips": ["array of tips"],
            "warm_up": ["array of warm-up exercises"],
            "cool_down": ["array of cool-down exercises"]
        }}
        """
        return prompt

    def _create_advice_prompt(self, question: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Create prompt for fitness advice"""
        prompt = f"""
        User Question: {question}
        
        Context: {context or 'No additional context provided'}
        
        Please provide personalized, evidence-based fitness advice. Consider the user's context and provide practical, actionable recommendations.
        """
        return prompt

    def _create_nutrition_prompt(self, user_data: Dict[str, Any]) -> str:
        """Create prompt for nutrition advice"""
        prompt = f"""
        Generate personalized nutrition advice for the following user:
        
        User Data: {json.dumps(user_data, indent=2)}
        
        Please return a JSON response with the following structure:
        {{
            "daily_calories": "number",
            "macronutrients": {{
                "protein": "number in grams",
                "carbohydrates": "number in grams",
                "fat": "number in grams"
            }},
            "meal_suggestions": [
                {{
                    "meal_type": "breakfast/lunch/dinner/snack",
                    "foods": ["array of food items"],
                    "calories": "number"
                }}
            ],
            "supplement_recommendations": ["array of supplements"],
            "hydration_tips": ["array of hydration tips"],
            "general_advice": "string"
        }}
        """
        return prompt

    def _create_progress_analysis_prompt(self, workout_history: List[Dict[str, Any]]) -> str:
        """Create prompt for progress analysis"""
        prompt = f"""
        Analyze the following workout history and provide insights:
        
        Workout History: {json.dumps(workout_history, indent=2)}
        
        Please return a JSON response with the following structure:
        {{
            "strength_trends": {{
                "improving": ["list of exercises showing improvement"],
                "plateauing": ["list of exercises that may need adjustment"],
                "declining": ["list of exercises that may need attention"]
            }},
            "consistency_score": "number between 0-100",
            "recommendations": [
                "array of specific recommendations"
            ],
            "next_goals": [
                "array of suggested next goals"
            ],
            "risk_factors": [
                "array of potential issues to watch for"
            ]
        }}
        """
        return prompt

# Global AI service instance
ai_service = AIService() 