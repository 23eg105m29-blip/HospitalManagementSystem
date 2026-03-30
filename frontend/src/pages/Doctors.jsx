import React, { useState, useEffect } from 'react';
import { doctorApi } from '../services/api';
import { Plus, Edit2, Trash2, MapPin, Briefcase, Clock, Activity, Mail, Phone, User } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, 
    name: '', 
    specialization: '', 
    contact: '', 
    email: '',
    experience: '',
    department: '',
    roomNumber: '',
    status: 'Available'
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await doctorApi.getAll();
      setDoctors(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (doctor = null) => {
    if (doctor) {
      setFormData({
        ...doctor,
        experience: doctor.experience || '',
        department: doctor.department || '',
        roomNumber: doctor.roomNumber || '',
        status: doctor.status || 'Available'
      });
    } else {
      setFormData({ 
        id: null, 
        name: '', 
        specialization: '', 
        contact: '', 
        email: '',
        experience: '',
        department: '',
        roomNumber: '',
        status: 'Available'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await doctorApi.update(formData.id, formData);
      } else {
        await doctorApi.create(formData);
      }
      setIsModalOpen(false);
      fetchDoctors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this doctor?')) {
      await doctorApi.delete(id);
      fetchDoctors();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'status-badge confirmed';
      case 'Busy': return 'status-badge pending';
      case 'On Leave': return 'status-badge cancelled';
      case 'Emergency': return 'status-badge cancelled';
      default: return 'status-badge pending';
    }
  };

  return (
    <div className="doctors-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Medical Specialists</h1>
          <p className="page-subtitle">Manage hospital medical staff and their availability.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Specialist
        </button>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {doctors.map(d => (
          <div className="stat-card" key={d.id} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '8px', backgroundColor: d.status === 'Available' ? '#10b981' : d.status === 'Busy' ? '#f59e0b' : '#ef4444' }}></div>
            <div style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#64748b' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{d.name}</h3>
                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{d.specialization}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="action-btn" onClick={() => openModal(d)}><Edit2 size={16} /></button>
                  <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(d.id)}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                  <Briefcase size={14} /> <span>{d.department || 'General'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                  <Clock size={14} /> <span>{d.experience || '0'} Years Exp.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                  <MapPin size={14} /> <span>Room {d.roomNumber || 'N/A'}</span>
                </div>
                <div className={getStatusColor(d.status)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', width: 'fit-content', padding: '2px 10px', height: '20px' }}>
                  <Activity size={12} /> {d.status}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                  <Phone size={14} color="#94a3b8" /> <span style={{ color: '#1e293b' }}>{d.contact}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                  <Mail size={14} color="#94a3b8" /> <span style={{ color: '#1e293b' }}>{d.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {doctors.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
            <div style={{ color: '#94a3b8', marginBottom: '16px' }}><User size={48} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ color: '#1e293b' }}>No medical staff found</h3>
            <p style={{ color: '#64748b' }}>Start by adding a new doctor to the hospital roster.</p>
            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => openModal()}>Add First Doctor</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{formData.id ? 'Edit Specialist Details' : 'Register New Specialist'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Dr. John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Specialization</label>
                    <input type="text" className="form-control" required value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Cardiologist" />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" className="form-control" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. Cardiology" />
                  </div>
                  <div className="form-group">
                    <label>Experience (Years)</label>
                    <input type="number" className="form-control" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="10" />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="text" className="form-control" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="+1 234 567 890" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john.doe@hospital.com" />
                  </div>
                  <div className="form-group">
                    <label>Room Number</label>
                    <input type="text" className="form-control" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} placeholder="B-204" />
                  </div>
                  <div className="form-group">
                    <label>Availability Status</label>
                    <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Discard</button>
                  <button type="submit" className="btn btn-primary">Save Configuration</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
