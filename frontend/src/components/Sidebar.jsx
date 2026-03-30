import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, User, Calendar, HeartPulse, Pill, FileText, CreditCard } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <HeartPulse color="#4cc9f0" size={28} />
        <span className="brand-text">Apollo Hospital</span>
      </div>
      
      <ul className="nav-menu">
        <li>
          <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/patients" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            Patients
          </NavLink>
        </li>
        <li>
          <NavLink to="/doctors" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            Doctors
          </NavLink>
        </li>
        <li>
          <NavLink to="/appointments" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={20} />
            Appointments
          </NavLink>
        </li>
        <li>
          <NavLink to="/pharmacy" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Pill size={20} />
            Pharmacy
          </NavLink>
        </li>
        <li>
          <NavLink to="/prescriptions" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            Prescriptions
          </NavLink>
        </li>
        <li>
          <NavLink to="/billing" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <CreditCard size={20} />
            Billing
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
