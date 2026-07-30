import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialProducts = [
  { id: 1, name: 'Smartwatch Premium', price: 'R$ 79,90', oldPrice: 'R$ 149,90', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80', isBoxPrize: true, isActiveInStore: true, category: 'Acessórios' },
  { id: 2, name: 'Fone Bluetooth Pro', price: 'R$ 79,90', oldPrice: 'R$ 149,90', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80', isBoxPrize: true, isActiveInStore: true, category: 'Áudio' },
  { id: 3, name: 'Power Bank 10.000mAh', price: 'R$ 89,90', oldPrice: 'R$ 159,90', image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=300&q=80', isBoxPrize: true, isActiveInStore: true, category: 'Energia' },
  { id: 4, name: 'Cabo Turbo Lightning', price: 'R$ 19,90', oldPrice: 'R$ 49,90', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80', isBoxPrize: true, isActiveInStore: true, category: 'Cabos' },
  { id: 5, name: 'Fonte 20W Turbo', price: 'R$ 39,90', oldPrice: 'R$ 89,90', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80', isBoxPrize: true, isActiveInStore: true, category: 'Energia' },
  { id: 6, name: 'Suporte Veicular', price: 'R$ 29,90', oldPrice: 'R$ 59,90', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&q=80', isBoxPrize: true, isActiveInStore: true, category: 'Outros' },
];

const initialPartner = {
  name: 'Carlos',
  phone: '(11) 99999-9999',
  avatar: '',
  boxPrice: '19,90',
  rating: '5.0',
  ratingsCount: 124,
  deliveries: '1k+',
  responseTime: '2 min',
  paymentMethods: {
    pix: true,
    cartao: true,
    dinheiro: true
  },
  storeCategory: 'Acessórios'
};

export const AppProvider = ({ children }) => {
  const [partner, setPartner] = useState(() => {
    // Check if there is a unique partner link in the URL
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(p))));
        const newPartner = { ...initialPartner, ...decoded };
        localStorage.setItem('boox_partner', JSON.stringify(newPartner));
        // Remove the query param from URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
        return newPartner;
      } catch(e) {
        console.error("Invalid partner link");
      }
    }
    const saved = localStorage.getItem('boox_partner');
    return saved ? JSON.parse(saved) : initialPartner;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('boox_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('boox_logged');
    return saved === 'true';
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('boox_theme');
    return saved || 'dark';
  });

  // Sync to localStorage and body class
  useEffect(() => {
    localStorage.setItem('boox_partner', JSON.stringify(partner));
  }, [partner]);

  useEffect(() => {
    localStorage.setItem('boox_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('boox_logged', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('boox_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductBoxPrize = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBoxPrize: !p.isBoxPrize } : p))
    );
  };

  const toggleProductStoreActive = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActiveInStore: !p.isActiveInStore } : p))
    );
  };

  const ratePartner = (stars) => {
    setPartner((prev) => {
      const currentCount = prev.ratingsCount ? parseInt(prev.ratingsCount) : 124;
      const currentRating = parseFloat(prev.rating) || 5.0;
      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + stars) / newCount;
      return {
        ...prev,
        rating: newRating.toFixed(1),
        ratingsCount: newCount
      };
    });
  };

  const loginPartner = (name, phone) => {
    setPartner((prev) => ({ ...prev, name, phone }));
    setIsLoggedIn(true);
  };

  const logoutPartner = () => {
    setIsLoggedIn(false);
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
        ratePartner,
        isLoggedIn,
        loginPartner,
        logoutPartner,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
