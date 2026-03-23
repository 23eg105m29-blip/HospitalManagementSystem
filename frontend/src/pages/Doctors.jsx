import React, { useState, useEffect } from 'react';
import { doctorApi } from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', specialization: '', contact: '', email: '' });

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
      setFormData(doctor);
    } else {
      setFormData({ id: null, name: '', specialization: '', contact: '', email: '' });
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctors Roster</h1>
          <p className="page-subtitle">Manage hospital medical staff.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Doctor
        </button>
      </div>

      <div className="dashboard-grid">
        {doctors.map(d => (
          <div className="stat-card" key={d.id} style={{flexDirection: 'column', alignItems: 'flex-start', gap: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
              <span className="badge badge-primary">{d.specialization}</span>
              <div style={{display: 'flex', gap: '8px'}}>
                <button className="btn" style={{padding: '4px', background: 'transparent'}} onClick={() => openModal(d)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn" style={{padding: '4px', background: 'transparent', color: 'var(--danger)'}} onClick={() => handleDelete(d.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div>
              <h3 style={{fontSize: '1.2rem', fontWeight: 700, margin: '8px 0'}}>{d.name}</h3>
              <p style={{fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '4px'}}>📞 {d.contact}</p>
              <p style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>✉️ {d.email}</p>
            </div>
          </div>
        ))}
        {doctors.length === 0 && (
          <div style={{gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px'}}>
            No doctors available. Please add staff to the roster.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{formData.id ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Doctor Name</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input type="text" className="form-control" required value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Cardiologist" />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" className="form-control" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div style={{marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                  <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Doctor</button>
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
