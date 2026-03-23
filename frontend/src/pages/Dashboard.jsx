import React, { useState, useEffect } from 'react';
import { Users, User, CalendarCheck, Activity } from 'lucide-react';
import { patientApi, doctorApi, appointmentApi } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          patientApi.getAll(),
          doctorApi.getAll(),
          appointmentApi.getAll()
        ]);
        
        setStats({
          patients: patientsRes.data.length,
          doctors: doctorsRes.data.length,
          appointments: appointmentsRes.data.length
        });

        // Get 5 most recent appointments
        const sorted = appointmentsRes.data.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        setRecentAppointments(sorted.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(76, 201, 240, 0.1)', color: '#4cc9f0' }}>
            <Users />
          </div>
          <div className="stat-info">
            <h3>{stats.patients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67, 97, 238, 0.1)', color: '#4361ee' }}>
            <User />
          </div>
          <div className="stat-info">
            <h3>{stats.doctors}</h3>
            <p>Total Doctors</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 183, 3, 0.1)', color: '#ffb703' }}>
            <CalendarCheck />
          </div>
          <div className="stat-info">
            <h3>{stats.appointments}</h3>
            <p>Appointments</p>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <div className="panel-header">
          <h2 className="panel-title">Recent Appointments</h2>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentAppointments.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>No appointments scheduled</td></tr>
            ) : (
              recentAppointments.map(apt => (
                <tr key={apt.id}>
                  <td>{new Date(apt.appointmentDate).toLocaleString()}</td>
                  <td>{apt.patient.name}</td>
                  <td>{apt.doctor.name} ({apt.doctor.specialization})</td>
                  <td>
                    <span className={`badge badge-${apt.status === 'COMPLETED' ? 'success' : apt.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                      {apt.status || 'SCHEDULED'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
