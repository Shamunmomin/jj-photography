import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageComparison({ before, after, title }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updateX = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, x)));
  }, []);

  const startDrag = useCallback((clientX) => {
    dragging.current = true;
    updateX(clientX);
  }, [updateX]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      updateX(cx);
    };
    const onEnd = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [updateX]);

  return (
    <div
      className="comparison-slider"
      ref={containerRef}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
    >
      <img
        src={before}
        alt={`${title} - Before`}
        className="comparison-img comparison-before-img"
        draggable={false}
      />
      <div
        className="comparison-clip"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={after}
          alt={`${title} - After`}
          className="comparison-img comparison-after-img"
          draggable={false}
        />
      </div>
      <div className="comparison-line" style={{ left: `${position}%` }} />
      <div className="comparison-handle" style={{ left: `${position}%` }}>
        <ChevronLeft size={16} />
        <div className="comparison-handle-dot" />
        <ChevronRight size={16} />
      </div>
      <span className="comparison-label comparison-label-left">Before</span>
      <span className="comparison-label comparison-label-right">After</span>
    </div>
  );
}
