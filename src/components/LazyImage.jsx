import { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, className, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const wrapperRef = useRef(null);
  const prevSrc = useRef(src);

  useEffect(() => {
    if (prevSrc.current !== src) {
      setLoaded(false);
      prevSrc.current = src;
    }
  }, [src]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={`lazy-image-wrapper ${className || ''}`}>
      {(!inView || !loaded) && <div className="lazy-placeholder" />}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-img ${loaded ? 'lazy-loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
}
