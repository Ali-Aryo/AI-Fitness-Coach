import OpenAI from 'openai';
import { createError } from '../middleware/errorHandler';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface WorkoutRequest {
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

export const generateWorkout = async (request: WorkoutRequest): Promise<GeneratedWorkout> => {
  try {
    const prompt = createWorkoutPrompt(request);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness trainer and workout planner. Create personalized, safe, and effective workout plans. Always consider the user's fitness level, goals, available equipment, and any injuries. Provide detailed, actionable workout plans in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw createError('Failed to generate workout', 500);
    }

    // Parse the JSON response
    const workout = JSON.parse(response);
    return workout;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw createError('Invalid workout format generated', 500);
    }
    throw error;
  }
};

export const generateFitnessAdvice = async (question: string, context?: string): Promise<string> => {
  try {
    const prompt = createAdvicePrompt(question, context);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness coach and nutritionist. Provide helpful, accurate, and safe fitness advice. Always consider safety first and recommend consulting with healthcare professionals when appropriate."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate advice at this time.';
  } catch (error) {
    throw createError('Failed to generate fitness advice', 500);
  }
};

export const analyzeWorkoutPerformance = async (workoutData: any, userFeedback?: string): Promise<any> => {
  try {
    const prompt = createAnalysisPrompt(workoutData, userFeedback);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness analyst. Analyze workout performance and provide constructive feedback, suggestions for improvement, and motivation. Be encouraging while being honest about areas for improvement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw createError('Failed to analyze workout', 500);
    }

    return JSON.parse(response);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw createError('Invalid analysis format generated', 500);
    }
    throw error;
  }
};

const createWorkoutPrompt = (request: WorkoutRequest): string => {
  const { fitnessLevel, goals, duration, equipment, injuries, workoutType } = request;
  
  return `Create a personalized ${workoutType} workout plan with the following requirements:

Fitness Level: ${fitnessLevel}
Goals: ${goals.join(', ')}
Duration: ${duration} minutes
Available Equipment: ${equipment.length > 0 ? equipment.join(', ') : 'Bodyweight only'}
Injuries/Considerations: ${injuries.length > 0 ? injuries.join(', ') : 'None'}

Please provide the response in the following JSON format:
{
  "name": "Workout Name",
  "description": "Brief description of the workout",
  "type": "${workoutType}",
  "difficulty": "${fitnessLevel}",
  "duration": ${duration},
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": 12,
      "weight": null,
      "duration": null,
      "restTime": 60,
      "notes": "Form cues or modifications"
    }
  ],
  "tips": ["Tip 1", "Tip 2"],
  "warmup": ["Warmup exercise 1", "Warmup exercise 2"],
  "cooldown": ["Cooldown exercise 1", "Cooldown exercise 2"]
}

Ensure the workout is safe, effective, and appropriate for the specified fitness level and goals.`;
};

const createAdvicePrompt = (question: string, context?: string): string => {
  let prompt = `Fitness Question: ${question}`;
  
  if (context) {
    prompt += `\n\nContext: ${context}`;
  }
  
  prompt += `\n\nPlease provide helpful, accurate, and safe fitness advice. If the question requires medical attention, recommend consulting with a healthcare professional.`;
  
  return prompt;
};

const createAnalysisPrompt = (workoutData: any, userFeedback?: string): string => {
  let prompt = `Analyze the following workout performance data:\n\n${JSON.stringify(workoutData, null, 2)}`;
  
  if (userFeedback) {
    prompt += `\n\nUser Feedback: ${userFeedback}`;
  }
  
  prompt += `\n\nPlease provide analysis in the following JSON format:
{
  "strengths": ["Strength 1", "Strength 2"],
  "areas_for_improvement": ["Area 1", "Area 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "motivation": "Encouraging message",
  "next_steps": ["Next step 1", "Next step 2"]
}`;
  
  return prompt;
}; 