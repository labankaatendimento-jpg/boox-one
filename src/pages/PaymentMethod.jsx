import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './PaymentMethod.css';

const methods = [
  { id: 'pix', title: 'Pix', subtitle: 'Pagamento instantâneo', icon: <Hexagon size={24} fill="var(--color-green)" color="var(--color-green)" /> },
  { id: 'cartao', title: 'Cartão', subtitle: 'Crédito ou débito', icon: <CreditCard size={24} color="#F59E0B" /> },
  { id: 'dinheiro', title: 'Dinheiro', subtitle: 'Pague diretamente ao parceiro', icon: <Wallet size={24} color="#F97316" /> },
];

const PaymentMethod = () => {
  const navigate = useNavigate();
  const { partner } = useContext(AppContext);

  // Get only checked methods from partner dashboard settings
  const activeMethods = methods.filter((m) => {
    if (partner.paymentMethods) {
      return partner.paymentMethods[m.id];
    }
    return true;
  });

  const [selected, setSelected] = useState(() => {
    return activeMethods.length > 0 ? activeMethods[0].id : 'pix';
  });

  const handleContinue = () => {
    navigate(`/pagamento?method=${selected}`);
  };

  return (
    <div className="page payment-method-page">
      <div className="page-header left-align">
        <h2>Forma de pagamento</h2>
        <p>Escolha como deseja pagar:</p>
      </div>

      <div className="methods-list">
        {activeMethods.length === 0 ? (
          <p className="no-methods-desc">Nenhum meio de pagamento disponível. Por favor, contate o parceiro.</p>
        ) : (
          activeMethods.map((method) => (
            <div 
              key={method.id} 
              className={`method-card ${selected === method.id ? 'selected' : ''}`}
              onClick={() => setSelected(method.id)}
            >
              <div className="method-icon">{method.icon}</div>
              <div className="method-info">
                <h3>{method.title}</h3>
                <p>{method.subtitle}</p>
              </div>
              <div className="radio-circle">
                {selected === method.id && <div className="radio-inner" />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="info-box">
        <AlertCircle size={20} className="info-icon" />
        <p>
          O pagamento é realizado diretamente ao parceiro. Nossa plataforma apenas registra a confirmação da entrega.
        </p>
      </div>

      <div className="methods-footer">
        <button className="btn-primary" onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
