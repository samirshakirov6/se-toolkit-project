import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import WorkoutForm from './pages/WorkoutForm';
import WorkoutHistory from './pages/WorkoutHistory';
import Progress from './pages/Progress';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <i className="bi bi-activity"></i> Workout Tracker
            </Link>
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/">
                <i className="bi bi-house"></i> Home
              </Link>
              <Link className="nav-link" to="/add-workout">
                <i className="bi bi-plus-circle"></i> Add Workout
              </Link>
              <Link className="nav-link" to="/history">
                <i className="bi bi-clock-history"></i> History
              </Link>
              <Link className="nav-link" to="/progress">
                <i className="bi bi-graph-up"></i> Progress
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-workout" element={<WorkoutForm />} />
            <Route path="/history" element={<WorkoutHistory />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>

        <footer className="bg-dark text-light text-center py-3 mt-5">
          <p className="mb-0">Workout Tracker &copy; 2026 | <a href="https://github.com/samirshakirov6/se-toolkit-project" className="text-light">GitHub</a></p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
