import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkoutForm from './pages/WorkoutForm';
import WorkoutHistory from './pages/WorkoutHistory';
import Progress from './pages/Progress';

// Protected route component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Set auth header
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return children;
}

// Public route component (redirect if logged in)
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <i className="bi bi-activity"></i> Workout Tracker
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <div className="navbar-nav ms-auto">
                {user ? (
                  <>
                    <span className="nav-item navbar-text text-light me-3">
                      <i className="bi bi-person-circle"></i> {user.username}
                    </span>
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
                    <button className="nav-link btn btn-link" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link className="nav-link" to="/login">
                      <i className="bi bi-box-arrow-in-right"></i> Login
                    </Link>
                    <Link className="nav-link" to="/register">
                      <i className="bi bi-person-plus"></i> Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="container mt-4">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/add-workout" element={
              <ProtectedRoute>
                <WorkoutForm />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <WorkoutHistory />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>

        <footer className="bg-dark text-light text-center py-3 mt-5">
          <p className="mb-0">
            Workout Tracker &copy; 2026 | <a href="https://github.com/samirshakirov6/se-toolkit-project" className="text-light">GitHub</a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
