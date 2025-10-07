import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily'
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchHabits();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/habits`);
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      showNotification('Failed to fetch habits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Habit title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/habits`, formData);
      
      setHabits(prev => [response.data, ...prev]);
      setFormData({ title: '', description: '', frequency: 'daily' });
      setErrors({});
      showNotification('Habit created successfully! 🎉');
    } catch (error) {
      console.error('Error creating habit:', error);
      showNotification('Failed to create habit', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getFrequencyIcon = (frequency) => {
    const icons = {
      daily: '🔄',
      weekly: '📅',
      monthly: '🗓️'
    };
    return icons[frequency] || '📝';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="app">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="header-title">
              <span className="header-icon">🌟</span>
              HabitForge
            </h1>
            <p className="header-subtitle">Build better habits, one day at a time</p>
          </div>
        </header>

        <div className="main-content">
          {/* Stats Card */}
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-number">{habits.length}</span>
              <span className="stat-label">Total Habits</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {habits.filter(h => h.frequency === 'daily').length}
              </span>
              <span className="stat-label">Daily</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {habits.filter(h => h.frequency === 'weekly').length}
              </span>
              <span className="stat-label">Weekly</span>
            </div>
          </div>

          <div className="content-grid">
            {/* Add Habit Form */}
            <div className="form-section">
              <div className="section-header">
                <h2>Create New Habit</h2>
                <div className="section-icon">✨</div>
              </div>
              
              <form onSubmit={handleSubmit} className="habit-form">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Habit Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="What habit do you want to build?"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add some motivation or details..."
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="frequency" className="form-label">
                    Frequency
                  </label>
                  <div className="frequency-options">
                    {['daily', 'weekly', 'monthly'].map(freq => (
                      <label key={freq} className="frequency-option">
                        <input
                          type="radio"
                          name="frequency"
                          value={freq}
                          checked={formData.frequency === freq}
                          onChange={handleInputChange}
                          className="frequency-input"
                        />
                        <span className="frequency-label">
                          <span className="frequency-icon">
                            {getFrequencyIcon(freq)}
                          </span>
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`submit-button ${loading ? 'loading' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Habit'
                  )}
                </button>
              </form>
            </div>

            {/* Habits List */}
            <div className="habits-section">
              <div className="section-header">
                <h2>Your Habits</h2>
                <span className="habits-count">{habits.length}</span>
              </div>

              {loading && habits.length === 0 ? (
                <div className="loading-state">
                  <div className="spinner large"></div>
                  <p>Loading your habits...</p>
                </div>
              ) : habits.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No habits yet</h3>
                  <p>Create your first habit to get started on your journey!</p>
                </div>
              ) : (
                <div className="habits-grid">
                  {habits.map(habit => (
                    <div key={habit._id} className="habit-card">
                      <div className="habit-header">
                        <div className="habit-title-section">
                          <span className="habit-frequency-icon">
                            {getFrequencyIcon(habit.frequency)}
                          </span>
                          <h3 className="habit-title">{habit.title}</h3>
                        </div>
                        <span className={`habit-badge ${habit.frequency}`}>
                          {habit.frequency}
                        </span>
                      </div>
                      
                      {habit.description && (
                        <p className="habit-description">{habit.description}</p>
                      )}
                      
                      <div className="habit-footer">
                        <span className="habit-date">
                          Created {formatDate(habit.createdAt)}
                        </span>
                        <div className="habit-actions">
                          <button className="action-button edit" title="Edit">
                            ✏️
                          </button>
                          <button className="action-button delete" title="Delete">
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;