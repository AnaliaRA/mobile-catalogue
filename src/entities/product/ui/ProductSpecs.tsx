import type { ProductSpecs as ProductSpecsType } from '../model/types';
import styles from './ProductSpecs.module.scss';

export interface ProductSpecsProps {
  specs: ProductSpecsType;
  className?: string;
}

const SPEC_LABELS: Record<keyof ProductSpecsType, string> = {
  screen: 'Screen',
  resolution: 'Resolution',
  processor: 'Processor',
  mainCamera: 'Main Camera',
  selfieCamera: 'Selfie Camera',
  battery: 'Battery',
  os: 'Operating System',
  screenRefreshRate: 'Screen Refresh Rate',
};

export function ProductSpecs({ specs, className = '' }: ProductSpecsProps) {
  const specEntries = Object.entries(specs) as [keyof ProductSpecsType, string][];

  return (
    <section className={`${styles.container} ${className}`} aria-label="Technical specifications">
      <h3 className={styles.title}>SPECIFICATIONS</h3>
      <dl className={styles.list}>
        {specEntries.map(([key, value]) => (
          <div key={key} className={styles.item}>
            <dt className={styles.label}>{SPEC_LABELS[key]}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
