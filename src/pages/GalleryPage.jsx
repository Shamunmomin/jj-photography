import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Plus, Minus, Maximize2, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';

const categoryInfo = {
  weddings: { title: 'Weddings', subtitle: 'Eternal Love Stories', desc: 'Every wedding is a unique love story. Each frame captures the emotions, the tears, the laughter, and the unforgettable moments.' },
  portraits: { title: 'Portraits', subtitle: 'The Art of Expression', desc: 'Portraits that reveal the soul. Every face tells a story, and I am here to capture yours in its most authentic light.' },
  fashion: { title: 'Fashion', subtitle: 'Style Meets Art', desc: 'Where high fashion meets artistic vision. Bold, creative, and effortlessly stunning editorials.' },
  travel: { title: 'Travel', subtitle: 'Wanderlust Frames', desc: 'From the highest peaks to the deepest valleys. Capturing the world\'s beauty one frame at a time.' },
};

const SECTION_PATTERN = ['hero', 'grid4', 'splitLeft', 'grid4', 'splitRight'];

const SECTION_COUNTS = { hero: 1, grid4: 4, splitLeft: 3, splitRight: 3 };

function buildSections(images) {
  const sections = [];
  let i = 0;
  let patternIdx = 0;

  while (i < images.length) {
    const type = SECTION_PATTERN[patternIdx % SECTION_PATTERN.length];
    const needed = SECTION_COUNTS[type];
    const available = images.length - i;

    if (available >= needed) {
      sections.push({ type, images: images.slice(i, i + needed) });
      i += needed;
    } else {
      sections.push({ type: 'remaining', images: images.slice(i) });
      break;
    }
    patternIdx++;
  }

  return sections;
}

function useInView(threshold = 0.05) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function EditorialHero({ image, onClick }) {
  const [ref, inView] = useInView(0.05);

  return (
    <div
      ref={ref}
      className={`editorial-hero ${inView ? 'visible' : ''}`}
      onClick={onClick}
    >
      <img src={image.src} alt={image.title} loading="eager" />
      <div className="editorial-hero-overlay">
        <h2>{image.title}</h2>
        <p>{image.description}</p>
        <span className="editorial-hero-location">{image.location}</span>
      </div>
    </div>
  );
}

function EditorialGridItem({ image, onClick }) {
  const [ref, inView] = useInView(0.05);

  return (
    <div
      ref={ref}
      className={`editorial-grid-item ${inView ? 'visible' : ''}`}
      onClick={onClick}
    >
      <img src={image.src} alt={image.title} loading="lazy" />
    </div>
  );
}

function EditorialGrid4({ images, onImageClick, startIndex }) {
  return (
    <div className="editorial-grid-4">
      {images.map((img, i) => (
        <EditorialGridItem
          key={img.id}
          image={img}
          onClick={() => onImageClick(img, startIndex + i)}
        />
      ))}
    </div>
  );
}

function EditorialSplitLeft({ images, onImageClick, startIndex }) {
  const [large, ...stacked] = images;

  return (
    <div className="editorial-split">
      <div className="editorial-split-large" onClick={() => onImageClick(large, startIndex)}>
        <img src={large.src} alt={large.title} loading="lazy" />
      </div>
      <div className="editorial-split-stack">
        {stacked.map((img, i) => (
          <div
            key={img.id}
            className="editorial-split-stack-item"
            onClick={() => onImageClick(img, startIndex + 1 + i)}
          >
            <img src={img.src} alt={img.title} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialSplitRight({ images, onImageClick, startIndex }) {
  const stacked = images.slice(0, 2);
  const large = images[2];

  return (
    <div className="editorial-split">
      <div className="editorial-split-stack">
        {stacked.map((img, i) => (
          <div
            key={img.id}
            className="editorial-split-stack-item"
            onClick={() => onImageClick(img, startIndex + i)}
          >
            <img src={img.src} alt={img.title} loading="lazy" />
          </div>
        ))}
      </div>
      <div className="editorial-split-large" onClick={() => onImageClick(large, startIndex + 2)}>
        <img src={large.src} alt={large.title} loading="lazy" />
      </div>
    </div>
  );
}

function EditorialRemaining({ images, onImageClick, startIndex }) {
  return (
    <div className="editorial-grid-4">
      {images.map((img, i) => (
        <EditorialGridItem
          key={img.id}
          image={img}
          onClick={() => onImageClick(img, startIndex + i)}
        />
      ))}
    </div>
  );
}

function EditorialSection({ section, onImageClick, startIndex }) {
  const { type, images } = section;

  switch (type) {
    case 'hero':
      return <EditorialHero image={images[0]} onClick={() => onImageClick(images[0], startIndex)} />;
    case 'grid4':
      return <EditorialGrid4 images={images} onImageClick={onImageClick} startIndex={startIndex} />;
    case 'splitLeft':
      return <EditorialSplitLeft images={images} onImageClick={onImageClick} startIndex={startIndex} />;
    case 'splitRight':
      return <EditorialSplitRight images={images} onImageClick={onImageClick} startIndex={startIndex} />;
    case 'remaining':
      return <EditorialRemaining images={images} onImageClick={onImageClick} startIndex={startIndex} />;
    default:
      return null;
  }
}

export default function GalleryPage({ category, onBack, theme, toggleTheme }) {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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

  const openImage = (img, index) => {
    setSelected(img);
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelected(null);
    setSelectedIndex(-1);
  };

  const goNext = useCallback(() => {
    if (selectedIndex < images.length - 1) {
      const next = selectedIndex + 1;
      setSelected(images[next]);
      setSelectedIndex(next);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedIndex, images]);

  const goPrev = useCallback(() => {
    if (selectedIndex > 0) {
      const prev = selectedIndex - 1;
      setSelected(images[prev]);
      setSelectedIndex(prev);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedIndex, images]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!selected) return;
      if (e.key === 'Escape') closeImage();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, goNext, goPrev]);

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

  const featured = images[0];
  const rest = images.slice(1);
  const sections = buildSections(rest);

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
          <span className="gallery-subtitle">{info.subtitle}</span>
          <h1 className="gallery-title">{info.title}</h1>
          <p className="gallery-desc">{info.desc}</p>
        </motion.div>
      </header>

      <div className="editorial-wrapper">
        {featured && (
          <EditorialHero
            image={featured}
            onClick={() => openImage(featured, 0)}
          />
        )}

        {(() => {
          let runningIdx = 1;
          return sections.map((section, idx) => {
            const startIdx = runningIdx;
            runningIdx += section.images.length;
            return (
              <div key={idx} className="editorial-section">
                <EditorialSection
                  section={section}
                  onImageClick={openImage}
                  startIndex={startIdx}
                />
              </div>
            );
          });
        })()}

        <div className="album-end-note">
          <div className="album-end-line" />
          <p>End of {info.title} Album</p>
          <div className="album-end-line" />
        </div>
      </div>

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
                <span className="zoom-counter">{selectedIndex + 1} / {images.length}</span>
                <span className="zoom-img-title">{selected.title}</span>
                <button className="zoom-close-btn" onClick={closeImage}><X size={24} /></button>
              </div>
            </div>

            <div className="zoom-image-area" onClick={(e) => { if (e.target === e.currentTarget) closeImage(); }}>
              {selectedIndex > 0 && (
                <button className="zoom-nav-btn zoom-nav-prev" onClick={goPrev}>
                  <ChevronLeft size={28} />
                </button>
              )}
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
              {selectedIndex < images.length - 1 && (
                <button className="zoom-nav-btn zoom-nav-next" onClick={goNext}>
                  <ChevronRight size={28} />
                </button>
              )}
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
