import React, { useContext } from 'react';
import { BatteryCharging, Headphones, Zap, Smartphone, Watch, PackageOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { partner, products } = useContext(AppContext);
  const partnerName = partner.name;
  
  // Exibir apenas os primeiros 4 produtos ativos no catálogo da loja
  const highlightedProducts = products.filter((p) => p.isActiveInStore).slice(0, 4);

  return (
    <div className="page home-page">
      <div className="home-header">
        <div className="brand-logo">BOOX<span>•</span>ONE</div>
        <img src="/favicon.png" alt="Caixa Misteriosa" className="home-hero-icon" />
        <p className="home-tagline">Abra <span>•</span> Descubra <span>•</span> Ganhe</p>
      </div>

      <div className="mystery-box-banner" onClick={() => navigate('/caixas')}>
        <img src="/banner.jpg" alt="Caixa Misteriosa BOOX ONE" />
      </div>

      <div className="page-header left-align">
        <h2>Destaques para você</h2>
        <p>Produtos com preços especiais para você aproveitar!</p>
      </div>

      <div className="products-grid">
        {highlightedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.name} />
            </div>
            <span className="product-name">{product.name}</span>
            <div className="price-container">
              <span className="old-price">{product.oldPrice}</span>
              <span className="current-price">{product.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="home-footer">
        <button 
          className="btn-primary" 
          style={{ backgroundColor: 'transparent', border: '1px solid var(--color-green)', color: 'var(--color-green)' }}
          onClick={() => navigate('/loja')}
        >
          Ver catálogo completo
        </button>
      </div>
    </div>
  );
};

export default Home;
