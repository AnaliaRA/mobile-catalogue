# MBST Phone Catalog

A production-ready Mobile Phone Catalog web application built with Next.js, React, and TypeScript. Features server-side rendering, responsive design, and comprehensive testing.

## Features

- **Product Catalog**: Browse 20+ smartphones with images, prices, and specifications
- **Real-time Search**: Debounced search with URL synchronization
- **Product Details**: Dynamic images by color, storage/color selectors affecting price
- **Shopping Cart**: Persistent cart with add/remove functionality
- **Responsive Design**: Mobile-first approach, works on all devices
- **Accessibility**: WCAG compliant, screen reader friendly, keyboard navigation

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, SSR) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | SASS + CSS Modules |
| State Management | React Context API |
| Testing | Jest + React Testing Library + Playwright |
| Code Quality | ESLint + Prettier + Husky |

## Architecture

This project follows **Feature-Sliced Design (FSD)** principles:

```
src/
├── app/           # Next.js App Router (pages, layouts)
├── views/         # Page-level components
├── widgets/       # Complex UI blocks (Header, ProductGrid)
├── features/      # User interactions (AddToCart, Search)
├── entities/      # Business entities (Product, Cart)
└── shared/        # Reusable utilities, UI components, config
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mobile-catalogue

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=https://prueba-tecnica-api-tienda-moviles.onrender.com
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_NAME=MBST
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Available Scripts

### Development

```bash
npm run dev          # Start development server (hot reload, unminified)
npm run build        # Build for production (minified, optimized)
npm run start        # Start production server
```

### Testing

```bash
npm test             # Run unit/integration tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
npm run test:e2e:headed # Run E2E tests in headed mode
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```

### Analysis

```bash
npm run build:analyze # Analyze bundle sizes (opens browser)
```

## Project Structure

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js routes and layouts |
| `src/entities/cart/` | Cart context, storage, UI components |
| `src/entities/product/` | Product types, API, UI components |
| `src/features/` | User features (search, add-to-cart, select-options) |
| `src/shared/ui/` | Reusable UI components (Button, Input, Card) |
| `src/shared/styles/` | SASS variables, mixins, breakpoints |
| `e2e/` | Playwright E2E tests |

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `ProductCard.tsx` |
| Folders | kebab-case | `add-to-cart/` |
| Hooks/Helpers | camelCase | `useDebounce.ts` |
| Styles | CSS Modules | `Component.module.scss` |

## Testing

### Test Coverage

- **Unit Tests**: Hooks, utilities, formatters
- **Integration Tests**: Component interactions, context providers
- **E2E Tests**: Full user journeys across browsers

### Running Tests

```bash
# All unit/integration tests
npm test

# E2E tests (requires dev server or build)
npm run build && npm run test:e2e
```

### E2E Test Browsers

- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

## Performance

### Lighthouse Scores

| Category | Score |
|----------|-------|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

### Optimizations

- Server-Side Rendering (SSR) for fast initial load
- Image optimization with `next/image`
- Priority loading for above-the-fold images
- Code splitting per route
- Debounced search to reduce API calls
- Retry logic for transient server errors

## Accessibility

- Skip link for keyboard navigation
- ARIA labels on interactive elements
- Semantic HTML structure
- Sufficient color contrast
- Focus management
- Screen reader compatible

## API

The application consumes a REST API for product data.

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /products` | List all products |
| `GET /products?search={query}` | Search products |
| `GET /products/{id}` | Get product details |

### Authentication

All requests require the `x-api-key` header.

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel via CLI or GitHub integration
```

### Environment Variables for Production

Set these in your deployment platform:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_KEY`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`

## Development Modes

| Mode | Command | Assets |
|------|---------|--------|
| Development | `npm run dev` | Unminified, source maps, HMR |
| Production | `npm run build && npm start` | Minified, optimized, tree-shaken |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Contributing

1. Ensure all tests pass: `npm test && npm run test:e2e`
2. Ensure no lint errors: `npm run lint`
3. Follow the existing code style and architecture

## License

Private project - All rights reserved.
