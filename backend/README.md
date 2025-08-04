# AI Fitness Coach Backend

A FastAPI-based backend for the AI Fitness Coach application, featuring OpenAI integration for personalized workout generation and Firebase Firestore for data storage.

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **Firebase Integration**: Firestore database for user data and workout storage
- **OpenAI Integration**: AI-powered workout generation and fitness advice
- **Modular Architecture**: Clean, maintainable code structure
- **Comprehensive API**: Full CRUD operations for users, workouts, and analytics

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── env.example            # Environment variables template
├── api/
│   ├── routes/           # API route modules
│   │   ├── users.py      # User management endpoints
│   │   ├── workouts.py   # Workout management endpoints
│   │   ├── ai.py         # AI-powered features
│   │   └── analytics.py  # Progress tracking endpoints
├── services/             # Business logic services
│   ├── firebase_service.py  # Firebase Firestore operations
│   └── ai_service.py        # OpenAI integration
└── utils/                # Utility functions
    ├── constants.py      # Application constants
    └── validators.py     # Data validation utilities
```

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

1. Copy `env.example` to `.env`:
```bash
cp env.example .env
```

2. Configure your environment variables:
   - **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/)
   - **Firebase Configuration**: Get service account credentials from Firebase Console

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > Service Accounts
4. Generate new private key
5. Copy the credentials to your `.env` file

### 4. Run the Application

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## API Endpoints

### Users
- `GET /api/users/{user_id}` - Get user profile
- `PUT /api/users/{user_id}` - Update user profile
- `DELETE /api/users/{user_id}` - Delete user profile

### Workouts
- `POST /api/workouts/generate` - Generate AI workout
- `GET /api/workouts/user/{user_id}` - Get user workouts
- `GET /api/workouts/{workout_id}` - Get specific workout
- `POST /api/workouts/` - Create workout
- `PUT /api/workouts/{workout_id}` - Update workout
- `DELETE /api/workouts/{workout_id}` - Delete workout

### AI Features
- `POST /api/ai/generate-workout` - Generate personalized workout
- `POST /api/ai/get-advice` - Get fitness advice
- `POST /api/ai/nutrition-advice` - Get nutrition advice

### Analytics
- `POST /api/analytics/workout-session` - Log workout session
- `GET /api/analytics/progress/{user_id}` - Get user progress
- `GET /api/analytics/insights/{user_id}` - Get AI insights
- `GET /api/analytics/workout-history/{user_id}` - Get workout history

## Development

### Adding New Endpoints

1. Create new route file in `api/routes/`
2. Import and include router in `main.py`
3. Add corresponding service methods in `services/`

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=api --cov=services --cov=utils
```

### Code Style

This project follows PEP 8 style guidelines. Use a linter like `flake8` or `black` for code formatting.

## Deployment

### Production Considerations

1. **Environment Variables**: Use proper environment management
2. **CORS**: Configure CORS properly for production
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Logging**: Add comprehensive logging
5. **Monitoring**: Set up application monitoring

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License. 