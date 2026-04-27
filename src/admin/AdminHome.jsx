import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

const AdminHome = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const admin = JSON.parse(sessionStorage.getItem('loggedInAdmin'));

  // This logic automatically switches between your laptop and the internet
  const BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:2910' 
    : 'https://backend-review-2-wo1o.onrender.com'; // REPLACE THIS with your real Render Backend URL

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const [studentsRes, teachersRes, subjectsRes] = await Promise.all([
          axios.get(`${BASE_URL}/adminapi/totalstudents`),
          axios.get(`${BASE_URL}/adminapi/totalteachers`),
          axios.get(`${BASE_URL}/adminapi/viewallsubjects`)
        ]);

        setTotalStudents(studentsRes.data);
        setTotalTeachers(teachersRes.data);
        setTotalSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data.length : 0);

      } catch (err) {
        console.error('API Error:', err);
        setError("Dashboard connection failed. Check if backend is live.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [BASE_URL]); // Added BASE_URL as a dependency

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome-card">
        <div>
          <h2>Welcome back, {admin?.username || 'Admin'}</h2>
          <p>Overview of the Project Portal ({window.location.hostname === 'localhost' ? 'Local Mode' : 'Live Mode'})</p>
        </div>
        <span className="admin-welcome-badge">Administrator</span>
      </div>

      {error && (
        <div className="admin-error-alert" style={{color: 'red', margin: '20px 0', padding: '10px', background: '#fff0f0', borderRadius: '5px'}}>
          ⚠️ {error} <br/>
          <small>Targeting: {BASE_URL}</small>
        </div>
      )}

      {loading ? (
        <p className="admin-loading">Syncing data...</p>
      ) : (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Students</span>
            <span className="admin-stat-value">{totalStudents}</span>
            <span className="admin-stat-sub">Registered students</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Teachers</span>
            <span className="admin-stat-value">{totalTeachers}</span>
            <span className="admin-stat-sub">Registered teachers</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Subjects</span>
            <span className="admin-stat-value">{totalSubjects}</span>
            <span className="admin-stat-sub">Active subjects</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;