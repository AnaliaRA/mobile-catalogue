'use client';

import type { StorageOption } from '@/entities/product';
import styles from './StorageSelector.module.scss';

export interface StorageSelectorProps {
  storages: StorageOption[];
  selectedStorage: StorageOption | null;
  onSelect: (storage: StorageOption) => void;
  className?: string;
}

export function StorageSelector({
  storages,
  selectedStorage,
  onSelect,
  className = '',
}: StorageSelectorProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <span className={styles.label}>STORAGE. HOW MUCH SPACE DO YOU NEED?</span>
      <div className={styles.options} role="radiogroup" aria-label="Select storage">
        {storages.map((storage) => {
          const isSelected = selectedStorage?.capacity === storage.capacity;
          return (
            <button
              key={storage.capacity}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(storage)}
            >
              <span className={styles.capacity}>{storage.capacity}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
