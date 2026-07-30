import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomBar from './components/BottomBar';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Prizes from './pages/Prizes';
import PaymentMethod from './pages/PaymentMethod';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Reveal from './pages/Reveal';
import Success from './pages/Success';
import Store from './pages/Store';
import Profile from './pages/Profile';
import PartnerLogin from './pages/PartnerLogin';
import PartnerAdmin from './pages/PartnerAdmin';

// Component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Component to handle bottom bar visibility
const BottomBarWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return !isAdminRoute ? <BottomBar /> : null;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/caixas" element={<Welcome />} />
            <Route path="/premios" element={<Prizes />} />
            <Route path="/pagamento-metodo" element={<PaymentMethod />} />
            <Route path="/pagamento" element={<Payment />} />
            <Route path="/confirmacao" element={<Confirmation />} />
            <Route path="/revelacao" element={<Reveal />} />
            <Route path="/sucesso" element={<Success />} />

            <Route path="/loja" element={<Store />} />
            <Route path="/perfil" element={<Profile />} />
            
            <Route path="/admin/login" element={<PartnerLogin />} />
            <Route path="/admin/dashboard" element={<PartnerAdmin />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomBarWrapper />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
