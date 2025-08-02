# AI Fitness Coach Backend

A Node.js/Express backend API for the AI Fitness Coach application, focused on OpenAI integration for workout generation and fitness advice.

## Features

- 🤖 **AI-Powered Workout Generation**: Create personalized workout plans using OpenAI
- 💡 **Fitness Advice**: Get expert fitness advice and recommendations
- 📊 **Workout Analysis**: Analyze workout performance and provide feedback
- 🔒 **Rate Limiting**: Protect against abuse with request rate limiting
- 🛡️ **Security**: Helmet.js for security headers and CORS protection
- 📝 **Validation**: Request validation using express-validator
- 🚀 **Performance**: Compression and optimized middleware

## API Endpoints

### AI Routes (`/api/ai`)

#### POST `/generate-workout`
Generate a personalized workout plan based on user preferences.

**Request Body:**
```json
{
  "fitnessLevel": "beginner|intermediate|advanced",
  "goals": ["weight_loss", "muscle_gain", "endurance", "strength", "flexibility", "general_fitness"],
  "duration": 45,
  "equipment": ["dumbbells", "resistance_bands"],
  "injuries": ["knee_pain"],
  "workoutType": "strength|cardio|flexibility|mixed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Full Body Strength",
    "description": "A comprehensive full-body workout...",
    "type": "strength",
    "difficulty": "beginner",
    "duration": 45,
    "exercises": [...],
    "tips": [...],
    "warmup": [...],
    "cooldown": [...]
  }
}
```

#### POST `/fitness-advice`
Get personalized fitness advice.

**Request Body:**
```json
{
  "question": "How can I improve my running endurance?",
  "context": "I'm a beginner runner training for a 5K"
}
```

#### POST `/analyze-workout`
Analyze workout performance and provide feedback.

**Request Body:**
```json
{
  "workoutData": {
    "completedExercises": [...],
    "duration": 45,
    "difficulty": 7
  },
  "userFeedback": "Felt challenging but manageable"
}
```

## Setup

### Prerequisites

- Node.js 18+ 
- OpenAI API key

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests

## API Integration

### Frontend Integration

The backend is designed to work with your React Native frontend. You can make API calls like this:

```typescript
// Generate workout
const response = await fetch('http://localhost:3001/api/ai/generate-workout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fitnessLevel: 'beginner',
    goals: ['weight_loss', 'strength'],
    duration: 30,
    equipment: ['dumbbells'],
    injuries: [],
    workoutType: 'mixed'
  })
});

const workout = await response.json();
```

## Security

- **Rate Limiting**: Prevents API abuse
- **CORS**: Configured for your frontend domain
- **Helmet.js**: Security headers
- **Input Validation**: All requests are validated
- **Error Handling**: Comprehensive error handling

## Development

### Project Structure

```
src/
├── index.ts              # Main server file
├── middleware/           # Express middleware
│   ├── errorHandler.ts   # Error handling
│   └── rateLimiter.ts   # Rate limiting
├── routes/              # API routes
│   └── ai.ts            # AI endpoints
└── services/            # Business logic
    └── aiService.ts     # OpenAI integration
```

### Adding New Features

1. **New AI Endpoint**: Add to `src/routes/ai.ts`
2. **New Service**: Create in `src/services/`
3. **New Middleware**: Add to `src/middleware/`

## Troubleshooting

### Common Issues

1. **OpenAI API Error**: Check your API key in `.env`
2. **CORS Error**: Verify `CORS_ORIGIN` in `.env`
3. **Rate Limit Error**: Reduce request frequency
4. **Validation Error**: Check request body format

### Logs

The server logs all requests and errors. Check the console for detailed information.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a proper `.env` file with production values
3. Run `npm run build`
4. Start with `npm start`
5. Use a process manager like PM2 for production

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use conventional commits 