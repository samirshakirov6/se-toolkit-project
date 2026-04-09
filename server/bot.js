const TelegramBot = require('node-telegram-bot-api');
const db = require('./database');

// Exercise catalog with muscle groups
const EXERCISE_CATALOG = {
  // Chest
  'bench press': 'chest',
  'incline bench': 'chest',
  'decline bench': 'chest',
  'dumbbell fly': 'chest',
  'push-ups': 'chest',
  // Back
  'deadlift': 'back',
  'pull-ups': 'back',
  'barbell row': 'back',
  'lat pulldown': 'back',
  't-bar row': 'back',
  // Legs
  'squat': 'legs',
  'leg press': 'legs',
  'lunges': 'legs',
  'leg curl': 'legs',
  'leg extension': 'legs',
  'calf raise': 'legs',
  // Shoulders
  'overhead press': 'shoulders',
  'lateral raise': 'shoulders',
  'front raise': 'shoulders',
  'face pull': 'shoulders',
  // Arms
  'bicep curl': 'biceps',
  'hammer curl': 'biceps',
  'tricep extension': 'triceps',
  'tricep pushdown': 'triceps',
  'skull crusher': 'triceps',
  // Core
  'plank': 'core',
  'crunches': 'core',
  'russian twist': 'core',
};

function getMuscleGroup(exerciseName) {
  const name = exerciseName.toLowerCase();
  for (const [key, value] of Object.entries(EXERCISE_CATALOG)) {
    if (name.includes(key)) {
      return value;
    }
  }
  return '';
}

function parseWorkoutMessage(text) {
  // Parse formats like:
  // "bench 70kg 3x10"
  // "squat 100 4x8"
  // "bench press 60kg 3x12, squat 80kg 4x10"
  
  const exercises = [];
  
  // Split by comma for multiple exercises
  const parts = text.split(',');
  
  parts.forEach(part => {
    // Match patterns: name weight[kg] setsxreps
    const match = part.trim().match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*(?:kg)?\s+(\d+)\s*x\s*(\d+)/i);
    
    if (match) {
      const [, name, weight, sets, reps] = match;
      exercises.push({
        name: name.trim(),
        muscleGroup: getMuscleGroup(name),
        weight: parseFloat(weight),
        sets: parseInt(sets),
        reps: parseInt(reps)
      });
    }
  });
  
  return exercises;
}

function checkPersonalRecords(exercises) {
  const records = db.getPersonalRecords();
  const newRecords = [];
  
  exercises.forEach(ex => {
    const existing = records.find(r => 
      r.name.toLowerCase().includes(ex.name.toLowerCase()) || 
      ex.name.toLowerCase().includes(r.name.toLowerCase())
    );
    
    if (!existing || ex.weight > existing.max_weight) {
      newRecords.push(`${ex.name}: ${ex.weight}kg 🏆`);
    }
  });
  
  return newRecords;
}

function startBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.log('Telegram bot not configured. Set TELEGRAM_BOT_TOKEN in .env file');
    return null;
  }
  
  const bot = new TelegramBot(token, { polling: true });
  
  console.log('Telegram bot started');
  
  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const welcome = `
🏋️ *Workout Tracker Bot*

Send your workouts in format:
_bench 70kg 3x10_
_squat 100 4x8_

For multiple exercises, separate with commas:
_bench 60kg 3x12, squat 80kg 4x10_

Commands:
/history - View recent workouts
/records - Personal records
/volume - Weekly training volume
    `;
    bot.sendMessage(msg.chat.id, welcome, { parse_mode: 'Markdown' });
  });
  
  // Handle /history command
  bot.onText(/\/history/, async (msg) => {
    try {
      const workouts = db.getAllWorkouts().slice(0, 5);
      
      if (workouts.length === 0) {
        bot.sendMessage(msg.chat.id, 'No workouts yet. Start logging your workouts!');
        return;
      }
      
      let message = '📊 *Recent Workouts*\n\n';
      
      for (const workout of workouts) {
        const date = new Date(workout.date).toLocaleDateString();
        message += `*${date}* - ${workout.exercise_count} exercises\n`;
      }
      
      bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    } catch (error) {
      bot.sendMessage(msg.chat.id, 'Error fetching history');
    }
  });
  
  // Handle /records command
  bot.onText(/\/records/, (msg) => {
    try {
      const records = db.getPersonalRecords();
      
      if (records.length === 0) {
        bot.sendMessage(msg.chat.id, 'No records yet. Start logging your workouts!');
        return;
      }
      
      let message = '🏆 *Personal Records*\n\n';
      records.forEach(r => {
        message += `${r.name}: ${r.max_weight}kg x ${r.max_reps} reps\n`;
      });
      
      bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    } catch (error) {
      bot.sendMessage(msg.chat.id, 'Error fetching records');
    }
  });
  
  // Handle /volume command
  bot.onText(/\/volume/, (msg) => {
    try {
      const volume = db.getWeeklyVolume().slice(0, 4);
      
      if (volume.length === 0) {
        bot.sendMessage(msg.chat.id, 'No data yet. Start logging your workouts!');
        return;
      }
      
      let message = '📈 *Weekly Volume*\n\n';
      volume.forEach(v => {
        message += `Week ${v.week}: ${v.total_exercises} exercises, volume: ${Math.round(v.total_weight_volume || 0)}kg\n`;
      });
      
      bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    } catch (error) {
      bot.sendMessage(msg.chat.id, 'Error fetching volume data');
    }
  });
  
  // Handle workout messages
  bot.on('message', async (msg) => {
    if (msg.text.startsWith('/')) return; // Skip commands
    
    const exercises = parseWorkoutMessage(msg.text);
    
    if (exercises.length === 0) {
      bot.sendMessage(msg.chat.id, 
        '❌ Could not parse workout. Use format: _exercise weight setsxreps_\nExample: _bench 70kg 3x10_',
        { parse_mode: 'Markdown' }
      );
      return;
    }
    
    // Save workout to database
    const workoutResult = db.createWorkout(`Logged via Telegram`);
    const workoutId = workoutResult.lastInsertRowid;
    
    exercises.forEach(ex => {
      db.addExercise(workoutId, ex.name, ex.muscleGroup, ex.weight, ex.sets, ex.reps);
    });
    
    // Check for new personal records
    const newRecords = checkPersonalRecords(exercises);
    
    // Build response
    let response = '✅ *Workout saved!*\n\n';
    exercises.forEach(ex => {
      response += `${ex.name}: ${ex.weight}kg × ${ex.sets}×${ex.reps}\n`;
    });
    
    if (newRecords.length > 0) {
      response += '\n🎉 *NEW PERSONAL RECORDS!*\n';
      response += newRecords.join('\n');
    }
    
    bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
  });
  
  return bot;
}

module.exports = startBot;
