import React, { useState, useEffect } from 'react';
import { billApi, patientApi } from '../services/api';
import {
  CreditCard, CheckCircle, Clock, Trash2, Printer, Search, Plus,
  User, X, AlertTriangle, TrendingUp, FileText, Banknote, Tag, Eye
} from 'lucide-react';

const BILL_TYPES   = ['CONSULTATION', 'SURGERY', 'MEDICINE', 'LAB_TEST', 'ROOM_CHARGE', 'OTHER'];
const PAY_METHODS  = ['CASH', 'CARD', 'UPI', 'INSURANCE'];

const typeColors = {
  CONSULTATION: { bg: '#ede9fe', color: '#7c3aed' },
  SURGERY:      { bg: '#fce7f3', color: '#db2777' },
  MEDICINE:     { bg: '#dbeafe', color: '#2563eb' },
  LAB_TEST:     { bg: '#d1fae5', color: '#059669' },
  ROOM_CHARGE:  { bg: '#fef3c7', color: '#d97706' },
  OTHER:        { bg: '#f1f5f9', color: '#475569' },
};

const emptyForm = {
  patientId: '', description: '', totalAmount: '',
  status: 'UNPAID', paymentMethod: 'CASH', billType: 'CONSULTATION'
};

const Billing = () => {
  const [bills,    setBills]    = useState([]);
  const [patients, setPatients] = useState([]);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('ALL'); // ALL | PAID | UNPAID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewBill,    setViewBill]    = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchBills(); fetchPatients(); }, []);

  const fetchBills = async () => {
    try { const r = await billApi.getAll(); setBills(r.data); }
    catch (e) { console.error(e); }
  };
  const fetchPatients = async () => {
    try { const r = await patientApi.getAll(); setPatients(r.data); }
    catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await billApi.create({
        patient:       { id: parseInt(form.patientId) },
        description:   form.description,
        totalAmount:   parseFloat(form.totalAmount),
        status:        form.status,
        paymentMethod: form.paymentMethod,
        billType:      form.billType,
      });
      setIsModalOpen(false);
      setForm(emptyForm);
      fetchBills();
    } catch (e) { console.error(e); }
  };

  const markPaid = async (bill) => {
    try {
      await billApi.update(bill.id, { ...bill, status: 'PAID' });
      fetchBills();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this billing record?')) return;
    await billApi.delete(id);
    fetchBills();
    if (viewBill?.id === id) setViewBill(null);
  };

  // ── stats ──────────────────────────────────────────────────────────
  const paid   = bills.filter(b => b.status === 'PAID');
  const unpaid = bills.filter(b => b.status === 'UNPAID');
  const totalRevenue = paid.reduce((s, b) => s + b.totalAmount, 0);
  const pendingAmt   = unpaid.reduce((s, b) => s + b.totalAmount, 0);

  // ── filter + search ────────────────────────────────────────────────
  const visible = bills
    .filter(b => filter === 'ALL' || b.status === filter)
    .filter(b =>
      b.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()) ||
      b.billType?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div style={{ padding: '0' }}>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Management</h1>
          <p className="page-subtitle">Manage patient invoices, payments, and hospital revenue.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: '28px' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white' }}>
          <div className="stat-icon" style={{ background: 'rgba(255,255,255,.2)', color: 'white' }}><CheckCircle size={22} /></div>
          <div>
            <span style={{ fontSize: '.85rem', opacity: .9 }}>Collected Revenue</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>₹{totalRevenue.toFixed(2)}</div>
            <span style={{ fontSize: '.75rem', opacity: .8 }}>{paid.length} invoices paid</span>
          </div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white' }}>
          <div className="stat-icon" style={{ background: 'rgba(255,255,255,.2)', color: 'white' }}><Clock size={22} /></div>
          <div>
            <span style={{ fontSize: '.85rem', opacity: .9 }}>Pending Dues</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>₹{pendingAmt.toFixed(2)}</div>
            <span style={{ fontSize: '.75rem', opacity: .8 }}>{unpaid.length} invoices pending</span>
          </div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white' }}>
          <div className="stat-icon" style={{ background: 'rgba(255,255,255,.2)', color: 'white' }}><TrendingUp size={22} /></div>
          <div>
            <span style={{ fontSize: '.85rem', opacity: .9 }}>Total Billed</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>₹{(totalRevenue + pendingAmt).toFixed(2)}</div>
            <span style={{ fontSize: '.75rem', opacity: .8 }}>{bills.length} total invoices</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f1f5f9', color: '#64748b' }}><CreditCard size={22} /></div>
          <div>
            <span style={{ fontSize: '.85rem', color: '#64748b' }}>Collection Rate</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b' }}>
              {bills.length ? Math.round((paid.length / bills.length) * 100) : 0}%
            </div>
            <span style={{ fontSize: '.75rem', color: '#94a3b8' }}>of invoices settled</span>
          </div>
        </div>
      </div>

      {/* ── Table panel ── */}
      <div className="content-panel">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          {/* search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
            <input type="text" className="form-control" placeholder="Search patient, description, type…"
              style={{ paddingLeft: '38px' }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {/* status filter tabs */}
          {['ALL','PAID','UNPAID'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '8px 18px', borderRadius: '8px', border: '1.5px solid',
                fontWeight: 600, fontSize: '.85rem', cursor: 'pointer',
                borderColor: filter === f ? '#6366f1' : '#e2e8f0',
                background:  filter === f ? '#6366f1' : 'white',
                color:       filter === f ? 'white'   : '#64748b',
                transition:  'all .2s'
              }}>
              {f}
            </button>
          ))}
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Patient</th>
              <th>Bill Type</th>
              <th>Description</th>
              <th>Amount (₹)</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(b => {
              const tc = typeColors[b.billType] || typeColors.OTHER;
              return (
                <tr key={b.id}>
                  <td><span style={{ fontWeight: 700, color: '#6366f1' }}>#INV-{b.id}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={14} color="#7c3aed" />
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, display: 'block' }}>{b.patient?.name}</span>
                        <span style={{ fontSize: '.75rem', color: '#94a3b8' }}>ID #{b.patient?.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: tc.bg, color: tc.color, fontWeight: 600, fontSize: '.75rem' }}>
                      {b.billType || 'N/A'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569' }}>
                    {b.description}
                  </td>
                  <td style={{ fontWeight: 700, color: '#1e293b' }}>₹{b.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '.8rem', color: '#64748b' }}>
                      <Banknote size={13} /> {b.paymentMethod || '—'}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '.875rem' }}>{new Date(b.billingDate).toLocaleDateString('en-IN')}</td>
                  <td>
                    <span className={`status-badge ${b.status === 'PAID' ? 'confirmed' : 'pending'}`}>{b.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {b.status === 'UNPAID' && (
                        <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '.78rem' }}
                          onClick={() => markPaid(b)}>Mark Paid</button>
                      )}
                      <button className="action-btn" title="View Details" onClick={() => setViewBill(b)}><Eye size={15} /></button>
                      <button className="action-btn" title="Print"><Printer size={15} /></button>
                      <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(b.id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr><td colSpan="9" style={{ textAlign: 'center', color: '#94a3b8', padding: '48px' }}>
                No billing records found.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── New Invoice Modal ── */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h2>Generate New Invoice</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Patient</label>
                  <select className="form-control" required value={form.patientId}
                    onChange={e => setForm({ ...form, patientId: e.target.value })}>
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Bill Type</label>
                    <select className="form-control" value={form.billType}
                      onChange={e => setForm({ ...form, billType: e.target.value })}>
                      {BILL_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select className="form-control" value={form.paymentMethod}
                      onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                      {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description / Services</label>
                  <textarea className="form-control" required rows="3" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. General checkup, Blood panel, 2 days ward stay…" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Total Amount (₹)</label>
                    <input type="number" step="0.01" className="form-control" required value={form.totalAmount}
                      onChange={e => setForm({ ...form, totalAmount: e.target.value })} placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Payment Status</label>
                    <select className="form-control" value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="UNPAID">Unpaid — Pending</option>
                      <option value="PAID">Paid — Settled</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Generate Invoice</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── View Details Drawer ── */}
      {viewBill && (
        <div className="modal-overlay" onClick={() => setViewBill(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invoice #INV-{viewBill.id}</h2>
              <button className="close-btn" onClick={() => setViewBill(null)}>&times;</button>
            </div>
            <div className="modal-body">
              {/* Invoice header strip */}
              <div style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: '12px', padding: '20px', color: 'white', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '.75rem', opacity: .8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Patient</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{viewBill.patient?.name}</div>
                    <div style={{ fontSize: '.85rem', opacity: .8 }}>Patient ID #{viewBill.patient?.id}</div>
                  </div>
                  <span style={{ background: viewBill.status === 'PAID' ? '#10b981' : '#f59e0b', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '.85rem' }}>
                    {viewBill.status}
                  </span>
                </div>
              </div>

              {/* Details grid */}
              {[
                { icon: <Tag size={16}/>,      label: 'Bill Type',       val: viewBill.billType?.replace('_',' ') || '—' },
                { icon: <Banknote size={16}/>,  label: 'Payment Method',  val: viewBill.paymentMethod || '—' },
                { icon: <FileText size={16}/>,  label: 'Description',     val: viewBill.description },
                { icon: <CreditCard size={16}/>,label: 'Total Amount',    val: `₹${viewBill.totalAmount?.toFixed(2)}` },
                { icon: <Clock size={16}/>,     label: 'Date Issued',     val: new Date(viewBill.billingDate).toLocaleString('en-IN') },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{val}</span>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                {viewBill.status === 'UNPAID' && (
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { markPaid(viewBill); setViewBill(null); }}>
                    <CheckCircle size={16} /> Mark as Paid
                  </button>
                )}
                <button className="btn" style={{ flex: 1, gap: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Printer size={16} /> Print Invoice
                </button>
                <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(viewBill.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
