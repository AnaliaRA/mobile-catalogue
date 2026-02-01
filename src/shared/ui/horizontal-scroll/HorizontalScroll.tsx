'use client';

import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import styles from './HorizontalScroll.module.scss';

export interface HorizontalScrollProps {
  children: ReactNode;
  /** Show the scroll progress indicator */
  showIndicator?: boolean;
  /** Width of each item (for consistent sizing) */
  itemWidth?: number | { mobile: number; tablet: number; desktop: number };
  /** Gap between items in pixels */
  gap?: number;
  /** Additional class name */
  className?: string;
}

export function HorizontalScroll({
  children,
  showIndicator = true,
  itemWidth,
  gap = 0,
  className = '',
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(30);
  const [canScroll, setCanScroll] = useState(false);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll > 0) {
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    }
  }, []);

  const calculateDimensions = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollWidth, clientWidth } = container;
    const hasScroll = scrollWidth > clientWidth;
    setCanScroll(hasScroll);

    if (hasScroll) {
      const width = Math.max(20, (clientWidth / scrollWidth) * 100);
      setThumbWidth(width);
    } else {
      setThumbWidth(100);
    }
  }, []);

  useEffect(() => {
    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, [calculateDimensions, children]);

  // Calculate thumb position
  const thumbPosition = (scrollProgress / 100) * (100 - thumbWidth);

  // Build item style if itemWidth is provided
  const getItemStyle = () => {
    if (!itemWidth) return undefined;

    if (typeof itemWidth === 'number') {
      return { '--item-width': `${itemWidth}px` } as React.CSSProperties;
    }

    return {
      '--item-width-mobile': `${itemWidth.mobile}px`,
      '--item-width-tablet': `${itemWidth.tablet}px`,
      '--item-width-desktop': `${itemWidth.desktop}px`,
    } as React.CSSProperties;
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.scrollWrapper}>
        <div
          ref={scrollRef}
          className={styles.scrollContainer}
          onScroll={handleScroll}
          style={{ gap: gap > 0 ? `${gap}px` : undefined, ...getItemStyle() }}
        >
          {children}
        </div>
      </div>

      {showIndicator && canScroll && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.scrollTrack}>
            <div
              className={styles.scrollThumb}
              style={{
                width: `${thumbWidth}%`,
                left: `${thumbPosition}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
