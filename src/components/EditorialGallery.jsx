import { useState, useEffect, useRef } from 'react';
import LazyImage from './LazyImage';
import './EditorialGallery.css';

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
    } else if (available > 0) {
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

function ImageCard({ image, onClick, className = '', style }) {
  const [ref, inView] = useInView(0.05);

  return (
    <div
      ref={ref}
      className={`editorial-image-card ${className} ${inView ? 'visible' : ''}`}
      style={style}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(e); }}
    >
      <LazyImage src={image.src} alt={image.title} />
      <div className="editorial-image-glow" />
    </div>
  );
}

function EditorialHero({ image, onClick }) {
  const [ref, inView] = useInView(0.05);

  return (
    <div
      ref={ref}
      className={`editorial-hero animate-on-scroll ${inView ? 'visible' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      <LazyImage src={image.src} alt={image.title} />
      <div className="editorial-hero-overlay">
        <span className="editorial-hero-location">{image.location}</span>
        <h2 className="editorial-hero-title">{image.title}</h2>
        <p className="editorial-hero-desc">{image.description}</p>
      </div>
    </div>
  );
}

function EditorialGrid4({ images, onImageClick, startIndex }) {
  return (
    <div className="editorial-grid-4">
      {images.map((img, i) => (
        <ImageCard
          key={img.id}
          image={img}
          className="editorial-grid-item"
          style={{ '--item-index': i }}
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
      <ImageCard
        image={large}
        className="editorial-split-large"
        onClick={() => onImageClick(large, startIndex)}
      />
      <div className="editorial-split-stack">
        {stacked.map((img, i) => (
          <ImageCard
            key={img.id}
            image={img}
            className="editorial-split-stack-item"
            style={{ '--item-index': i }}
            onClick={() => onImageClick(img, startIndex + 1 + i)}
          />
        ))}
      </div>
    </div>
  );
}

function EditorialSplitRight({ images, onImageClick, startIndex }) {
  const [img1, img2, large] = images;

  return (
    <div className="editorial-split">
      <div className="editorial-split-stack">
        <ImageCard
          image={img1}
          className="editorial-split-stack-item"
          style={{ '--item-index': 0 }}
          onClick={() => onImageClick(img1, startIndex)}
        />
        <ImageCard
          image={img2}
          className="editorial-split-stack-item"
          style={{ '--item-index': 1 }}
          onClick={() => onImageClick(img2, startIndex + 1)}
        />
      </div>
      <ImageCard
        image={large}
        className="editorial-split-large"
        onClick={() => onImageClick(large, startIndex + 2)}
      />
    </div>
  );
}

function EditorialRemaining({ images, onImageClick, startIndex }) {
  return (
    <div className="editorial-grid-4">
      {images.map((img, i) => (
        <ImageCard
          key={img.id}
          image={img}
          className="editorial-grid-item"
          style={{ '--item-index': i }}
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

export default function EditorialGallery({ images, onImageClick, className = '' }) {
  if (!images || images.length === 0) {
    return null;
  }

  const sections = buildSections(images);
  let runningIdx = 0;

  return (
    <div className={`editorial-gallery ${className}`}>
      {sections.map((section, idx) => {
        const startIdx = runningIdx;
        runningIdx += section.images.length;
        return (
          <div key={idx} className="editorial-section">
            <EditorialSection
              section={section}
              onImageClick={onImageClick}
              startIndex={startIdx}
            />
          </div>
        );
      })}
    </div>
  );
}
