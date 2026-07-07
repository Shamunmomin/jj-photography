import { useState, useEffect, lazy, Suspense } from 'react';
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

function App() {
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

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
        {page === 'home' ? (
          <HomePage
            key="home"
            onNavigate={setPage}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        ) : page === 'comparisons' ? (
          <ComparisonPage
            key="comparisons"
            onBack={() => setPage('home')}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        ) : (
          <GalleryPage
            key={page}
            category={page}
            onBack={() => setPage('home')}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
