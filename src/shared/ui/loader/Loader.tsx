import styles from './Loader.module.scss';

export type LoaderSize = 'sm' | 'md' | 'lg';

export interface LoaderProps {
  size?: LoaderSize;
  className?: string;
  label?: string;
  fullScreen?: boolean;
}

export function Loader({
  size = 'md',
  className = '',
  label = 'Loading...',
  fullScreen = false,
}: LoaderProps) {
  const loaderClasses = [styles.loader, styles[size], fullScreen && styles.fullScreen, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={loaderClasses} role="status" aria-live="polite" data-testid="loader">
      <svg className={styles.spinner} viewBox="0 0 50 50" aria-hidden="true">
        <circle className={styles.circle} cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      </svg>
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
