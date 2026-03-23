import React, { useState, useEffect } from 'react';
import { patientApi } from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', age: '', gender: 'Male', contact: '', address: '' });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await patientApi.getAll();
      setPatients(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (patient = null) => {
    if (patient) {
      setFormData(patient);
    } else {
      setFormData({ id: null, name: '', age: '', gender: 'Male', contact: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await patientApi.update(formData.id, formData);
      } else {
        await patientApi.create(formData);
      }
      setIsModalOpen(false);
      fetchPatients();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this patient?')) {
      await patientApi.delete(id);
      fetchPatients();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients Management</h1>
          <p className="page-subtitle">Add, edit, and manage hospital patients.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Patient
        </button>
      </div>

      <div className="content-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.contact}</td>
                <td style={{display: 'flex', gap: '8px'}}>
                  <button className="btn" style={{padding: '6px', background: '#f1f5f9'}} onClick={() => openModal(p)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-danger" style={{padding: '6px'}} onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No patients found. Add one!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{formData.id ? 'Edit Patient' : 'Add New Patient'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{display: 'flex', gap: '16px'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Age</label>
                    <input type="number" className="form-control" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Gender</label>
                    <select className="form-control" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" className="form-control" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" className="form-control" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div style={{marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                  <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Patient</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
