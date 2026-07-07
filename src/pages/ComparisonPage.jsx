import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react';
import ImageComparison from '../components/ImageComparison';
import { comparisons } from '../data/comparisons';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export default function ComparisonPage({ onBack, theme, toggleTheme }) {
  const sectionRef = useRef(null);

  return (
    <motion.div
      className="gallery-page"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <header className="gallery-header">
        <div className="gallery-header-top">
          <motion.button
            className="gallery-back-btn"
            onClick={onBack}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={22} />
            <span>Back</span>
          </motion.button>
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
        </div>

        <motion.div
          className="gallery-header-content"
          initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="gallery-subtitle">Before & After</span>
          <h1 className="gallery-title">Image Comparisons</h1>
          <p className="gallery-desc">
            Slide the divider to see the transformation — witness the art of professional photo editing
          </p>
        </motion.div>
      </header>

      <div className="comparison-grid" ref={sectionRef}>
        <motion.div
          className="comparison-grid-inner"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {comparisons.map((item) => (
            <motion.div
              key={item.id}
              className="comparison-card"
              variants={fadeInUp}
            >
              <div className="comparison-card-header">
                <Sparkles size={18} className="comparison-card-icon" />
                <h3 className="comparison-card-title">{item.title}</h3>
              </div>
              <ImageComparison
                before={item.before}
                after={item.after}
                title={item.title}
              />
              <p className="comparison-card-desc">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
