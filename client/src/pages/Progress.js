import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Progress() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [weeklyVolume, setWeeklyVolume] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExercises();
    fetchPersonalRecords();
    fetchWeeklyVolume();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('/api/stats/exercises');
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const fetchPersonalRecords = async () => {
    try {
      const response = await axios.get('/api/stats/personal-records');
      setPersonalRecords(response.data);
    } catch (error) {
      console.error('Error fetching personal records:', error);
    }
  };

  const fetchWeeklyVolume = async () => {
    try {
      const response = await axios.get('/api/stats/weekly-volume');
      setWeeklyVolume(response.data.reverse());
    } catch (error) {
      console.error('Error fetching weekly volume:', error);
    }
  };

  const fetchProgress = async (exerciseName) => {
    if (!exerciseName) {
      setProgressData([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/stats/progress/${exerciseName}`);
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseChange = (e) => {
    const name = e.target.value;
    setSelectedExercise(name);
    fetchProgress(name);
  };

  const progressChartData = () => {
    if (progressData.length === 0) return null;

    const labels = progressData.map(p => 
      new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    return {
      labels,
      datasets: [
        {
          label: 'Weight (kg)',
          data: progressData.map(p => p.weight),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.3
        },
        {
          label: 'Reps',
          data: progressData.map(p => p.reps),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const volumeChartData = () => {
    if (weeklyVolume.length === 0) return null;

    const labels = weeklyVolume.map(v => `Week ${v.week}`);

    return {
      labels,
      datasets: [
        {
          label: 'Total Weight Volume (kg)',
          data: weeklyVolume.map(v => Math.round(v.total_weight_volume || 0)),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: selectedExercise ? `${selectedExercise} Progress` : 'Progress'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Reps'
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    }
  };

  const volumeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Training Volume'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Volume (kg)'
        }
      }
    }
  };

  return (
    <div>
      <h2>
        <i className="bi bi-graph-up"></i> Progress & Statistics
      </h2>

      {/* Personal Records */}
      <div className="card mb-4 mt-4">
        <div className="card-header">
          <h4>
            <i className="bi bi-trophy"></i> Personal Records
          </h4>
        </div>
        <div className="card-body">
          {personalRecords.length === 0 ? (
            <p className="text-muted">No records yet. Start logging workouts!</p>
          ) : (
            <div className="row">
              {personalRecords.map((record, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title">{record.name}</h5>
                      <p className="card-text">
                        <strong>{record.max_weight} kg</strong> × {record.max_reps} reps
                      </p>
                      <span className="badge bg-secondary">{record.muscle_group || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exercise Progress Chart */}
      <div className="card mb-4">
        <div className="card-header">
          <h4>
            <i className="bi bi-graph-up"></i> Exercise Progress
          </h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Select Exercise</label>
            <select
              className="form-select"
              value={selectedExercise}
              onChange={handleExerciseChange}
            >
              <option value="">Choose an exercise...</option>
              {exercises.map((ex, index) => (
                <option key={index} value={ex.name}>
                  {ex.name} {ex.muscle_group ? `(${ex.muscle_group})` : ''}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          )}

          {!loading && progressData.length > 0 && (
            <Line options={chartOptions} data={progressChartData()} />
          )}

          {!loading && selectedExercise && progressData.length === 0 && (
            <p className="text-muted text-center py-4">
              No data for this exercise yet
            </p>
          )}
        </div>
      </div>

      {/* Weekly Volume Chart */}
      <div className="card mb-4">
        <div className="card-header">
          <h4>
            <i className="bi bi-bar-chart"></i> Weekly Training Volume
          </h4>
        </div>
        <div className="card-body">
          {weeklyVolume.length > 0 ? (
            <Bar options={volumeChartOptions} data={volumeChartData()} />
          ) : (
            <p className="text-muted text-center py-4">
              No volume data yet. Start logging workouts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Progress;
