import React, { useState, useEffect } from 'react';
import { medicineApi } from '../services/api';
import { Plus, Edit2, Trash2, Package, Search, AlertCircle, DollarSign, Tag, Truck } from 'lucide-react';

const Pharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    id: null, 
    name: '', 
    category: '', 
    stockQuantity: '', 
    unitPrice: '',
    manufacturer: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await medicineApi.getAll();
      setMedicines(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (medicine = null) => {
    if (medicine) {
      setFormData(medicine);
    } else {
      setFormData({ 
        id: null, 
        name: '', 
        category: '', 
        stockQuantity: '', 
        unitPrice: '',
        manufacturer: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await medicineApi.update(formData.id, formData);
      } else {
        await medicineApi.create(formData);
      }
      setIsModalOpen(false);
      fetchMedicines();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this medicine?')) {
      await medicineApi.delete(id);
      fetchMedicines();
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pharmacy-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pharmacy Inventory</h1>
          <p className="page-subtitle">Track medical stock, pricing, and supply chains.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      <div style={{ marginBottom: '24px', position: 'relative', maxWidth: '400px' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
        <input 
          type="text" 
          placeholder="Search medicines..." 
          className="form-control" 
          style={{ paddingLeft: '40px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filteredMedicines.map(m => (
          <div className="stat-card" key={m.id} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                  <Package size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{m.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="action-btn" onClick={() => openModal(m)}><Edit2 size={14} /></button>
                <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(m.id)}><Trash2 size={14} /></button>
              </div>
            </div>

            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Stock Level</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: m.stockQuantity < 10 ? '#ef4444' : '#1e293b' }}>
                  {m.stockQuantity}
                </span>
                {m.stockQuantity < 10 && <AlertCircle size={14} color="#ef4444" style={{ marginLeft: '6px' }} />}
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Unit Price</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
                  ₹{m.unitPrice}
                </span>
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#64748b' }}>
              <Truck size={14} />
              <span>{m.manufacturer || 'Unknown Manufacturer'}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{formData.id ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Medicine Name</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Paracetamol" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input type="text" className="form-control" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Antibiotic" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input type="number" className="form-control" required value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} placeholder="100" />
                  </div>
                  <div className="form-group">
                    <label>Unit Price (₹)</label>
                    <input type="number" step="0.01" className="form-control" required value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: e.target.value})} placeholder="5.50" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Manufacturer</label>
                  <input type="text" className="form-control" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} placeholder="e.g. Pfizer" />
                </div>
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Medicine</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
