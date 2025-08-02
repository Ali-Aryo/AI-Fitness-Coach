// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AI: {
    FITNESS_ADVICE: '/api/ai/fitness-advice',
    GENERATE_WORKOUT: '/api/ai/generate-workout',
    ANALYZE_WORKOUT: '/api/ai/analyze-workout',
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'AI Fitness Coach',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@aifitnesscoach.com',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error - please check your connection',
  SERVER_ERROR: 'Server error - please try again later',
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You don\'t have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  WORKOUT_GENERATED: 'Workout generated successfully!',
  ADVICE_RECEIVED: 'Here\'s your personalized advice',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const; 