import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductById } from '@/entities/product';
import { ProductDetailView } from '@/views/product-detail';
import { APP_CONFIG, ROUTES } from '@/shared/config';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProductById(id);
    const title = `${product.brand} ${product.name}`;
    const lowestPrice = Math.min(...product.storageOptions.map((s) => s.price));

    return {
      title,
      description: product.description,
      openGraph: {
        title,
        description: product.description,
        type: 'website',
        url: `${APP_CONFIG.url}${ROUTES.product(id)}`,
        images: [
          {
            url: product.colorOptions[0]?.imageUrl || '/og-image.png',
            width: 800,
            height: 800,
            alt: title,
          },
        ],
        locale: 'en_US',
        siteName: APP_CONFIG.name,
      },
      other: {
        'product:price:amount': lowestPrice.toString(),
        'product:price:currency': 'EUR',
      },
    };
  } catch {
    return {
      title: 'Product not found',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
