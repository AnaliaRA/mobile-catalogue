# Optimizations Applied

Summary of all performance, code quality, and bundle size optimizations applied to the mobile-catalogue project.

## 1. React Performance: Component Memoization

**Files changed:**
- `src/entities/product/ui/ProductCard.tsx`
- `src/entities/product/ui/ProductPrice.tsx`
- `src/entities/product/ui/ProductSpecs.tsx`
- `src/entities/cart/ui/CartItem.tsx`

**What:** Wrapped leaf components with `React.memo()` to prevent unnecessary re-renders.

**Why:** These components are rendered in lists (ProductGrid, SimilarProducts, CartList) and receive stable props. Without `memo`, every parent re-render triggers a re-render of all list items even when their props haven't changed.

**Impact:** Reduces render cycles proportional to list size. For a product grid with 20+ items, this prevents ~20 unnecessary component tree reconciliations on each parent state update.

---

## 2. CSS text-transform Instead of JS .toUpperCase()

**Files changed:**
- `src/entities/product/ui/ProductCard.tsx` (removed `.toUpperCase()` calls)
- `src/entities/product/ui/ProductCard.module.scss` (added `text-transform: uppercase`)
- `src/entities/cart/ui/CartItem.tsx` (removed `.toUpperCase()` calls)
- `src/entities/cart/ui/CartItem.module.scss` (added `text-transform: uppercase` to `.specs`)

**What:** Replaced JavaScript string `.toUpperCase()` calls with CSS `text-transform: uppercase`.

**Why:**
- Eliminates string allocation on every render
- CSS transforms are handled by the browser's layout engine, not the JS thread
- Works correctly with `React.memo` since the original string values are compared (no new strings created per render)

---

## 3. API Response Caching with Stale-While-Revalidate

**Files changed:**
- `src/shared/api/base.ts` (added `next` option passthrough to `fetch`)
- `src/entities/product/api/productApi.ts` (added `revalidate: 60` to product fetches)

**What:** Added Next.js ISR-style caching (`next: { revalidate: 60 }`) to `getProducts()` and `getProductById()` API calls.

**Why:**
- Product data doesn't change frequently; caching for 60 seconds prevents redundant API calls
- `getProductById` is called twice on product detail pages (once in `generateMetadata`, once in the page component) - while Next.js deduplicates during the same render, the revalidation cache serves subsequent visitors instantly
- Search queries are intentionally not cached since results depend on user input

**Impact:** Reduces API round-trips to the external backend, improving Time to First Byte (TTFB) for cached responses. The stale-while-revalidate pattern ensures fresh data without blocking the response.

---

## 4. Cart Page: Remove Unnecessary force-dynamic

**Files changed:**
- `src/app/cart/page.tsx`

**What:** Removed `export const dynamic = 'force-dynamic'`.

**Why:** The cart page only renders a client component (`CartView`) that reads from localStorage. There is no server-side data fetching, so `force-dynamic` was unnecessary and prevented Next.js from statically pre-rendering the page shell.

**Impact:**
- Before: `ƒ (Dynamic)` - server-rendered on every request
- After: `○ (Static)` - pre-rendered at build time, served from CDN

This means the cart page HTML shell is served instantly from the CDN edge, and the client-side cart state hydrates on the client.

---

## 5. Remove Unnecessary useMemo

**Files changed:**
- `src/features/select-product-options/model/useProductOptions.ts`

**What:** Removed `useMemo` wrapper from the `isComplete` computation and computed it inline in the return statement.

**Why:** `useMemo` has overhead (storing the previous value, comparing dependencies). For a trivial boolean expression (`!!selectedColor && !!selectedStorage`), the memoization overhead exceeds the computation cost. React documentation recommends only using `useMemo` for expensive computations.

---

## 6. Next.js Image Optimization: AVIF Format

**Files changed:**
- `next.config.ts`

**What:** Added `formats: ['image/avif', 'image/webp']` to the images configuration.

**Why:** AVIF provides ~50% better compression than WebP and ~70% better than JPEG at equivalent quality. Next.js will now serve AVIF to browsers that support it (Chrome, Firefox, Safari 16+), falling back to WebP, then to the original format.

**Impact:** Significant reduction in image transfer size for product images, which are the heaviest assets on this catalog site.

---

## 7. Bundle Optimization: optimizePackageImports

**Files changed:**
- `next.config.ts`

**What:** Added `experimental.optimizePackageImports` for the project's barrel-export modules: `@/shared/ui`, `@/entities/product`, `@/entities/cart`.

**Why:** Barrel files (`index.ts`) that re-export from multiple sub-modules can cause the bundler to include all exports even when only one is used. `optimizePackageImports` enables Next.js to transform barrel imports into direct imports at build time, ensuring proper tree-shaking.

**Example transformation:**
```typescript
// Before (what you write):
import { Button } from '@/shared/ui';

// After (what the bundler sees):
import { Button } from '@/shared/ui/button';
```

---

## Verification

All changes verified with:
- **Build**: `npm run build` - compiles successfully with zero errors
- **Tests**: `npm test` - all 71 unit tests pass (12 test suites)
- **Lint**: `npm run lint` - zero lint errors
- **Type check**: Strict TypeScript compilation passes

## No Breaking Changes

All optimizations are backward-compatible:
- Component APIs remain unchanged
- No dependency additions or removals
- All existing tests pass without modification
