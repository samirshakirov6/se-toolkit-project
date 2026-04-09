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
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
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

  // User operations
  createUser: (username, email, passwordHash) => {
    try {
      run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash]);
      const user = get('SELECT id, username, email, created_at FROM users WHERE email = ?', [email]);
      return user;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint')) {
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  },

  getUserByEmail: (email) => {
    return get('SELECT * FROM users WHERE email = ?', [email]);
  },

  getUserById: (id) => {
    return get('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
  },

  // Workout operations
  createWorkout: (userId, notes = '') => {
    db.run('INSERT INTO workouts (user_id, notes) VALUES (?, ?)', [userId, notes]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    const workoutId = result[0].values[0][0];
    saveDb();
    return { lastInsertRowid: workoutId };
  },

  getAllWorkouts: (userId) => {
    return all(`
      SELECT w.*, COUNT(e.id) as exercise_count 
      FROM workouts w 
      LEFT JOIN exercises e ON w.id = e.workout_id 
      WHERE w.user_id = ?
      GROUP BY w.id 
      ORDER BY w.date DESC
    `, [userId]);
  },

  getWorkoutById: (workoutId, userId) => {
    const workout = get('SELECT * FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]);
    if (!workout) return null;

    workout.exercises = all('SELECT * FROM exercises WHERE workout_id = ?', [workoutId]);
    return workout;
  },

  deleteWorkout: (workoutId, userId) => {
    run('DELETE FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]);
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
  getExerciseProgress: (userId, exerciseName) => {
    return all(`
      SELECT e.*, w.date 
      FROM exercises e 
      JOIN workouts w ON e.workout_id = w.id 
      WHERE e.name LIKE ? AND w.user_id = ?
      ORDER BY w.date ASC
    `, [`%${exerciseName}%`, userId]);
  },

  getUniqueExercises: (userId) => {
    return all(`
      SELECT DISTINCT e.name, e.muscle_group 
      FROM exercises e 
      JOIN workouts w ON e.workout_id = w.id 
      WHERE w.user_id = ?
      ORDER BY e.name
    `, [userId]);
  },

  getPersonalRecords: (userId) => {
    return all(`
      SELECT e.name, e.muscle_group, MAX(e.weight) as max_weight, MAX(e.reps) as max_reps
      FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      WHERE w.user_id = ?
      GROUP BY e.name
    `, [userId]);
  },

  getWeeklyVolume: (userId) => {
    return all(`
      SELECT 
        strftime('%Y-%W', w.date) as week,
        COUNT(*) as total_exercises,
        SUM(e.sets * e.reps) as total_volume,
        SUM(e.weight * e.sets * e.reps) as total_weight_volume
      FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      WHERE w.user_id = ?
      GROUP BY week
      ORDER BY week DESC
      LIMIT 12
    `, [userId]);
  }
};
