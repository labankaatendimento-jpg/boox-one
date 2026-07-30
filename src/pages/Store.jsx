import React, { useContext, useState } from 'react';
import { Search, Zap, Headphones, BatteryCharging, ShieldAlert, Watch, Speaker } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Store.css';

const Store = () => {
  const { products } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const dynamicCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const categories = ['Todos', ...dynamicCategories];

  // Filter products based on search query, category and active status in store
  const filteredProducts = products.filter((product) => {
    const isAvailable = product.isActiveInStore;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return isAvailable && matchesSearch && matchesCategory;
  });

  return (
    <div className="page store-page">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar produtos" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="section-title">
        <h3>Categorias</h3>
      </div>
      <div className="categories-scroll">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            <span>{cat}</span>
          </div>
        ))}
      </div>

      <div className="section-title">
        <h3>Produtos da loja</h3>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="empty-store">
          <ShieldAlert size={48} color="var(--text-secondary)" opacity={0.5} />
          <p>Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="store-products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="store-product-card">
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} />
              </div>
              <span className="store-product-name">{product.name}</span>
              <div className="store-price-row">
                {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                <span className="store-product-price">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
