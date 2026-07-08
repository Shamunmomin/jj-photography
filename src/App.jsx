import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage = lazy(() => import('./pages/HomePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));

function Loading() {
  return (
    <div className="page-loading">
      <motion.div
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="loading-ring" />
      </motion.div>
    </div>
  );
}

function AppLayout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#f8f8f8' : '#0a0a0a');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <Suspense fallback={<Loading />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/comparisons" element={<ComparisonPage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/gallery" element={<Navigate to="/gallery/weddings" replace />} />
          <Route path="/gallery/:category" element={<GalleryPage theme={theme} toggleTheme={toggleTheme} />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return <AppLayout />;
}
