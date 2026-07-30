import React, { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Copy } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { partner } = useContext(AppContext);
  const method = searchParams.get('method') || 'pix';

  // Dynamic texts based on payment method
  let methodTitle = 'Pagamento via Pix';
  let descriptionText = 'Copie a chave Pix abaixo para realizar o pagamento.';
  let confirmNotice = 'Confirme o pagamento Pix diretamente com o parceiro.';
  let showPixSection = true;
  let pixLabel = 'Chave Pix (Telefone)';

  if (method === 'cartao') {
    methodTitle = 'Pagamento via Cartão';
    descriptionText = 'Apresente seu cartão para pagamento direto na maquininha do parceiro.';
    confirmNotice = 'Confirme o pagamento em cartão diretamente com o parceiro.';
    showPixSection = false;
  } else if (method === 'dinheiro') {
    methodTitle = 'Pagamento em Dinheiro';
    descriptionText = 'Realize o pagamento em dinheiro físico ou utilize a chave Pix abaixo se preferir.';
    confirmNotice = 'Confirme o pagamento em dinheiro ou Pix diretamente com o parceiro.';
    pixLabel = 'Chave Pix facilitadora (Telefone)';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(partner.phone);
    alert('Chave Pix copiada!');
  };

  return (
    <div className="page payment-page">
      <div className="payment-header">
        <div className="method-badge">
          {methodTitle}
        </div>
        <p>{descriptionText}</p>
      </div>

      <div className="partner-payment-card">
        <div className="partner-payment-avatar">
          {partner.avatar ? (
            <img src={partner.avatar} alt={partner.name} className="partner-avatar-img" />
          ) : (
            <User size={24} color="var(--bg-card)" />
          )}
        </div>
        <div className="partner-payment-info">
          <h3>{partner.name}</h3>
          <p className="confirm-notice">{confirmNotice}</p>
        </div>
      </div>

      {showPixSection && (
        <div className="pix-key-section">
          <p className="label">{pixLabel}</p>
          <div className="copy-box">
            <span className="key-text">{partner.phone}</span>
            <button className="btn-copy" onClick={handleCopy}>
              <Copy size={16} />
              Copiar
            </button>
          </div>
        </div>
      )}

      <div className="value-section">
        <p className="label">Valor</p>
        <h2 className="value">R$ {partner.boxPrice}</h2>
      </div>

      <div className="payment-footer">
        <button className="btn-primary" onClick={() => navigate('/confirmacao')}>
          Já realizei o pagamento
        </button>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Payment;
