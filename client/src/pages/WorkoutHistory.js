import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [exercises, setExercises] = useState({});

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get('/api/workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkout = async (workoutId) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
      return;
    }

    setExpandedWorkout(workoutId);

    if (!exercises[workoutId]) {
      try {
        const response = await api.get(`/api/workouts/${workoutId}`);
        setExercises(prev => ({
          ...prev,
          [workoutId]: response.data.exercises || []
        }));
      } catch (error) {
        console.error('Error fetching workout details:', error);
      }
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await api.delete(`/api/workouts/${workoutId}`);
      setWorkouts(workouts.filter(w => w.id !== workoutId));
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Error deleting workout');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-calendar-x display-1 text-muted"></i>
        <h3 className="mt-3">No workouts yet</h3>
        <p className="text-muted">Start logging your workouts to see them here</p>
        <Link className="btn btn-primary" to="/add-workout">
          <i className="bi bi-plus-circle"></i> Add Your First Workout
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-clock-history"></i> Workout History
        </h2>
        <Link className="btn btn-primary" to="/add-workout">
          <i className="bi bi-plus-circle"></i> Add Workout
        </Link>
      </div>

      <div className="list-group">
        {workouts.map((workout) => (
          <div key={workout.id} className="list-group-item">
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleWorkout(workout.id)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <h5 className="mb-1">
                  <i className="bi bi-calendar-event"></i> {formatDate(workout.date)}
                </h5>
                {workout.notes && (
                  <p className="mb-1 text-muted">
                    <i className="bi bi-chat-left-text"></i> {workout.notes}
                  </p>
                )}
                <small className="text-muted">
                  {workout.exercise_count} exercise{workout.exercise_count !== 1 ? 's' : ''}
                </small>
              </div>
              <div>
                {expandedWorkout === workout.id ? (
                  <i className="bi bi-chevron-up"></i>
                ) : (
                  <i className="bi bi-chevron-down"></i>
                )}
                <button
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkout(workout.id);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>

            {expandedWorkout === workout.id && exercises[workout.id] && (
              <div className="mt-3">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Muscle Group</th>
                      <th>Weight</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises[workout.id].map((exercise) => (
                      <tr key={exercise.id}>
                        <td>{exercise.name}</td>
                        <td>
                          <span className="badge bg-secondary">{exercise.muscle_group || 'N/A'}</span>
                        </td>
                        <td>{exercise.weight} kg</td>
                        <td>{exercise.sets}</td>
                        <td>{exercise.reps}</td>
                        <td>{Math.round(exercise.weight * exercise.sets * exercise.reps)} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutHistory;
