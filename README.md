# se-toolkit-project

# Workout Tracker
A web app for logging workouts and tracking progress.

## Product Context
**End users:** Gym-goers and home workout enthusiasts.

**Problem:** Logging workouts requires tedious manual form-filling in apps.

**Solution:** Simple and intuitive interface to log, save, and track everything automatically.

## Features

- ✅ Manual workout input (exercise, weight, sets, reps)
- ✅ Workout history view
- ✅ Progress charts per exercise
- ✅ Personal records tracking
- ✅ Weekly training volume analytics
- ✅ User authentication (register/login)
- ✅ User-specific workout data isolation

## Tech Stack
- **Frontend:** React, Bootstrap, Chart.js
- **Backend:** Node.js, Express
- **Database:** SQLite (via sql.js)
- **Authentication:** JWT (jsonwebtoken) + bcrypt

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

1. Register a new account or login
2. Add a workout (exercise + weight + sets + reps)
3. Click "Get Stats" to see progress charts
4. View workout history on the History page
5. Track your progress and personal records

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

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
│   ├── middleware/       # Auth middleware
│   ├── database.js       # Database setup
│   └── index.js         # Server entry
├── data/                 # SQLite database
├── .env                  # Environment variables
└── package.json
```

## Links
- **GitHub Repository:** https://github.com/samirshakirov6/se-toolkit-project
