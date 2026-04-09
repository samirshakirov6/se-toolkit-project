const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

// Get exercise progress by name
router.get('/progress/:exerciseName', authMiddleware, (req, res) => {
  try {
    const progress = db.getExerciseProgress(req.userId, req.params.exerciseName);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all unique exercises
router.get('/exercises', authMiddleware, (req, res) => {
  try {
    const exercises = db.getUniqueExercises(req.userId);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get personal records
router.get('/personal-records', authMiddleware, (req, res) => {
  try {
    const records = db.getPersonalRecords(req.userId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly training volume
router.get('/weekly-volume', authMiddleware, (req, res) => {
  try {
    const volume = db.getWeeklyVolume(req.userId);
    res.json(volume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
