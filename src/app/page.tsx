import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts, searchProducts } from '@/entities/product';
import { HomeView } from '@/views/home';
import { Loader } from '@/shared/ui';

export const metadata: Metadata = {
  title: 'Mobile Phone Catalog',
  description: 'Explore our collection of premium smartphones. Find the perfect phone for you.',
  openGraph: {
    title: 'Mobile Phone Catalog',
    description: 'Explore our collection of premium smartphones. Find the perfect phone for you.',
    type: 'website',
  },
};

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

async function ProductList({ query }: { query?: string }) {
  const products = query ? await searchProducts(query) : await getProducts();
  return <HomeView products={products} query={query} />;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q: query } = await searchParams;

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <ProductList query={query} />
    </Suspense>
  );
}
