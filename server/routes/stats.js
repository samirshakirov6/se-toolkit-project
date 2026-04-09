const express = require('express');
const router = express.Router();
const db = require('../database');

// Get exercise progress by name
router.get('/progress/:exerciseName', (req, res) => {
  try {
    const progress = db.getExerciseProgress(req.params.exerciseName);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all unique exercises
router.get('/exercises', (req, res) => {
  try {
    const exercises = db.getUniqueExercises();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get personal records
router.get('/personal-records', (req, res) => {
  try {
    const records = db.getPersonalRecords();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly training volume
router.get('/weekly-volume', (req, res) => {
  try {
    const volume = db.getWeeklyVolume();
    res.json(volume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
