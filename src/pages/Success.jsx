import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Gift, Star, UserCheck } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Success.css';

const Success = () => {
  const navigate = useNavigate();
  const { partner } = useContext(AppContext);

  const handleFavoritePartner = () => {
    const cleanPhone = partner.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const message = `Olá ${partner.name}! Quero favoritar o seu contato para acompanhar as novidades da sua Box.`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="page success-page">
      <div className="success-header">
        <h2>Obrigado por participar!</h2>
        <p>Sua experiência foi concluída com sucesso.</p>
      </div>

      <div className="success-actions">
        <button className="btn-primary" onClick={() => navigate('/caixas')}>
          Abrir outra caixa
        </button>
      </div>

      <div className="links-list">
        <div className="link-card" onClick={() => navigate('/loja')}>
          <div className="link-icon"><ShoppingBag size={20} /></div>
          <div className="link-info">
            <h3>Loja de {partner.storeCategory || 'Acessórios'}</h3>
            <p>Confira produtos incríveis com preços especiais.</p>
          </div>
        </div>

        <div className="link-card" onClick={handleFavoritePartner}>
          <div className="link-icon"><UserCheck size={20} color="var(--color-green)" /></div>
          <div className="link-info">
            <h3>Favoritar {partner.name}</h3>
            <p>Favoritar para comprar de novo</p>
          </div>
        </div>

        <div className="link-card" onClick={() => navigate('/perfil?rate=true')}>
          <div className="link-icon"><Star size={20} color="#F59E0B" /></div>
          <div className="link-info">
            <h3>Avaliar {partner.name}</h3>
            <p>Deixe sua avaliação sobre o parceiro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
