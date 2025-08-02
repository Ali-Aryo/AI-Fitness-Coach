import express from 'express';
import { body, validationResult } from 'express-validator';
import { generateWorkout } from '../services/aiService';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Generate personalized workout
router.post('/generate-workout', [
  body('fitnessLevel').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid fitness level'),
  body('goals').isArray().withMessage('Goals must be an array'),
  body('goals.*').isIn(['weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility', 'general_fitness']).withMessage('Invalid goal'),
  body('duration').isInt({ min: 10, max: 180 }).withMessage('Duration must be between 10 and 180 minutes'),
  body('equipment').optional().isArray().withMessage('Equipment must be an array'),
  body('injuries').optional().isArray().withMessage('Injuries must be an array'),
  body('workoutType').optional().isIn(['strength', 'cardio', 'flexibility', 'mixed']).withMessage('Invalid workout type'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Validation failed', 400);
    }

    const {
      fitnessLevel,
      goals,
      duration,
      equipment = [],
      injuries = [],
      workoutType = 'mixed'
    } = req.body;

    const workout = await generateWorkout({
      fitnessLevel,
      goals,
      duration,
      equipment,
      injuries,
      workoutType
    });

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
});

// Get fitness advice
router.post('/fitness-advice', [
  body('question').isString().isLength({ min: 10, max: 500 }).withMessage('Question must be between 10 and 500 characters'),
  body('context').optional().isString().withMessage('Context must be a string'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Validation failed', 400);
    }

    const { question, context } = req.body;
    
    // This would call the AI service for fitness advice
    const advice = await generateFitnessAdvice(question, context);

    res.json({
      success: true,
      data: { advice }
    });
  } catch (error) {
    next(error);
  }
});

// Analyze workout performance
router.post('/analyze-workout', [
  body('workoutData').isObject().withMessage('Workout data must be an object'),
  body('userFeedback').optional().isString().withMessage('User feedback must be a string'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Validation failed', 400);
    }

    const { workoutData, userFeedback } = req.body;
    
    // This would call the AI service to analyze workout performance
    const analysis = await analyzeWorkoutPerformance(workoutData, userFeedback);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
});

export default router; 