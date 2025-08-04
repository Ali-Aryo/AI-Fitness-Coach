from typing import Dict, Any, List, Optional
from utils.constants import FITNESS_LEVELS, WORKOUT_TYPES, EQUIPMENT_TYPES, FITNESS_GOALS

def validate_fitness_level(level: str) -> bool:
    """Validate fitness level"""
    return level.lower() in FITNESS_LEVELS

def validate_workout_type(workout_type: str) -> bool:
    """Validate workout type"""
    return workout_type.lower() in WORKOUT_TYPES

def validate_equipment(equipment: List[str]) -> bool:
    """Validate equipment list"""
    if not equipment:
        return True
    return all(eq.lower() in EQUIPMENT_TYPES for eq in equipment)

def validate_goals(goals: List[str]) -> bool:
    """Validate fitness goals"""
    if not goals:
        return False
    return all(goal.lower() in FITNESS_GOALS for goal in goals)

def validate_user_profile(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and sanitize user profile data"""
    errors = []
    
    # Validate required fields
    required_fields = ['user_id', 'name', 'email']
    for field in required_fields:
        if field not in profile or not profile[field]:
            errors.append(f"Missing required field: {field}")
    
    # Validate fitness level
    if 'fitness_level' in profile and profile['fitness_level']:
        if not validate_fitness_level(profile['fitness_level']):
            errors.append(f"Invalid fitness level: {profile['fitness_level']}")
    
    # Validate goals
    if 'goals' in profile and profile['goals']:
        if not validate_goals(profile['goals']):
            errors.append(f"Invalid goals: {profile['goals']}")
    
    # Validate numeric fields
    numeric_fields = ['age', 'weight', 'height']
    for field in numeric_fields:
        if field in profile and profile[field] is not None:
            try:
                float(profile[field])
                if field == 'age' and (profile[field] < 13 or profile[field] > 120):
                    errors.append(f"Age must be between 13 and 120")
                elif field in ['weight', 'height'] and profile[field] <= 0:
                    errors.append(f"{field.capitalize()} must be positive")
            except (ValueError, TypeError):
                errors.append(f"Invalid {field}: must be a number")
    
    if errors:
        raise ValueError(f"Validation errors: {'; '.join(errors)}")
    
    return profile

def validate_workout_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """Validate workout generation request"""
    errors = []
    
    # Validate required fields
    required_fields = ['user_id', 'fitness_level', 'goals', 'available_time']
    for field in required_fields:
        if field not in request or not request[field]:
            errors.append(f"Missing required field: {field}")
    
    # Validate fitness level
    if 'fitness_level' in request and request['fitness_level']:
        if not validate_fitness_level(request['fitness_level']):
            errors.append(f"Invalid fitness level: {request['fitness_level']}")
    
    # Validate goals
    if 'goals' in request and request['goals']:
        if not validate_goals(request['goals']):
            errors.append(f"Invalid goals: {request['goals']}")
    
    # Validate available time
    if 'available_time' in request:
        try:
            time = int(request['available_time'])
            if time <= 0 or time > 300:  # Max 5 hours
                errors.append("Available time must be between 1 and 300 minutes")
        except (ValueError, TypeError):
            errors.append("Available time must be a number")
    
    # Validate equipment
    if 'available_equipment' in request and request['available_equipment']:
        if not validate_equipment(request['available_equipment']):
            errors.append(f"Invalid equipment: {request['available_equipment']}")
    
    if errors:
        raise ValueError(f"Validation errors: {'; '.join(errors)}")
    
    return request

def sanitize_string(value: str) -> str:
    """Sanitize string input"""
    if not value:
        return ""
    return value.strip()

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None 