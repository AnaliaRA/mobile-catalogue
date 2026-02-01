import Link from 'next/link';
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <h2 className="not-found__subtitle">Page not found</h2>
      <p className="not-found__description">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href={ROUTES.home}>
        <Button variant="primary" size="lg">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
