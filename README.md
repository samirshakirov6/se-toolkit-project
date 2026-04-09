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

## Deployment to VM

### Prerequisites
- Ubuntu/Debian VM (or any Linux distribution)
- Node.js 18+ and npm installed
- Git installed

### Step-by-step deployment

1. **Connect to your VM via SSH**
```bash
ssh user@your-vm-ip
```

2. **Install Node.js and npm** (if not already installed)
```bash
# Update package list
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

3. **Clone the repository**
```bash
cd ~
git clone https://github.com/samirshakirov6/se-toolkit-project.git
cd se-toolkit-project
```

4. **Install dependencies**
```bash
npm run install-all
```

5. **Configure environment variables**
```bash
# Copy example env file
cp .env.example .env

# Edit .env file and set a secure JWT secret
nano .env
```

6. **Build the client**
```bash
cd client && npm run build && cd ..
```

7. **Start the application**

**Option 1: Simple start (for testing)**
```bash
npm start
```

**Option 2: Using PM2 (recommended for production)**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app with PM2
pm2 start server/index.js --name workout-tracker

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Copy and run the command that PM2 outputs
```

8. **Configure firewall** (if enabled)
```bash
# Allow port 5000
sudo ufw allow 5000/tcp

# If you want to use port 80/443, see nginx setup below
```

9. **Access the application**
Open your browser and go to: `http://your-vm-ip:5000`

### Optional: Setup Nginx as Reverse Proxy

For production use, it's recommended to use Nginx:

1. **Install Nginx**
```bash
sudo apt install -y nginx
```

2. **Create Nginx configuration**
```bash
sudo nano /etc/nginx/sites-available/workout-tracker
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com; # or your VM IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Enable the site**
```bash
sudo ln -s /etc/nginx/sites-available/workout-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Allow HTTP/HTTPS through firewall**
```bash
sudo ufw allow 'Nginx Full'
```

### Optional: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### Backup your data

The database is stored in `data/workouts.db`. To backup:
```bash
cp data/workouts.db data/workouts.db.backup
```

### Update the application

```bash
cd ~/se-toolkit-project
git pull
npm install
cd client && npm install && npm run build && cd ..
# Restart the app
pm2 restart workout-tracker  # if using PM2
# OR
npm start
```
