const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/workouts.db');

let db = null;
let SQL = null;

// Initialize database
async function initDb() {
  SQL = await initSqlJs();

  // Load or create database
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      muscle_group TEXT,
      weight REAL NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
    CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);
    CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
  `);

  saveDb();
  console.log('Database initialized');
}

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

// Helper to get one row
function get(stmt, params = []) {
  const stmt_obj = db.prepare(stmt);
  stmt_obj.bind(params);
  if (stmt_obj.step()) {
    const row = stmt_obj.getAsObject();
    stmt_obj.free();
    return row;
  }
  stmt_obj.free();
  return null;
}

// Helper to get all rows
function all(stmt, params = []) {
  const stmt_obj = db.prepare(stmt);
  stmt_obj.bind(params);
  const results = [];
  while (stmt_obj.step()) {
    results.push(stmt_obj.getAsObject());
  }
  stmt_obj.free();
  return results;
}

// Helper to run statement
function run(stmt, params = []) {
  db.run(stmt, params);
  saveDb();
}

module.exports = {
  initDb,
  getDbState: () => db ? 'Connected' : 'Not initialized',

  // Workout operations
  createWorkout: (notes = '') => {
    run('INSERT INTO workouts (notes) VALUES (?)', [notes]);
    const result = get('SELECT last_insert_rowid() as id, changes() as lastInsertRowid');
    return { lastInsertRowid: result.id };
  },

  getAllWorkouts: () => {
    return all(`
      SELECT w.*, COUNT(e.id) as exercise_count 
      FROM workouts w 
      LEFT JOIN exercises e ON w.id = e.workout_id 
      GROUP BY w.id 
      ORDER BY w.date DESC
    `);
  },

  getWorkoutById: (id) => {
    const workout = get('SELECT * FROM workouts WHERE id = ?', [id]);
    if (!workout) return null;

    workout.exercises = all('SELECT * FROM exercises WHERE workout_id = ?', [id]);
    return workout;
  },

  deleteWorkout: (id) => {
    run('DELETE FROM workouts WHERE id = ?', [id]);
  },

  // Exercise operations
  addExercise: (workoutId, name, muscleGroup, weight, sets, reps) => {
    run(
      'INSERT INTO exercises (workout_id, name, muscle_group, weight, sets, reps) VALUES (?, ?, ?, ?, ?, ?)',
      [workoutId, name, muscleGroup, weight, sets, reps]
    );
  },

  deleteExercise: (id) => {
    run('DELETE FROM exercises WHERE id = ?', [id]);
  },

  // Stats operations
  getExerciseProgress: (exerciseName) => {
    return all(`
      SELECT e.*, w.date 
      FROM exercises e 
      JOIN workouts w ON e.workout_id = w.id 
      WHERE e.name LIKE ? 
      ORDER BY w.date ASC
    `, [`%${exerciseName}%`]);
  },

  getUniqueExercises: () => {
    return all('SELECT DISTINCT name, muscle_group FROM exercises ORDER BY name');
  },

  getPersonalRecords: () => {
    return all(`
      SELECT name, muscle_group, MAX(weight) as max_weight, MAX(reps) as max_reps
      FROM exercises
      GROUP BY name
    `);
  },

  getWeeklyVolume: () => {
    return all(`
      SELECT 
        strftime('%Y-%W', date) as week,
        COUNT(*) as total_exercises,
        SUM(sets * reps) as total_volume,
        SUM(weight * sets * reps) as total_weight_volume
      FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      GROUP BY week
      ORDER BY week DESC
      LIMIT 12
    `);
  }
};
