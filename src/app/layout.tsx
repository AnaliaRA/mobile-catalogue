import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { CartProvider } from '@/entities/cart';
import { Header } from '@/widgets/header';
import { APP_CONFIG } from '@/shared/config';
import './globals.scss';

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: 'Mobile Phone Catalog - Find the perfect phone for you',
  metadataBase: new URL(APP_CONFIG.url),
  openGraph: {
    type: 'website',
    siteName: APP_CONFIG.name,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: APP_CONFIG.name,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <CartProvider>
          <Header />
          <main id="main-content">{children}</main>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
