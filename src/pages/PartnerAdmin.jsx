import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LogOut, Sun, Moon, Plus, Trash2, Save, Upload, Gift, Link as LinkIcon, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PartnerAdmin.css';

const PartnerAdmin = () => {
  const navigate = useNavigate();
  const {
    partner,
    setPartner,
    products,
    addProduct,
    removeProduct,
    toggleProductBoxPrize,
    toggleProductStoreActive,
    isLoggedIn,
    logoutPartner,
    theme,
    toggleTheme
  } = useContext(AppContext);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  // Edit Partner profile state
  const [partnerName, setPartnerName] = useState(partner.name);
  const [partnerPhone, setPartnerPhone] = useState(partner.phone);
  const [partnerBoxPrice, setPartnerBoxPrice] = useState(partner.boxPrice || '19,90');
  const [partnerStoreCategory, setPartnerStoreCategory] = useState(partner.storeCategory || 'Acessórios');
  const [partnerAvatar, setPartnerAvatar] = useState(partner.avatar || '');
  const [partnerPixKey, setPartnerPixKey] = useState(partner.pixKey || '');
  const [acceptPix, setAcceptPix] = useState(partner.paymentMethods?.pix ?? true);
  const [acceptCartao, setAcceptCartao] = useState(partner.paymentMethods?.cartao ?? true);
  const [acceptDinheiro, setAcceptDinheiro] = useState(partner.paymentMethods?.dinheiro ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Add Product form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOldPrice, setProdOldPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Acessórios');
  const [prodImage, setProdImage] = useState('');
  const [isBoxPrize, setIsBoxPrize] = useState(false);
  const [isActiveInStore, setIsActiveInStore] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPartnerName(partner.name);
    setPartnerPhone(partner.phone);
    setPartnerBoxPrice(partner.boxPrice);
    setPartnerStoreCategory(partner.storeCategory);
    setPartnerAvatar(partner.avatar || '');
    setPartnerPixKey(partner.pixKey || '');
    setAcceptPix(partner.paymentMethods?.pix ?? true);
    setAcceptCartao(partner.paymentMethods?.cartao ?? true);
    setAcceptDinheiro(partner.paymentMethods?.dinheiro ?? true);
  }, [partner]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!partner.id) {
      alert("Aguarde o carregamento do perfil ou faça login novamente.");
      return;
    }
    setSaveSuccess(false);

    try {
      const { error } = await supabase.from('partners').update({
        name: partnerName,
        phone: partnerPhone,
        box_price: partnerBoxPrice,
        store_category: partnerStoreCategory,
        avatar: partnerAvatar,
        pix_key: partnerPixKey,
        payment_methods: { pix: acceptPix, cartao: acceptCartao, dinheiro: acceptDinheiro }
      }).eq('id', partner.id);

      if (error) throw error;

      setPartner((prev) => ({
        ...prev,
        name: partnerName,
        phone: partnerPhone,
        boxPrice: partnerBoxPrice,
        storeCategory: partnerStoreCategory,
        avatar: partnerAvatar,
        pixKey: partnerPixKey,
        paymentMethods: { pix: acceptPix, cartao: acceptCartao, dinheiro: acceptDinheiro }
      }));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/perfil');
      }, 800);
    } catch (error) {
      alert("Erro ao salvar perfil: " + error.message);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPartnerAvatar(reader.result);
      setAvatarUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProdImage(reader.result); // Base64 string
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    addProduct({
      name: prodName,
      price: `R$ ${parseFloat(prodPrice.replace('R$', '').trim()).toFixed(2).replace('.', ',')}`,
      oldPrice: prodOldPrice ? `R$ ${parseFloat(prodOldPrice.replace('R$', '').trim()).toFixed(2).replace('.', ',')}` : '',
      image: prodImage || 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&q=80',
      isBoxPrize,
      isActiveInStore,
      category: prodCategory
    });

    // Reset Form
    setProdName('');
    setProdPrice('');
    setProdOldPrice('');
    setProdImage('');
    setIsBoxPrize(false);
    setIsActiveInStore(true);
    setShowAddForm(false);
  };

  const handleLogout = () => {
    logoutPartner();
    navigate('/');
  };

  const generateShareLink = () => {
    return `${window.location.origin}/?p=${partner.id}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generateShareLink());
    alert('Link exclusivo copiado com sucesso! Envie para seus clientes.');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <div>
          <h2>Painel Administrativo</h2>
          <p className="admin-subtitle">Gerencie suas configurações e catálogo</p>
        </div>
        <div className="admin-header-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Alternar tema">
            {theme === 'dark' ? <Sun size={20} color="var(--color-green)" /> : <Moon size={20} />}
          </button>
          <button className="logout-btn" onClick={handleLogout} title="Sair do painel">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <section className="admin-section share-link-section">
        <div className="share-link-header">
          <LinkIcon size={20} color="var(--color-green)" />
          <h3>Seu Link Exclusivo</h3>
        </div>
        <p className="share-link-desc">
          Compartilhe este link com seus clientes. Quando eles acessarem, a loja será configurada automaticamente com o seu nome e seu contato!
        </p>
        <div className="share-link-box">
          <input type="text" readOnly value={generateShareLink()} className="share-link-input" />
          <button className="btn-copy-link" onClick={handleCopyLink} title="Copiar Link">
            <Copy size={18} /> Copiar
          </button>
        </div>
      </section>

      <section className="admin-section">
        <h3>Dados do Parceiro (Perfil)</h3>
        <form onSubmit={handleSaveProfile} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nome do Parceiro</label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefone / WhatsApp</label>
              <input
                type="text"
                value={partnerPhone}
                onChange={(e) => setPartnerPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Preço da Caixa Surpresa (R$)</label>
              <input
                type="text"
                placeholder="Ex: 19,90"
                value={partnerBoxPrice}
                onChange={(e) => setPartnerBoxPrice(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Categoria Principal da Loja</label>
              <select
                value={partnerStoreCategory}
                onChange={(e) => setPartnerStoreCategory(e.target.value)}
                required
              >
                <option value="Acessórios">Acessórios</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Roupas e Moda">Roupas e Moda</option>
                <option value="Beleza e Perfumaria">Beleza e Perfumaria</option>
                <option value="Casa e Decoração">Casa e Decoração</option>
                <option value="Esportes e Lazer">Esportes e Lazer</option>
                <option value="Brinquedos">Brinquedos</option>
                <option value="Calçados">Calçados</option>
                <option value="Livros e Papelaria">Livros e Papelaria</option>
                <option value="Diversos">Diversos</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sua Chave PIX</label>
              <input
                type="text"
                placeholder="Ex: seuemail@pix.com.br ou (11) 99999-9999"
                value={partnerPixKey}
                onChange={(e) => setPartnerPixKey(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Foto de Perfil do Parceiro</label>
            <div className="avatar-upload-row">
              <div className="avatar-preview-box">
                {partnerAvatar ? (
                  <img src={partnerAvatar} alt="Foto Perfil" />
                ) : (
                  <div className="avatar-fallback-icon">📸</div>
                )}
              </div>
              <label className="avatar-file-label">
                <span>{avatarUploading ? 'Enviando...' : 'Carregar Nova Foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                  style={{ display: 'none' }}
                />
              </label>
              {partnerAvatar && (
                <button type="button" className="btn-remove-avatar" onClick={() => setPartnerAvatar('')}>
                  Remover
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Meios de Pagamento Aceitos</label>
            <div className="checkbox-options-grid">
              <label className="checkbox-option-item">
                <input
                  type="checkbox"
                  checked={acceptPix}
                  onChange={(e) => setAcceptPix(e.target.checked)}
                />
                <span>Pix</span>
              </label>

              <label className="checkbox-option-item">
                <input
                  type="checkbox"
                  checked={acceptCartao}
                  onChange={(e) => setAcceptCartao(e.target.checked)}
                />
                <span>Cartão (Maquininha)</span>
              </label>

              <label className="checkbox-option-item">
                <input
                  type="checkbox"
                  checked={acceptDinheiro}
                  onChange={(e) => setAcceptDinheiro(e.target.checked)}
                />
                <span>Dinheiro Físico</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary admin-save-btn">
            <Save size={18} style={{ marginRight: '8px' }} />
            Salvar Dados
          </button>
          {saveSuccess && <span className="save-success-msg">Salvo com sucesso!</span>}
        </form>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h3>Catálogo de Produtos</h3>
          <button className="btn-add-product" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={18} />
            {showAddForm ? 'Cancelar' : 'Novo Produto'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddProduct} className="add-product-form">
            <h4>Cadastrar Novo Produto</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Nome do Produto</label>
                <input
                  type="text"
                  placeholder="Ex: Fone Gamer Pro"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select 
                  value={prodCategory} 
                  onChange={(e) => setProdCategory(e.target.value)}
                  required
                >
                  <option value="Acessórios">Acessórios</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Roupas e Moda">Roupas e Moda</option>
                  <option value="Beleza e Perfumaria">Beleza e Perfumaria</option>
                  <option value="Casa e Decoração">Casa e Decoração</option>
                  <option value="Esportes e Lazer">Esportes e Lazer</option>
                  <option value="Brinquedos">Brinquedos</option>
                  <option value="Calçados">Calçados</option>
                  <option value="Livros e Papelaria">Livros e Papelaria</option>
                  <option value="Diversos">Diversos</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preço de Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 59.90"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Preço Antigo (R$) - Opcional</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 99.90"
                  value={prodOldPrice}
                  onChange={(e) => setProdOldPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isBoxPrize"
                checked={isBoxPrize}
                onChange={(e) => setIsBoxPrize(e.target.checked)}
              />
              <label htmlFor="isBoxPrize">Disponível como prêmio na Caixa Misteriosa</label>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isActiveInStore"
                checked={isActiveInStore}
                onChange={(e) => setIsActiveInStore(e.target.checked)}
              />
              <label htmlFor="isActiveInStore">Ativo para compra no catálogo da loja</label>
            </div>

            <div className="form-group">
              <label>Foto do Produto</label>
              <div className="photo-upload-container">
                {prodImage ? (
                  <div className="uploaded-photo-preview">
                    <img src={prodImage} alt="Preview" />
                    <button type="button" onClick={() => setProdImage('')}>Remover foto</button>
                  </div>
                ) : (
                  <label className="photo-upload-label">
                    <Upload size={24} />
                    <span>{uploading ? 'Carregando...' : 'Selecionar Imagem do Dispositivo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Cadastrar Produto
            </button>
          </form>
        )}

        {/* Listagem de Produtos Cadastrados */}
        <div className="admin-products-list">
          {products.map((prod) => (
            <div key={prod.id} className="admin-product-card">
              <div className="admin-prod-img-wrapper">
                <img src={prod.image} alt={prod.name} />
              </div>
              <div className="admin-prod-details">
                <div className="admin-prod-name-row">
                  <h4>{prod.name}</h4>
                  <span className="admin-prod-cat">{prod.category}</span>
                </div>
                <div className="admin-prod-prices">
                  {prod.oldPrice && <span className="old-price">{prod.oldPrice}</span>}
                  <span className="current-price">{prod.price}</span>
                </div>
                <div className="admin-prod-flags">
                  <label className="checkbox-mini-toggle">
                    <input 
                      type="checkbox" 
                      checked={prod.isBoxPrize}
                      onChange={() => toggleProductBoxPrize(prod.id)}
                    />
                    <Gift size={12} style={{ marginRight: '2px' }} />
                    Prêmio da Caixa
                  </label>
                  
                  <label className="checkbox-mini-toggle" style={{ marginLeft: '12px' }}>
                    <input 
                      type="checkbox" 
                      checked={prod.isActiveInStore}
                      onChange={() => toggleProductStoreActive(prod.id)}
                    />
                    Ativo na Loja
                  </label>
                </div>
              </div>
              <button className="delete-prod-btn" onClick={() => removeProduct(prod.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PartnerAdmin;
