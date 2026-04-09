# se-toolkit-project

# Workout Tracker
A web app and Telegram bot for logging workouts and tracking progress.

## Product Context
**End users:** Gym-goers and home workout enthusiasts.

**Problem:** Logging workouts requires tedious manual form-filling in apps.

**Solution:** Just text the workout — the bot parses, saves, and tracks everything automatically.

## Features

### Version 1
- ✅ Manual workout input (exercise, weight, sets, reps)
- ✅ Workout history view
- ✅ Progress charts per exercise
- ✅ Personal records tracking
- ✅ Weekly training volume analytics

### Version 2
- ✅ Natural language workout logging via LLM
- ✅ Automatic personal record detection
- ✅ Weekly training volume analytics
- ✅ Exercise catalog with muscle group filters

## Tech Stack
- **Frontend:** React, Bootstrap, Chart.js
- **Backend:** Node.js, Express
- **Database:** SQLite (via sql.js)
- **Telegram Bot:** node-telegram-bot-api

## Installation

1. Clone the repository:
```bash
git clone https://github.com/samirshakirov6/se-toolkit-project.git
cd se-toolkit-project
```

2. Install dependencies:
```bash
npm run install-all
```

Or install manually:
```bash
npm install
cd client && npm install
```

## Usage

### Development
Run both server and client:
```bash
npm run dev
```

Or run separately:
```bash
# Server (port 5000)
npm run server

# Client (port 3000)
npm run client
```

### Production
Build the client first:
```bash
cd client && npm run build
```

Then start the server:
```bash
npm start
```

Open the app in your browser at `http://localhost:5000`

### How to Use the App

1. Open the app in your browser
2. Add a workout (exercise + weight + sets + reps)
3. Click "Get Stats" to see progress charts
4. View workout history and calendar on the home page
5. (Version 2) Text the bot "bench 70kg 3x10" — it logs everything automatically

## Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow the instructions
3. Copy the bot token
4. Add it to your `.env` file:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### Bot Commands
- `/start` - Show welcome message
- `/history` - View recent workouts
- `/records` - Personal records
- `/volume` - Weekly training volume

### Logging Workouts via Telegram
Send messages in this format:
```
bench 70kg 3x10
squat 100 4x8
bench press 60kg 3x12, squat 80kg 4x10
```

## API Endpoints

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get single workout with exercises
- `POST /api/workouts` - Create new workout
- `DELETE /api/workouts/:id` - Delete workout
- `DELETE /api/workouts/exercise/:id` - Delete exercise

### Stats
- `GET /api/stats/progress/:exerciseName` - Get exercise progress
- `GET /api/stats/exercises` - Get all unique exercises
- `GET /api/stats/personal-records` - Get personal records
- `GET /api/stats/weekly-volume` - Get weekly training volume

## Project Structure
```
se-toolkit-project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Backend
│   ├── routes/           # API routes
│   ├── database.js       # Database setup
│   ├── bot.js           # Telegram bot
│   └── index.js         # Server entry
├── data/                 # SQLite database
├── .env                  # Environment variables
└── package.json
```

## Links
- **GitHub Repository:** https://github.com/samirshakirov6/se-toolkit-project
