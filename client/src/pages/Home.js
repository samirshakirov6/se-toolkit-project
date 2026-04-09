import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">
            <i className="bi bi-activity text-primary"></i> Workout Tracker
          </h1>
          {user.username && (
            <p className="fs-5 text-success">
              <i className="bi bi-person-check"></i> Welcome back, <strong>{user.username}</strong>!
            </p>
          )}
          <p className="col-md-8 fs-4">
            Track your workouts, monitor progress, and achieve your fitness goals.
          </p>
          <Link className="btn btn-primary btn-lg" to="/add-workout">
            <i className="bi bi-plus-circle"></i> Add Workout
          </Link>
          <Link className="btn btn-outline-secondary btn-lg ms-2" to="/progress">
            <i className="bi bi-graph-up"></i> Get Stats
          </Link>
        </div>
      </div>

      <div className="row align-items-md-stretch">
        <div className="col-md-4">
          <div className="h-100 p-5 text-bg-dark rounded-3">
            <h2>
              <i className="bi bi-plus-lg"></i> Log Workouts
            </h2>
            <p>
              Easily log your exercises, sets, reps, and weights. Track every detail of your training.
            </p>
            <Link className="btn btn-outline-light" to="/add-workout">
              Start Logging
            </Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="h-100 p-5 bg-body-tertiary border rounded-3">
            <h2>
              <i className="bi bi-clock-history"></i> View History
            </h2>
            <p>
              Browse your complete workout history. See dates, exercises, and performance over time.
            </p>
            <Link className="btn btn-outline-secondary" to="/history">
              View History
            </Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="h-100 p-5 bg-primary text-white rounded-3">
            <h2>
              <i className="bi bi-graph-up-arrow"></i> Track Progress
            </h2>
            <p>
              Visualize your improvement with charts. See your strength gains and personal records.
            </p>
            <Link className="btn btn-outline-light" to="/progress">
              See Progress
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 bg-light rounded">
        <h3>
          <i className="bi bi-robot"></i> Telegram Bot (Version 2)
        </h3>
        <p>
          Use our Telegram bot to log workouts on the go! Just send a message like:
        </p>
        <code className="d-block p-3 bg-dark text-white rounded mb-3">
          bench 70kg 3x10
        </code>
        <p>The bot will automatically parse and save your workout.</p>
      </div>
    </div>
  );
}

export default Home;
