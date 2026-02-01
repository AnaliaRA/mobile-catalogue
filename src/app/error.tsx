'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="error-page">
      <h1 className="error-page__title">!</h1>
      <h2 className="error-page__subtitle">Something went wrong</h2>
      <p className="error-page__description">
        We encountered an unexpected error. Please try again or return to the home page.
      </p>
      <div className="error-page__actions">
        <Button variant="primary" size="lg" onClick={reset}>
          Try again
        </Button>
        <Link href={ROUTES.home}>
          <Button variant="secondary" size="lg">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
