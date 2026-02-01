'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/shared/config';
import { CartBadge } from '@/entities/cart';
import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.container}>
        <Link href={ROUTES.home} className={styles.logo} aria-label="Go to home">
          <Image src="/logo.png" alt="Mobile Phone Catalog" width={80} height={32} priority />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}
