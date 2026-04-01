import React, { useState, useEffect } from 'react';
import { patientApi, doctorApi, medicineApi, prescriptionApi, billApi } from '../services/api';
import { Plus, Edit2, Trash2, FileText, Pill, UserCheck, CreditCard } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', age: '', gender: 'Male', contact: '', address: '' });
  
  // Prescription states
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState({
    doctorId: '',
    medicineDetails: '',
    notes: ''
  });

  // Billing states
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [billingData, setBillingData] = useState({
    totalAmount: '',
    description: '',
    status: 'UNPAID'
  });

  useEffect(() => {
    fetchPatients();
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      const [docRes, medRes] = await Promise.all([doctorApi.getAll(), medicineApi.getAll()]);
      setDoctors(docRes.data);
      setMedicines(medRes.data);
    } catch (error) {
      console.error("Error fetching support data:", error);
    }
  };

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
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null
      };
      if (payload.id) {
        await patientApi.update(payload.id, payload);
      } else {
        await patientApi.create(payload);
      }
      setIsModalOpen(false);
      fetchPatients();
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save patient details. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this patient?')) {
      await patientApi.delete(id);
      fetchPatients();
    }
  };

  const openPrescriptionModal = (patient) => {
    setSelectedPatient(patient);
    setPrescriptionData({ doctorId: '', medicineDetails: '', notes: '' });
    setIsPrescriptionModalOpen(true);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patient: { id: selectedPatient.id },
        doctor: { id: parseInt(prescriptionData.doctorId) },
        medicineDetails: prescriptionData.medicineDetails,
        notes: prescriptionData.notes
      };
      await prescriptionApi.create(payload);
      setIsPrescriptionModalOpen(false);
      alert('Prescription added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add prescription.');
    }
  };

  const openBillingModal = (patient) => {
    setSelectedPatient(patient);
    setBillingData({ totalAmount: '', description: '', status: 'UNPAID' });
    setIsBillingModalOpen(true);
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patient: { id: selectedPatient.id },
        totalAmount: parseFloat(billingData.totalAmount),
        description: billingData.description,
        status: billingData.status
      };
      await billApi.create(payload);
      setIsBillingModalOpen(false);
      alert('Bill generated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to generate bill.');
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
                  <button className="btn" style={{padding: '6px', background: '#e0f2fe', color: '#0ea5e9'}} title="Add Prescription" onClick={() => openPrescriptionModal(p)}>
                    <Pill size={16} />
                  </button>
                  <button className="btn" style={{padding: '6px', background: '#f0fdf4', color: '#16a34a'}} title="Generate Bill" onClick={() => openBillingModal(p)}>
                    <CreditCard size={16} />
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

      {isPrescriptionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Issue Prescription</h2>
              <button className="close-btn" onClick={() => setIsPrescriptionModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Patient</span>
                <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{selectedPatient?.name} (ID: #{selectedPatient?.id})</p>
              </div>
              <form onSubmit={handlePrescriptionSubmit}>
                <div className="form-group">
                  <label>Assigning Doctor</label>
                  <select className="form-control" required value={prescriptionData.doctorId} onChange={e => setPrescriptionData({...prescriptionData, doctorId: e.target.value})}>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Medicines & Dosage</label>
                  <textarea 
                    className="form-control" 
                    required 
                    rows="3" 
                    value={prescriptionData.medicineDetails} 
                    onChange={e => setPrescriptionData({...prescriptionData, medicineDetails: e.target.value})}
                    placeholder="e.g. Paracetamol: 500mg (1-0-1), 5 days"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <input type="text" className="form-control" value={prescriptionData.notes} onChange={e => setPrescriptionData({...prescriptionData, notes: e.target.value})} placeholder="Take after meals" />
                </div>
                <div style={{marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                  <button type="button" className="btn" onClick={() => setIsPrescriptionModalOpen(false)}>Discard</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#0ea5e9' }}>Add Prescription</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isBillingModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Generate Patient Invoice</h2>
              <button className="close-btn" onClick={() => setIsBillingModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Patient</span>
                <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{selectedPatient?.name} (ID: #{selectedPatient?.id})</p>
              </div>
              <form onSubmit={handleBillingSubmit}>
                <div className="form-group">
                  <label>Service / Item Description</label>
                  <input type="text" className="form-control" required value={billingData.description} onChange={e => setBillingData({...billingData, description: e.target.value})} placeholder="e.g. Consultation + Medicines" />
                </div>
                <div className="form-group">
                  <label>Total Amount (₹)</label>
                  <input type="number" step="0.01" className="form-control" required value={billingData.totalAmount} onChange={e => setBillingData({...billingData, totalAmount: e.target.value})} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select className="form-control" value={billingData.status} onChange={e => setBillingData({...billingData, status: e.target.value})}>
                    <option value="UNPAID">Unpaid / Pending</option>
                    <option value="PAID">Paid / Settled</option>
                  </select>
                </div>
                <div style={{marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                  <button type="button" className="btn" onClick={() => setIsBillingModalOpen(false)}>Discard</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#16a34a' }}>Generate Bill</button>
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
