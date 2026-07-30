import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Lock, Phone, User, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PartnerLogin.css';

const PartnerLogin = () => {
  const navigate = useNavigate();
  const { setPartner } = useContext(AppContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name || !phone || !email || !password) {
          throw new Error('Por favor, preencha todos os campos.');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Generate unique slug
          const baseSlug = name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          
          let finalSlug = baseSlug;
          let counter = 2;
          
          // Check for existing slug loop (safe limit to avoid infinite loops)
          for (let i = 0; i < 50; i++) {
            const { data: existingSlug } = await supabase
              .from('partners')
              .select('slug')
              .eq('slug', finalSlug)
              .maybeSingle();
              
            if (!existingSlug) break; // Unique!
            
            finalSlug = `${baseSlug}-${counter}`;
            counter++;
          }

          const { error: profileError } = await supabase.from('partners').insert([{
            id: authData.user.id,
            slug: finalSlug,
            email,
            name,
            phone,
            box_price: '19,90',
            store_category: 'Acessórios'
          }]);

          if (profileError) throw profileError;

          // Update context immediately to avoid race condition with onAuthStateChange
          setPartner((prev) => ({
            ...prev,
            id: authData.user.id,
            slug: finalSlug,
            email,
            name,
            phone,
            boxPrice: '19,90',
            storeCategory: 'Acessórios',
            avatar: '',
            pixKey: '',
            paymentMethods: { pix: true, cartao: true, dinheiro: true }
          }));
        }

      } else {
        if (!email || !password) {
          throw new Error('Por favor, preencha email e senha.');
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw authError;
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-header">
        <div className="brand-logo">BOOX<span>•</span>ONE</div>
        <h2>Painel do Parceiro</h2>
        <p>Acesse para gerenciar seus produtos e caixas.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        {isSignUp && (
          <>
            <div className="input-group">
              <label>Seu Nome</label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="Ex: Carlos Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Telefone / WhatsApp</label>
              <div className="input-wrapper">
                <Phone size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="Ex: (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <div className="input-group">
          <label>E-mail</label>
          <div className="input-wrapper">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Senha de Acesso</label>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary login-btn" disabled={loading}>
          {loading ? 'Aguarde...' : (isSignUp ? 'Criar Conta' : 'Entrar no Painel')}
        </button>

        <div className="auth-toggle">
          {isSignUp ? (
            <p>Já tem uma conta? <span onClick={() => setIsSignUp(false)}>Fazer Login</span></p>
          ) : (
            <p>Não tem uma conta? <span onClick={() => setIsSignUp(true)}>Criar Conta</span></p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PartnerLogin;
