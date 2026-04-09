const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all workouts
router.get('/', (req, res) => {
  try {
    const workouts = db.getAllWorkouts();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single workout with exercises
router.get('/:id', (req, res) => {
  try {
    const workout = db.getWorkoutById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new workout
router.post('/', (req, res) => {
  try {
    const { notes, exercises } = req.body;
    
    const result = db.createWorkout(notes);
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
    
    const workout = db.getWorkoutById(workoutId);
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete workout
router.delete('/:id', (req, res) => {
  try {
    db.deleteWorkout(req.params.id);
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete exercise
router.delete('/exercise/:id', (req, res) => {
  try {
    db.deleteExercise(req.params.id);
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
