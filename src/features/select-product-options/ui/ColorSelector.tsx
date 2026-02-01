'use client';

import { useState } from 'react';
import type { ColorOption } from '@/entities/product';
import styles from './ColorSelector.module.scss';

export interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: ColorOption | null;
  onSelect: (color: ColorOption) => void;
  className?: string;
}

export function ColorSelector({
  colors,
  selectedColor,
  onSelect,
  className = '',
}: ColorSelectorProps) {
  const [hoveredColor, setHoveredColor] = useState<ColorOption | null>(null);
  const displayedColorName = hoveredColor?.name || selectedColor?.name;

  return (
    <div className={`${styles.container} ${className}`}>
      <span className={styles.label}>COLOR. PICK YOUR FAVORITE.</span>
      <div className={styles.options} role="radiogroup" aria-label="Select color">
        {colors.map((color) => {
          const isSelected = selectedColor?.hexCode === color.hexCode;
          return (
            <button
              key={color.hexCode}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color.name}
              className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(color)}
              onMouseEnter={() => setHoveredColor(color)}
              onMouseLeave={() => setHoveredColor(null)}
            >
              <span className={styles.colorSwatch} style={{ backgroundColor: color.hexCode }} />
              <span className={styles.colorName}>{color.name}</span>
            </button>
          );
        })}
      </div>
      <span className={styles.selectedName}>{displayedColorName || '\u00A0'}</span>
    </div>
  );
}
