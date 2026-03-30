import React, { useState, useEffect } from 'react';
import { prescriptionApi } from '../services/api';
import { FileText, Calendar, User, UserCheck, Pill, Trash2, Printer } from 'lucide-react';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionApi.getAll();
      setPrescriptions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this prescription history?')) {
      await prescriptionApi.delete(id);
      fetchPrescriptions();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="prescriptions-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Prescription Registry</h1>
          <p className="page-subtitle">Historical record of all medicines prescribed to patients.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {prescriptions.map(p => (
          <div className="stat-card" key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr auto', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <FileText size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Patient</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{p.patient?.name}</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>#{p.patient?.id}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <UserCheck size={18} color="#94a3b8" />
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Doctor</span>
                <span style={{ fontWeight: 500 }}>{p.doctor?.name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Pill size={18} color="#94a3b8" />
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Medicines prescribed</span>
                <span style={{ fontWeight: 500, color: '#0ea5e9' }}>{p.medicineDetails}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right', marginRight: '16px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Date Issued</span>
                <span style={{ fontSize: '0.875rem' }}>{formatDate(p.prescriptionDate)}</span>
              </div>
              <button className="action-btn" title="Print Prescription"><Printer size={16} /></button>
              <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}

        {prescriptions.length === 0 && (
          <div style={{ padding: '80px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <FileText size={48} style={{ margin: '0 auto 16px', color: '#cbd5e1' }} />
            <h3 style={{ color: '#64748b' }}>No prescriptions found in registry</h3>
            <p style={{ color: '#94a3b8' }}>Prescriptions will appear here once doctors assign medicines to patients.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
