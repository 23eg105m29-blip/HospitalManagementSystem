import React, { useState, useEffect } from 'react';
import { appointmentApi, patientApi, doctorApi } from '../services/api';
import { CalendarPlus, Trash2, CheckCircle } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, patientId: '', doctorId: '', appointmentDate: '', status: 'SCHEDULED', notes: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aptRes, patRes, docRes] = await Promise.all([
        appointmentApi.getAll(),
        patientApi.getAll(),
        doctorApi.getAll()
      ]);
      setAppointments(aptRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setFormData({ id: null, patientId: patients[0]?.id || '', doctorId: doctors[0]?.id || '', appointmentDate: '', status: 'SCHEDULED', notes: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patient = patients.find(p => p.id.toString() === formData.patientId.toString());
      const doctor = doctors.find(d => d.id.toString() === formData.doctorId.toString());
      
      const payload = {
        patient: patient,
        doctor: doctor,
        appointmentDate: formData.appointmentDate,
        status: formData.status,
        notes: formData.notes
      };

      await appointmentApi.create(payload);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const markComplete = async (apt) => {
    try {
      await appointmentApi.update(apt.id, { ...apt, status: 'COMPLETED' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Cancel and delete this appointment?')) {
      await appointmentApi.delete(id);
      fetchData();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointment Scheduling</h1>
          <p className="page-subtitle">Manage doctor-patient appointments.</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <CalendarPlus size={18} /> Schedule Appointment
        </button>
      </div>

      <div className="content-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id}>
                <td style={{fontWeight: 600}}>{new Date(apt.appointmentDate).toLocaleString()}</td>
                <td>{apt.patient.name}</td>
                <td>{apt.doctor.name}</td>
                <td>
                  <span className={`badge badge-${apt.status === 'COMPLETED' ? 'success' : apt.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                    {apt.status || 'SCHEDULED'}
                  </span>
                </td>
                <td style={{color: 'var(--text-light)', fontSize: '0.9rem'}}>{apt.notes || '-'}</td>
                <td style={{display: 'flex', gap: '8px'}}>
                  {apt.status !== 'COMPLETED' && (
                    <button className="btn" style={{padding: '6px', background: '#e0fbfc', color: '#00b4d8'}} onClick={() => markComplete(apt)} title="Mark Completed">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button className="btn btn-danger" style={{padding: '6px'}} onClick={() => handleDelete(apt.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No appointments scheduled.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Schedule Appointment</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Patient</label>
                  <select className="form-control" required value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                    <option value="" disabled>Select...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Select Doctor</label>
                  <select className="form-control" required value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})}>
                    <option value="" disabled>Select...</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date & Time</label>
                  {/* Note: HTML datetime-local requires a specific format. Spring Boot LocalDateTime automatically parses ISO 8601 string. */}
                  <input type="datetime-local" className="form-control" required value={formData.appointmentDate} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <input type="text" className="form-control" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>
                <div style={{marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                  <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Schedule Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
