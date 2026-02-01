export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
} as const;

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Mobile Phone Catalog',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const ROUTES = {
  home: '/',
  product: (id: string) => `/product/${id}`,
  cart: '/cart',
} as const;

export const STORAGE_KEYS = {
  cart: 'mobile-phone-cart',
} as const;
