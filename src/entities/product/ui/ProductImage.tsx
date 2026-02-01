'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductImage.module.scss';

export interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function ProductImage({ src, alt, priority = false }: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.imageWrapper} relative`}>
        <div className={`${styles.spinner} ${isLoaded ? styles.spinnerHidden : ''}`} />
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading="eager"
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.image}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
}
