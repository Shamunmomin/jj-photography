import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Plus, Minus, Maximize2, Sun, Moon } from 'lucide-react';

const categoryInfo = {
  weddings: { title: 'Weddings', subtitle: 'Eternal Love Stories', desc: 'Every wedding is a unique love story. Each frame captures the emotions, the tears, the laughter, and the unforgettable moments.' },
  portraits: { title: 'Portraits', subtitle: 'The Art of Expression', desc: 'Portraits that reveal the soul. Every face tells a story, and I am here to capture yours in its most authentic light.' },
  fashion: { title: 'Fashion', subtitle: 'Style Meets Art', desc: 'Where high fashion meets artistic vision. Bold, creative, and effortlessly stunning editorials.' },
  travel: { title: 'Travel', subtitle: 'Wanderlust Frames', desc: 'From the highest peaks to the deepest valleys. Capturing the world\'s beauty one frame at a time.' },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function GalleryPage({ category, onBack, theme, toggleTheme }) {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const info = categoryInfo[category];

  useEffect(() => {
    import(`../data/${category}.js`).then(mod => {
      setImages(mod[category]);
    });
  }, [category]);

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [selected]);

  const handleWheel = useCallback((e) => {
    if (!selected) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale(s => Math.max(1, Math.min(5, s + delta)));
  }, [selected]);

  const handleMouseDown = useCallback((e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [scale, position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const zoomIn = () => setScale(s => Math.min(5, s + 0.5));
  const zoomOut = () => setScale(s => Math.max(1, s - 0.5));
  const resetZoom = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  return (
    <motion.div
      className="gallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="gallery-header">
        <div className="gallery-header-top">
          <motion.button
            className="gallery-back-btn"
            onClick={onBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={22} />
            <span>Back</span>
          </motion.button>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <motion.div
          className="gallery-header-content"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="gallery-subtitle">{info.subtitle}</span>
          <h1 className="gallery-title">{info.title}</h1>
          <p className="gallery-desc">{info.desc}</p>
        </motion.div>
      </header>

      <motion.div
        className="album-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="album-item"
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            onClick={() => setSelected(img)}
          >
            <div className="album-item-img">
              <img src={img.src} alt={img.title} loading="lazy" />
              <div className="album-item-overlay">
                <h3>{img.title}</h3>
                <span>{img.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="zoom-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="zoom-toolbar">
              <div className="zoom-toolbar-left">
                <button className="zoom-btn" onClick={zoomIn}><Plus size={20} /></button>
                <span className="zoom-level">{Math.round(scale * 100)}%</span>
                <button className="zoom-btn" onClick={zoomOut}><Minus size={20} /></button>
                <button className="zoom-btn" onClick={resetZoom}><Maximize2 size={18} /></button>
              </div>
              <div className="zoom-toolbar-right">
                <span className="zoom-img-title">{selected.title}</span>
                <button className="zoom-close-btn" onClick={() => setSelected(null)}><X size={24} /></button>
              </div>
            </div>

            <div className="zoom-image-area" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
              <motion.img
                ref={imgRef}
                src={selected.src}
                alt={selected.title}
                className="zoom-image"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                }}
                onMouseDown={handleMouseDown}
                draggable={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>

            <div className="zoom-image-info">
              <p>{selected.description}</p>
              <span className="zoom-image-location">{selected.location}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
