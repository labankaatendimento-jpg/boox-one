import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, ShoppingBag, User } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './BottomBar.css';

const BottomBar = () => {
  const { partner } = useContext(AppContext);

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
        <span>{partner.name || 'Parceiro'}</span>
      </NavLink>
    </nav>
  );
};

export default BottomBar;
