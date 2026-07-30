import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="page welcome-page">
      <div className="welcome-header">
        <h1>Bem-vindo!</h1>
        <p>Descubra um prêmio em menos de 30 segundos.</p>
      </div>

      <div className="gift-box-container">
        <img src="/glowing_gift_box.png" alt="Caixa Surpresa" className="gift-box-image" />
      </div>

      <div className="welcome-footer">
        <p className="instruction-text">
          Você pode ganhar produtos incríveis retirando imediatamente com o parceiro.
        </p>
        
        <button className="btn-primary" onClick={() => navigate('/premios')}>
          Começar
        </button>

        <div className="trust-badge">
          <ShieldCheck size={16} className="trust-icon" />
          <span>Mais de 12.400 prêmios já foram revelados!</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
