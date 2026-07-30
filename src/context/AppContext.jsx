import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AppContext = createContext();

const initialPartner = {
  id: '',
  name: 'Carregando...',
  phone: '',
  avatar: '',
  boxPrice: '19,90',
  rating: '5.0',
  ratingsCount: 124,
  deliveries: '1k+',
  responseTime: '2 min',
  pixKey: '',
  paymentMethods: { pix: true, cartao: true, dinheiro: true },
  storeCategory: 'Acessórios'
};



export const AppProvider = ({ children }) => {
  const [partner, setPartner] = useState(initialPartner);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('boox_theme');
    return saved || 'dark';
  });

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        loadPartnerData(session.user.id);
      } else {
        checkUrlForPartner();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        loadPartnerData(session.user.id);
      } else {
        setIsLoggedIn(false);
        setPartner(initialPartner);
        setProducts([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUrlForPartner = async () => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p'); // ID do parceiro
    if (p) {
      await loadPartnerData(p);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Load last visited partner from local storage if any
      const savedPartnerId = localStorage.getItem('last_partner_id');
      if (savedPartnerId) {
        await loadPartnerData(savedPartnerId);
      } else {
        setLoading(false);
      }
    }
  };

  const loadPartnerData = async (partnerId) => {
    setLoading(true);
    try {
      // 1. Fetch partner details
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('id', partnerId)
        .single();
      
      if (partnerData) {
        setPartner({
          id: partnerData.id,
          name: partnerData.name,
          phone: partnerData.phone,
          boxPrice: partnerData.box_price,
          storeCategory: partnerData.store_category,
          avatar: partnerData.avatar,
          rating: partnerData.rating,
          ratingsCount: partnerData.ratings_count,
          deliveries: partnerData.deliveries,
          responseTime: partnerData.response_time,
          pixKey: partnerData.pix_key || '',
          paymentMethods: partnerData.payment_methods || { pix: true, cartao: true, dinheiro: true }
        });
        localStorage.setItem('last_partner_id', partnerId);
      }

      // 2. Fetch partner products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('partner_id', partnerId);
      
      if (productsData) {
        setProducts(productsData.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          oldPrice: p.old_price,
          image: p.image,
          isBoxPrize: p.is_box_prize,
          isActiveInStore: p.is_active_in_store,
          category: p.category
        })));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    localStorage.setItem('boox_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const addProduct = async (product) => {
    if (!partner.id) return;
    
    // Optimistic UI update
    const tempId = Date.now().toString();
    setProducts((prev) => [...prev, { ...product, id: tempId }]);

    const { data, error } = await supabase.from('products').insert([{
      partner_id: partner.id,
      name: product.name,
      price: product.price,
      old_price: product.oldPrice,
      image: product.image,
      is_box_prize: product.isBoxPrize,
      is_active_in_store: product.isActiveInStore,
      category: product.category
    }]).select().single();

    if (data && !error) {
      setProducts((prev) => prev.map(p => p.id === tempId ? {
        id: data.id,
        name: data.name,
        price: data.price,
        oldPrice: data.old_price,
        image: data.image,
        isBoxPrize: data.is_box_prize,
        isActiveInStore: data.is_active_in_store,
        category: data.category
      } : p));
    }
  };

  const removeProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const toggleProductBoxPrize = async (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isBoxPrize: !p.isBoxPrize } : p)));
    await supabase.from('products').update({ is_box_prize: !prod.isBoxPrize }).eq('id', id);
  };

  const toggleProductStoreActive = async (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActiveInStore: !p.isActiveInStore } : p)));
    await supabase.from('products').update({ is_active_in_store: !prod.isActiveInStore }).eq('id', id);
  };

  const logoutPartner = async () => {
    await supabase.auth.signOut();
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider
      value={{
        partner,
        setPartner,
        products,
        setProducts,
        addProduct,
        removeProduct,
        toggleProductBoxPrize,
        toggleProductStoreActive,
        isLoggedIn,
        logoutPartner,
        theme,
        toggleTheme,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
