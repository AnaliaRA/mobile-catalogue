/**
 * Mock data for E2E tests
 * These fixtures provide deterministic data for reliable testing
 */

export const mockProducts = [
  {
    id: 'SMG-S24U-256',
    brand: 'Samsung',
    name: 'Galaxy S24 Ultra',
    basePrice: 1459,
    imageUrl: 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=S24+Ultra',
  },
  {
    id: 'APL-IP15P-128',
    brand: 'Apple',
    name: 'iPhone 15 Pro',
    basePrice: 1199,
    imageUrl: 'https://via.placeholder.com/400x400/2a2a2a/ffffff?text=iPhone+15',
  },
  {
    id: 'XMI-14U-256',
    brand: 'Xiaomi',
    name: 'Xiaomi 14 Ultra',
    basePrice: 1099,
    imageUrl: 'https://via.placeholder.com/400x400/3a3a3a/ffffff?text=Xiaomi+14',
  },
  {
    id: 'GOO-PX8P-128',
    brand: 'Google',
    name: 'Pixel 8 Pro',
    basePrice: 999,
    imageUrl: 'https://via.placeholder.com/400x400/4a4a4a/ffffff?text=Pixel+8',
  },
  {
    id: 'ONE-12-256',
    brand: 'OnePlus',
    name: 'OnePlus 12',
    basePrice: 899,
    imageUrl: 'https://via.placeholder.com/400x400/5a5a5a/ffffff?text=OnePlus+12',
  },
];

export const mockProductDetail = {
  id: 'SMG-S24U-256',
  brand: 'Samsung',
  name: 'Galaxy S24 Ultra',
  description: 'The ultimate smartphone experience with AI-powered features.',
  basePrice: 1459,
  rating: 4.8,
  specs: {
    screen: '6.8" Dynamic AMOLED 2X',
    resolution: '3120 x 1440 (QHD+)',
    processor: 'Snapdragon 8 Gen 3',
    mainCamera: '200MP + 12MP + 50MP + 10MP',
    selfieCamera: '12MP',
    battery: '5000mAh',
    os: 'Android 14, One UI 6.1',
    screenRefreshRate: '120Hz',
  },
  colorOptions: [
    {
      name: 'Titanium Black',
      hexCode: '#1a1a1a',
      imageUrl: 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Black',
    },
    {
      name: 'Titanium Gray',
      hexCode: '#6b6b6b',
      imageUrl: 'https://via.placeholder.com/400x400/6b6b6b/ffffff?text=Gray',
    },
    {
      name: 'Titanium Violet',
      hexCode: '#8b5cf6',
      imageUrl: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Violet',
    },
  ],
  storageOptions: [
    { capacity: '256GB', price: 1459 },
    { capacity: '512GB', price: 1579 },
    { capacity: '1TB', price: 1799 },
  ],
  similarProducts: [
    {
      id: 'APL-IP15P-128',
      brand: 'Apple',
      name: 'iPhone 15 Pro',
      basePrice: 1199,
      imageUrl: 'https://via.placeholder.com/400x400/2a2a2a/ffffff?text=iPhone+15',
    },
    {
      id: 'GOO-PX8P-128',
      brand: 'Google',
      name: 'Pixel 8 Pro',
      basePrice: 999,
      imageUrl: 'https://via.placeholder.com/400x400/4a4a4a/ffffff?text=Pixel+8',
    },
  ],
};

// Second product for testing multiple items in cart
export const mockProductDetail2 = {
  id: 'APL-IP15P-128',
  brand: 'Apple',
  name: 'iPhone 15 Pro',
  description: 'Pro. Beyond.',
  basePrice: 1199,
  rating: 4.9,
  specs: {
    screen: '6.1" Super Retina XDR',
    resolution: '2556 x 1179',
    processor: 'A17 Pro',
    mainCamera: '48MP + 12MP + 12MP',
    selfieCamera: '12MP',
    battery: '3274mAh',
    os: 'iOS 17',
    screenRefreshRate: '120Hz ProMotion',
  },
  colorOptions: [
    {
      name: 'Natural Titanium',
      hexCode: '#a8a8a0',
      imageUrl: 'https://via.placeholder.com/400x400/a8a8a0/000000?text=Natural',
    },
    {
      name: 'Blue Titanium',
      hexCode: '#394c5f',
      imageUrl: 'https://via.placeholder.com/400x400/394c5f/ffffff?text=Blue',
    },
  ],
  storageOptions: [
    { capacity: '128GB', price: 1199 },
    { capacity: '256GB', price: 1299 },
    { capacity: '512GB', price: 1499 },
  ],
  similarProducts: [
    {
      id: 'SMG-S24U-256',
      brand: 'Samsung',
      name: 'Galaxy S24 Ultra',
      basePrice: 1459,
      imageUrl: 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=S24+Ultra',
    },
  ],
};

// Empty search results
export const mockEmptySearchResults: typeof mockProducts = [];
