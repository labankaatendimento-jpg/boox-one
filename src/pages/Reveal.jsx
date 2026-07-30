import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './Reveal.css';

const Reveal = () => {
  const navigate = useNavigate();
  const { products } = useContext(AppContext);

  // Filter box prizes and pick a random one on mount
  const [winningPrize] = useState(() => {
    const boxPrizes = products.filter((p) => p.isBoxPrize);
    if (boxPrizes.length === 0) {
      return {
        name: 'Prêmio Especial',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'
      };
    }
    const randomIndex = Math.floor(Math.random() * boxPrizes.length);
    return boxPrizes[randomIndex];
  });

  return (
    <div className="page reveal-page">
      <div className="reveal-header">
        <h2>Parabéns!</h2>
        <p>Você ganhou</p>
      </div>

      <div className="prize-reveal-container">
        <div className="glow-effect pulse-burst"></div>
        <div className="prize-image-placeholder">
          <img src={winningPrize.image} alt={winningPrize.name} />
        </div>
      </div>

      <div className="reveal-info">
        <h3>{winningPrize.name}</h3>
        <p>Mostre esta tela ao parceiro.</p>
      </div>

      <div className="reveal-footer">
        <button className="btn-primary" onClick={() => navigate('/sucesso')}>
          Recebi meu prêmio
        </button>
      </div>
    </div>
  );
};

export default Reveal;
