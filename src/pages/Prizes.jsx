import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Prizes.css';

const Prizes = () => {
  const navigate = useNavigate();
  const { products } = useContext(AppContext);

  // Filter box prizes dynamically
  const boxPrizes = products.filter((p) => p.isBoxPrize);

  return (
    <div className="page prizes-page">
      <div className="page-header">
        <div className="icon-badge"><Gift size={24} color="var(--color-green)" /></div>
        <h2>Prêmios possíveis</h2>
        <p>Você pode ganhar um destes produtos:</p>
      </div>

      <div className="prizes-grid">
        {boxPrizes.map((prize) => (
          <div key={prize.id} className="prize-card">
            <div className="prize-image-wrapper">
              <img src={prize.image} alt={prize.name} />
            </div>
            <span className="prize-name">{prize.name}</span>
          </div>
        ))}
      </div>

      <div className="prizes-footer">
        <p className="disclaimer-text">
          Você receberá apenas um produto desta lista.
        </p>
        <button className="btn-primary" onClick={() => navigate('/pagamento-metodo')}>
          Quero participar
        </button>
      </div>
    </div>
  );
};

export default Prizes;
