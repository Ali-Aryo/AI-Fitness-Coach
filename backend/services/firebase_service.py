import firebase_admin
from firebase_admin import credentials, firestore
import os
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

class FirebaseService:
    def __init__(self):
        """Initialize Firebase service with credentials"""
        try:
            # Initialize Firebase Admin SDK
            if not firebase_admin._apps:
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
                    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
                    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
                    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
                    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
                })
                firebase_admin.initialize_app(cred)
            
            self.db = firestore.client()
        except Exception as e:
            print(f"Error initializing Firebase: {e}")
            raise

    # User operations
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            doc = self.db.collection('users').document(user_id).get()
            return doc.to_dict() if doc.exists else None
        except Exception as e:
            print(f"Error getting user {user_id}: {e}")
            return None

    async def create_user(self, user_data: Dict[str, Any]) -> str:
        """Create a new user"""
        try:
            user_data['created_at'] = datetime.now()
            user_data['updated_at'] = datetime.now()
            doc_ref = self.db.collection('users').document(user_data['user_id'])
            doc_ref.set(user_data)
            return user_data['user_id']
        except Exception as e:
            print(f"Error creating user: {e}")
            raise

    async def update_user(self, user_id: str, user_data: Dict[str, Any]) -> bool:
        """Update user data"""
        try:
            user_data['updated_at'] = datetime.now()
            self.db.collection('users').document(user_id).update(user_data)
            return True
        except Exception as e:
            print(f"Error updating user {user_id}: {e}")
            return False

    async def delete_user(self, user_id: str) -> bool:
        """Delete user"""
        try:
            self.db.collection('users').document(user_id).delete()
            return True
        except Exception as e:
            print(f"Error deleting user {user_id}: {e}")
            return False

    # Workout operations
    async def get_workout(self, workout_id: str) -> Optional[Dict[str, Any]]:
        """Get workout by ID"""
        try:
            doc = self.db.collection('workouts').document(workout_id).get()
            return doc.to_dict() if doc.exists else None
        except Exception as e:
            print(f"Error getting workout {workout_id}: {e}")
            return None

    async def get_user_workouts(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all workouts for a user"""
        try:
            docs = self.db.collection('workouts').where('user_id', '==', user_id).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"Error getting workouts for user {user_id}: {e}")
            return []

    async def create_workout(self, workout_data: Dict[str, Any]) -> str:
        """Create a new workout"""
        try:
            workout_data['created_at'] = datetime.now()
            workout_data['updated_at'] = datetime.now()
            doc_ref = self.db.collection('workouts').document()
            workout_data['workout_id'] = doc_ref.id
            doc_ref.set(workout_data)
            return doc_ref.id
        except Exception as e:
            print(f"Error creating workout: {e}")
            raise

    async def update_workout(self, workout_id: str, workout_data: Dict[str, Any]) -> bool:
        """Update workout"""
        try:
            workout_data['updated_at'] = datetime.now()
            self.db.collection('workouts').document(workout_id).update(workout_data)
            return True
        except Exception as e:
            print(f"Error updating workout {workout_id}: {e}")
            return False

    async def delete_workout(self, workout_id: str) -> bool:
        """Delete workout"""
        try:
            self.db.collection('workouts').document(workout_id).delete()
            return True
        except Exception as e:
            print(f"Error deleting workout {workout_id}: {e}")
            return False

    # Analytics operations
    async def log_workout_session(self, session_data: Dict[str, Any]) -> str:
        """Log a completed workout session"""
        try:
            session_data['completed_at'] = datetime.now()
            doc_ref = self.db.collection('workout_sessions').document()
            session_data['session_id'] = doc_ref.id
            doc_ref.set(session_data)
            return doc_ref.id
        except Exception as e:
            print(f"Error logging workout session: {e}")
            raise

    async def get_user_progress(self, user_id: str, period: str = "month") -> Dict[str, Any]:
        """Get user progress metrics"""
        try:
            # Calculate date range based on period
            now = datetime.now()
            if period == "week":
                start_date = now - timedelta(days=7)
            elif period == "month":
                start_date = now - timedelta(days=30)
            elif period == "year":
                start_date = now - timedelta(days=365)
            else:
                start_date = now - timedelta(days=30)

            # Query workout sessions
            sessions = self.db.collection('workout_sessions').where(
                'user_id', '==', user_id
            ).where(
                'completed_at', '>=', start_date
            ).stream()

            sessions_list = [doc.to_dict() for doc in sessions]
            
            # Calculate metrics
            total_workouts = len(sessions_list)
            total_duration = sum(session.get('duration', 0) for session in sessions_list)
            total_calories = sum(session.get('calories_burned', 0) for session in sessions_list)

            return {
                'user_id': user_id,
                'period': period,
                'total_workouts': total_workouts,
                'total_duration': total_duration,
                'total_calories': total_calories,
                'strength_progress': {},  # TODO: Implement strength tracking
                'endurance_progress': {},  # TODO: Implement endurance tracking
                'flexibility_progress': {}  # TODO: Implement flexibility tracking
            }
        except Exception as e:
            print(f"Error getting progress for user {user_id}: {e}")
            return {}

# Global Firebase service instance
firebase_service = FirebaseService() 