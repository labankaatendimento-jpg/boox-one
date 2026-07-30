import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import './Confirmation.css';

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate the driver's confirmation after 4 seconds
    const timer = setTimeout(() => {
      navigate('/revelacao');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page confirmation-page">
      <div className="confirmation-header">
        <Clock size={32} className="clock-icon" strokeWidth={1.5} />
        <h2>Aguardando confirmação do parceiro...</h2>
        <p>O pagamento foi informado. Assim que o parceiro confirmar, sua surpresa será revelada!</p>
      </div>

      <div className="gift-box-container waiting-box">
        <div className="glow-effect pulse"></div>
        <img src="/glowing_gift_box.png" alt="Caixa Surpresa" className="gift-box-image" />
      </div>

      <div className="confirmation-footer">
        <div className="info-badge">
          <Clock size={14} />
          <span>Fique tranquilo, isso costuma levar poucos segundos.</span>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
