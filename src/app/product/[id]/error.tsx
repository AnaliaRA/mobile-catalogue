'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Product page error:', error);
  }, [error]);

  return (
    <div className="error-page">
      <h1 className="error-page__title">!</h1>
      <h2 className="error-page__subtitle">Product unavailable</h2>
      <p className="error-page__description">
        We couldn&apos;t load this product. It may be temporarily unavailable or there was a
        connection issue.
      </p>
      <div className="error-page__actions">
        <Button variant="primary" size="lg" onClick={reset}>
          Try again
        </Button>
        <Link href={ROUTES.home}>
          <Button variant="secondary" size="lg">
            Browse products
          </Button>
        </Link>
      </div>
    </div>
  );
}
