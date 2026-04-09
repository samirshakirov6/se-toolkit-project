const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

// Get all workouts
router.get('/', authMiddleware, (req, res) => {
  try {
    const workouts = db.getAllWorkouts(req.userId);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single workout with exercises
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const workout = db.getWorkoutById(req.params.id, req.userId);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new workout
router.post('/', authMiddleware, (req, res) => {
  try {
    const { notes, exercises } = req.body;

    // Validate exercises
    if (exercises && Array.isArray(exercises)) {
      for (const ex of exercises) {
        if (!Number.isInteger(ex.sets) || ex.sets < 1) {
          return res.status(400).json({
            error: `Invalid sets for "${ex.name}". Sets must be a natural number (positive integer).`
          });
        }
        if (!Number.isInteger(ex.reps) || ex.reps < 1) {
          return res.status(400).json({
            error: `Invalid reps for "${ex.name}". Reps must be a natural number (positive integer).`
          });
        }
      }
    }

    const result = db.createWorkout(req.userId, notes);
    const workoutId = result.lastInsertRowid;

    // Add exercises if provided
    if (exercises && Array.isArray(exercises)) {
      exercises.forEach(ex => {
        db.addExercise(
          workoutId,
          ex.name,
          ex.muscleGroup || '',
          ex.weight,
          ex.sets,
          ex.reps
        );
      });
    }

    const workout = db.getWorkoutById(workoutId, req.userId);
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete workout
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    db.deleteWorkout(req.params.id, req.userId);
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete exercise
router.delete('/exercise/:id', authMiddleware, (req, res) => {
  try {
    db.deleteExercise(req.params.id);
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
