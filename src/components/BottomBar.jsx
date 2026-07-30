import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, ShoppingBag, User } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './BottomBar.css';

const BottomBar = () => {
  const { partner } = useContext(AppContext);

  const firstName = partner.name ? partner.name.trim().split(' ')[0] : 'Parceiro';
  const nameFontSize = firstName.length > 10 ? '0.50rem' : firstName.length > 8 ? '0.55rem' : '0.65rem';

  return (
    <nav className="bottom-bar">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <Home size={24} strokeWidth={2} />
        <span>Início</span>
      </NavLink>
      
      <NavLink to="/caixas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Package size={24} strokeWidth={2} />
        <span>Caixas</span>
      </NavLink>
      
      <NavLink to="/loja" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ShoppingBag size={24} strokeWidth={2} />
        <span>Loja</span>
      </NavLink>
      
      <NavLink to="/perfil" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={24} strokeWidth={2} />
        <span style={{ fontSize: nameFontSize }}>{firstName}</span>
      </NavLink>
    </nav>
  );
};

export default BottomBar;
