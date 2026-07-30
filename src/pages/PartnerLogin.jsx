import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Lock, Phone, User } from 'lucide-react';
import './PartnerLogin.css';

const PartnerLogin = () => {
  const navigate = useNavigate();
  const { loginPartner } = useContext(AppContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    // For demo purposes, any password is accepted, but let's encourage 123456
    loginPartner(name, phone);
    navigate('/admin/dashboard');
  };

  return (
    <div className="page login-page">
      <div className="login-header">
        <div className="brand-logo">BOOX<span>•</span>ONE</div>
        <h2>Painel do Parceiro</h2>
        <p>Acesse para gerenciar seus produtos e caixas.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label>Seu Nome</label>
          <div className="input-wrapper">
            <User size={20} className="input-icon" />
            <input
              type="text"
              placeholder="Ex: Carlos Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Telefone / WhatsApp</label>
          <div className="input-wrapper">
            <Phone size={20} className="input-icon" />
            <input
              type="text"
              placeholder="Ex: (11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Senha de Acesso</label>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <span className="helper-text">Pode digitar qualquer senha para demonstração</span>
        </div>

        <button type="submit" className="btn-primary login-btn">
          Entrar no Painel
        </button>
      </form>
    </div>
  );
};

export default PartnerLogin;
