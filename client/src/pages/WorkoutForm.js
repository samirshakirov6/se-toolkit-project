import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EXERCISE_SUGGESTIONS = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Dumbbell Fly', 'Leg Press', 'Lunges', 'Bicep Curl',
  'Tricep Extension', 'Lateral Raise', 'Leg Curl', 'Leg Extension',
  'Calf Raise', 'Plank', 'Crunches', 'Lat Pulldown', 'Face Pull'
];

const MUSCLE_GROUPS = [
  'chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'core'
];

function WorkoutForm() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', muscleGroup: '', weight: '', sets: '', reps: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addExercise = () => {
    setExercises([...exercises, { name: '', muscleGroup: '', weight: '', sets: '', reps: '' }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate exercises
    const validExercises = exercises.filter(ex => ex.name && ex.weight && ex.sets && ex.reps);
    
    if (validExercises.length === 0) {
      setError('Please add at least one exercise with all fields filled');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/workouts', {
        notes,
        exercises: validExercises.map(ex => ({
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          weight: parseFloat(ex.weight),
          sets: parseInt(ex.sets),
          reps: parseInt(ex.reps)
        }))
      });

      navigate('/history');
    } catch (err) {
      setError('Error saving workout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>
        <i className="bi bi-plus-circle"></i> Add Workout
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="2"
            placeholder="How did you feel today?"
          />
        </div>

        <h4 className="mt-4">Exercises</h4>
        
        {exercises.map((exercise, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Exercise</label>
                  <input
                    type="text"
                    className="form-control"
                    list="exercise-suggestions"
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    placeholder="e.g., Bench Press"
                    required
                  />
                  <datalist id="exercise-suggestions">
                    {EXERCISE_SUGGESTIONS.map(ex => (
                      <option key={ex} value={ex} />
                    ))}
                  </datalist>
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">Muscle Group</label>
                  <select
                    className="form-select"
                    value={exercise.muscleGroup}
                    onChange={(e) => updateExercise(index, 'muscleGroup', e.target.value)}
                  >
                    <option value="">Select...</option>
                    {MUSCLE_GROUPS.map(mg => (
                      <option key={mg} value={mg}>{mg}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={exercise.weight}
                    onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                    placeholder="70"
                    min="0"
                    step="0.5"
                    required
                  />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">Sets</label>
                  <input
                    type="number"
                    className="form-control"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                    placeholder="3"
                    min="1"
                    required
                  />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">Reps</label>
                  <input
                    type="number"
                    className="form-control"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
              </div>

              {exercises.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeExercise(index)}
                >
                  <i className="bi bi-trash"></i> Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-outline-primary" onClick={addExercise}>
          <i className="bi bi-plus"></i> Add Exercise
        </button>

        <div className="mt-4">
          <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i> Save Workout
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkoutForm;
