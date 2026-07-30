import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Phone, MessageCircle, Star, ChevronRight, Settings } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { partner, isLoggedIn, ratePartner } = useContext(AppContext);

  // Review modal state
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewed, setReviewed] = useState(false);

  // Trigger review modal if redirected from success page
  useEffect(() => {
    if (searchParams.get('rate') === 'true') {
      setShowRateModal(true);
      // Clear query params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleWhatsApp = () => {
    const cleanPhone = partner.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    window.open(`https://wa.me/${phoneWithCountry}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${partner.phone.replace(/\D/g, '')}`;
  };

  const handleRateSubmit = (e) => {
    e.preventDefault();
    if (selectedStars === 0) return;
    ratePartner(selectedStars);
    setReviewed(true);
    setTimeout(() => {
      setShowRateModal(false);
      setReviewed(false);
      setSelectedStars(0);
      setComment('');
    }, 1800);
  };

  return (
    <div className="page profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {partner.avatar ? (
            <img src={partner.avatar} alt={partner.name} className="profile-avatar-img" />
          ) : (
            <User size={32} color="var(--bg-card)" />
          )}
        </div>
        <div className="profile-greeting">
          <h2>{partner.name}</h2>
          <p>Parceiro Autorizado</p>
        </div>
        <button 
          className="admin-access-btn" 
          onClick={() => navigate(isLoggedIn ? '/admin/dashboard' : '/admin/login')}
          title="Acessar Painel Administrativo"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <span className="stat-number">{partner.rating}</span>
          <span className="stat-label">Avaliação<br/>⭐️</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{partner.deliveries}</span>
          <span className="stat-label">Caixas<br/>entregues</span>
        </div>
        <div className="stat-box highlight-stat">
          <span className="stat-number">{partner.responseTime}</span>
          <span className="stat-label">Tempo de<br/>resposta</span>
        </div>
      </div>

      <div className="profile-links">
        <div className="profile-link-item" onClick={handleWhatsApp}>
          <MessageCircle size={20} className="link-icon" color="var(--color-green)" />
          <span>Enviar mensagem (WhatsApp)</span>
          <ChevronRight size={16} className="chevron" />
        </div>
        
        <div className="profile-link-item" onClick={handleCall}>
          <Phone size={20} className="link-icon" />
          <span>Ligar para o parceiro</span>
          <ChevronRight size={16} className="chevron" />
        </div>
        
        <div className="profile-link-item" onClick={() => setShowRateModal(true)}>
          <Star size={20} className="link-icon" color="#F59E0B" />
          <span>Avaliar parceiro</span>
          <ChevronRight size={16} className="chevron" />
        </div>
      </div>

      {/* Review Modal */}
      {showRateModal && (
        <div className="rate-modal-overlay">
          <div className="rate-modal-content">
            {!reviewed ? (
              <form onSubmit={handleRateSubmit}>
                <h3>Avaliar {partner.name}</h3>
                <p>Escolha de 1 a 5 estrelas para classificar o atendimento:</p>
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={32}
                      className={`star-icon ${star <= (hoveredStars || selectedStars) ? 'filled' : ''}`}
                      onMouseEnter={() => setHoveredStars(star)}
                      onMouseLeave={() => setHoveredStars(0)}
                      onClick={() => setSelectedStars(star)}
                    />
                  ))}
                </div>
                <textarea
                  placeholder="Deixe um comentário sobre o parceiro (opcional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowRateModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={selectedStars === 0}>
                    Enviar Avaliação
                  </button>
                </div>
              </form>
            ) : (
              <div className="rate-success-view">
                <span className="success-check">🎉</span>
                <h3>Obrigado!</h3>
                <p>Sua avaliação foi enviada e o status do parceiro foi atualizado.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
