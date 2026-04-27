import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Admin.css'

const AdminHome = () => {
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalTeachers, setTotalTeachers] = useState(0)
  const [totalSubjects, setTotalSubjects] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const admin = JSON.parse(sessionStorage.getItem('loggedInAdmin'))

  // Update this BASE_URL to match your backend port (e.g., 8080 or 5000)
  const BASE_URL = 'http://localhost:2910' 

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true)
        const [studentsRes, teachersRes, subjectsRes] = await Promise.all([
          axios.get(`${BASE_URL}/adminapi/totalstudents`),
          axios.get(`${BASE_URL}/adminapi/totalteachers`),
          axios.get(`${BASE_URL}/adminapi/viewallsubjects`)
        ])

        // Safety check: Ensure we aren't receiving HTML strings
        const parseCount = (data) => {
          if (typeof data === 'string' && data.includes('<!doctype html>')) {
            return 0;
          }
          return typeof data === 'number' ? data : (parseInt(data) || 0);
        }

        setTotalStudents(parseCount(studentsRes.data))
        setTotalTeachers(parseCount(teachersRes.data))
        
        // Subjects usually returns a list, so we check the length
        setTotalSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data.length : 0)
        
        setError(null)
      } catch (err) {
        console.error('Error fetching counts:', err)
        setError('Failed to connect to backend server.')
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  return (
    <div className="admin-container">
      <div className="admin-welcome-card">
        <div>
          <h2>Welcome back, {admin?.username || 'Admin'}</h2>
          <p>Here is an overview of the Group Project Portal</p>
        </div>
        <span className="admin-welcome-badge">Administrator</span>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee' }}>
          {error} (Check if Backend is running at {BASE_URL})
        </div>
      )}

      {loading ? (
        <p className="admin-loading">Loading dashboard...</p>
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
  )
}

export default AdminHome