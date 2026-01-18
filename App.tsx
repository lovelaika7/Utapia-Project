import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SongDetail from './pages/SongDetail';
import { ThemeProvider } from './components/ThemeContext';
import { UIProvider } from './components/UIContext';
import { FloatingControls, RequestSongModal } from './components/GlobalControls';

// ScrollToTop Component to handle scroll restoration on mobile/desktop
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UIProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow md:pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/song/:id" element={<SongDetail />} />
              </Routes>
            </main>
            {/* Global UI Elements */}
            <FloatingControls />
            <RequestSongModal />
          </div>
        </Router>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;