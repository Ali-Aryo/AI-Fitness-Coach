import { apiClient, ApiResponse } from './client';

// Types for AI API responses
export interface FitnessAdviceRequest {
  question: string;
  context?: string;
}

export interface FitnessAdviceResponse {
  advice: string;
}

export interface WorkoutGenerationRequest {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  duration: number;
  equipment: string[];
  injuries: string[];
  workoutType: 'strength' | 'cardio' | 'flexibility' | 'mixed';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  notes?: string;
}

export interface GeneratedWorkout {
  name: string;
  description: string;
  type: string;
  difficulty: string;
  duration: number;
  exercises: Exercise[];
  tips: string[];
  warmup: string[];
  cooldown: string[];
}

export interface WorkoutAnalysisRequest {
  workoutData: any;
  userFeedback?: string;
}

export interface WorkoutAnalysisResponse {
  strengths: string[];
  areas_for_improvement: string[];
  suggestions: string[];
  motivation: string;
  next_steps: string[];
}

// AI API functions
export const aiApi = {
  // Get fitness advice from AI coach
  async getFitnessAdvice(
    request: FitnessAdviceRequest
  ): Promise<ApiResponse<FitnessAdviceResponse>> {
    return apiClient.post<FitnessAdviceResponse>('/api/ai/fitness-advice', request);
  },

  // Generate personalized workout
  async generateWorkout(
    request: WorkoutGenerationRequest
  ): Promise<ApiResponse<GeneratedWorkout>> {
    return apiClient.post<GeneratedWorkout>('/api/ai/generate-workout', request);
  },

  // Analyze workout performance
  async analyzeWorkout(
    request: WorkoutAnalysisRequest
  ): Promise<ApiResponse<WorkoutAnalysisResponse>> {
    return apiClient.post<WorkoutAnalysisResponse>('/api/ai/analyze-workout', request);
  },
}; 