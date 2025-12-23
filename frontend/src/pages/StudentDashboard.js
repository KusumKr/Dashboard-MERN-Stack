import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (user && user.role !== 'student') {
      navigate('/admin/dashboard');
    } else {
      fetchStudentProfile();
    }
  }, [user, navigate]);

  const fetchStudentProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/students/profile/me`);
      setStudent(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        course: response.data.course
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      if (error.response?.status === 404) {
        // Student profile doesn't exist yet
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        course: student.course
      });
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`${API_URL}/students/${student._id}`, formData);
      setStudent(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!student) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Student Dashboard</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </header>
        <div className="dashboard-content">
          <div className="error-message">
            Student profile not found. Please contact admin to create your profile.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="profile-card">
          <h2>My Profile</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!isEditing ? (
            <div className="profile-view">
              <div className="profile-field">
                <label>Name:</label>
                <p>{student.name}</p>
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <p>{student.email}</p>
              </div>
              <div className="profile-field">
                <label>Course:</label>
                <p>{student.course}</p>
              </div>
              <div className="profile-field">
                <label>Enrollment Date:</label>
                <p>{new Date(student.enrollmentDate).toLocaleDateString()}</p>
              </div>
              <button onClick={handleEdit} className="btn-edit">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button type="button" onClick={handleCancel} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

