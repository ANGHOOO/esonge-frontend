# Esonge Shopping Mall - Technical Stack Recommendations

This document outlines the recommended technology stack for the Esonge frontend project, with justifications for each choice based on project requirements and modern best practices.

## Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
├─────────────────────────────────────────────────────────────┤
│  UI Framework:        React 18                               │
│  Language:            TypeScript 5                           │
│  Build Tool:          Vite 5                                 │
│  Routing:             React Router 6                         │
│  State Management:    TanStack Query + Zustand + Context     │
│  Form Handling:       React Hook Form + Zod                  │
│  Styling:             CSS Modules + Tailwind CSS (optional)  │
│  UI Components:       shadcn/ui + Custom Components          │
│  Testing:             Vitest + React Testing Library         │
│  E2E Testing:         Playwright                             │
│  Code Quality:        ESLint + Prettier + TypeScript         │
│  Package Manager:     pnpm                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Technologies

### 1. React 18

**Choice**: React 18.x

**Justification**:
- Industry standard for building modern web applications
- Excellent ecosystem and community support
- Concurrent features for improved performance
- Server Components support (future SSR consideration)
- Strong TypeScript support
- Aligns with component-based architecture principles

**Key Features Used**:
- Hooks for state and side effects
- Suspense for data fetching and code splitting
- Concurrent rendering for better UX
- Automatic batching for performance

**Installation**:
```bash
pnpm add react@^18.3.0 react-dom@^18.3.0
```

---

### 2. TypeScript 5

**Choice**: TypeScript 5.x

**Justification**:
- Type safety reduces runtime errors
- Improved developer experience with IntelliSense
- Self-documenting code through types
- Easier refactoring and maintenance
- Catches errors at compile time
- Essential for large-scale applications

**Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/domains/*": ["./src/domains/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Installation**:
```bash
pnpm add -D typescript@^5.3.0 @types/react@^18.3.0 @types/react-dom@^18.3.0
```

---

### 3. Vite 5

**Choice**: Vite 5.x

**Justification**:
- Lightning-fast development server with HMR
- Optimized build performance
- Native ESM support
- Built-in TypeScript support
- Easy configuration
- Better than Create React App for modern projects
- Excellent plugin ecosystem

**Configuration** (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/domains': path.resolve(__dirname, './src/domains'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', 'zod'],
        },
      },
    },
  },
});
```

**Installation**:
```bash
pnpm add -D vite@^5.0.0 @vitejs/plugin-react@^4.2.0
```

---

## Routing

### 4. React Router 6

**Choice**: React Router 6.x

**Justification**:
- Industry standard for React routing
- Data-driven routing with loaders
- Nested routes support
- Type-safe route parameters
- Built-in code splitting support
- Excellent documentation

**Key Features**:
- Declarative routing
- Nested routes and outlets
- Route-based code splitting
- Navigation guards
- URL search params management

**Installation**:
```bash
pnpm add react-router-dom@^6.21.0
```

**Example Usage**:
```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

---

## State Management

### 5. TanStack Query (React Query)

**Choice**: TanStack Query v5

**Justification**:
- Best-in-class server state management
- Automatic caching and synchronization
- Built-in loading and error states
- Request deduplication
- Background refetching
- Optimistic updates
- Perfect for e-commerce data fetching

**Key Features**:
- Queries for data fetching
- Mutations for data updates
- Automatic cache invalidation
- Pagination and infinite scroll support
- DevTools for debugging

**Installation**:
```bash
pnpm add @tanstack/react-query@^5.17.0 @tanstack/react-query-devtools@^5.17.0
```

**Configuration**:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

### 6. Zustand

**Choice**: Zustand 4.x

**Justification**:
- Lightweight client state management (< 1KB)
- Simple API, minimal boilerplate
- No Context providers needed
- TypeScript support
- DevTools support
- Perfect for UI state (filters, modals, etc.)

**Use Cases**:
- Product filters and sorting
- UI state (sidebar open/closed, modal visibility)
- Shopping cart state (if not using server state)
- User preferences

**Installation**:
```bash
pnpm add zustand@^4.4.0
```

**Example Usage**:
```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FilterState {
  category: string | null;
  priceRange: { min: number; max: number };
  setCategory: (category: string | null) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
}

export const useFilterStore = create<FilterState>()(
  devtools((set) => ({
    category: null,
    priceRange: { min: 0, max: Infinity },
    setCategory: (category) => set({ category }),
    setPriceRange: (priceRange) => set({ priceRange }),
  }))
);
```

---

### 7. React Context

**Choice**: Built-in React Context API

**Justification**:
- No additional dependencies
- Perfect for auth state and theme
- Works well with custom hooks
- Follows CLAUDE.md scoping principles

**Use Cases**:
- Authentication context
- Theme context
- Locale/language context

**Example**:
```typescript
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Form Handling

### 8. React Hook Form

**Choice**: React Hook Form 7.x

**Justification**:
- Excellent performance (uncontrolled components)
- Minimal re-renders
- Built-in validation
- TypeScript support
- Small bundle size
- Easy integration with Zod

**Key Features**:
- Form state management
- Field validation
- Error handling
- Watch field values
- Field arrays support

**Installation**:
```bash
pnpm add react-hook-form@^7.49.0
```

---

### 9. Zod

**Choice**: Zod 3.x

**Justification**:
- TypeScript-first schema validation
- Runtime type checking
- Excellent error messages
- Perfect integration with React Hook Form
- Type inference for forms
- Aligns with CLAUDE.md form cohesion principles

**Installation**:
```bash
pnpm add zod@^3.22.0 @hookform/resolvers@^3.3.0
```

**Example Usage**:
```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const checkoutSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().regex(/^010-?\d{4}-?\d{4}$/, '올바른 전화번호를 입력해주세요'),
  address: z.string().min(1, '주소를 입력해주세요'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

function CheckoutForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  return (/* form JSX */);
}
```

---

## Styling

### 10. CSS Modules

**Choice**: CSS Modules (built-in with Vite)

**Justification**:
- Scoped styles (no naming conflicts)
- Co-located with components
- No runtime overhead
- TypeScript support with typed modules
- Simple and predictable

**Example**:
```typescript
// ProductCard.module.css
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

// ProductCard.tsx
import styles from './ProductCard.module.css';

export function ProductCard() {
  return <div className={styles.card}>...</div>;
}
```

---

### 11. Tailwind CSS (Optional)

**Choice**: Tailwind CSS 3.x (Optional)

**Justification**:
- Utility-first approach for rapid development
- Consistent design system
- Purges unused styles automatically
- Responsive design utilities
- Can coexist with CSS Modules

**When to Use**:
- Quick prototyping
- Consistent spacing and colors
- Responsive utilities
- Layout utilities

**Installation** (if chosen):
```bash
pnpm add -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
```

**Note**: Can use CSS Modules for component-specific styles and Tailwind for utilities.

---

## UI Components

### 12. shadcn/ui

**Choice**: shadcn/ui

**Justification**:
- Copy-paste components (full control)
- Built on Radix UI (accessibility)
- Customizable and extensible
- TypeScript support
- Tailwind CSS based
- No component library lock-in

**Key Components**:
- Button
- Input
- Select
- Dialog
- Dropdown Menu
- Accordion
- Tabs
- Toast

**Installation**:
```bash
pnpm dlx shadcn-ui@latest init
pnpm dlx shadcn-ui@latest add button input select dialog
```

**Alternative**: Build custom components from scratch using CLAUDE.md patterns.

---

## HTTP Client

### 13. Axios

**Choice**: Axios 1.x

**Justification**:
- Promise-based HTTP client
- Request/response interceptors
- Automatic JSON transformation
- Error handling
- Request cancellation
- TypeScript support

**Installation**:
```bash
pnpm add axios@^1.6.0
```

**Configuration**:
```typescript
// services/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Testing

### 14. Vitest

**Choice**: Vitest

**Justification**:
- Vite-native testing framework
- Fast test execution
- Compatible with Jest API
- Built-in TypeScript support
- Watch mode
- Coverage reporting

**Installation**:
```bash
pnpm add -D vitest@^1.1.0 @vitest/ui@^1.1.0
```

**Configuration** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/tests/'],
    },
  },
});
```

---

### 15. React Testing Library

**Choice**: React Testing Library

**Justification**:
- Test components like users interact with them
- Encourages accessibility
- No implementation details testing
- Works with Vitest
- Industry standard

**Installation**:
```bash
pnpm add -D @testing-library/react@^14.1.0 @testing-library/jest-dom@^6.1.0 @testing-library/user-event@^14.5.0
```

**Example Test**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

test('renders product name', () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText('자연산 송이버섯')).toBeInTheDocument();
});

test('calls addToCart on button click', () => {
  const mockAddToCart = vi.fn();
  render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

  fireEvent.click(screen.getByText('장바구니 담기'));
  expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
});
```

---

### 16. Playwright

**Choice**: Playwright

**Justification**:
- Reliable E2E testing
- Cross-browser support
- Auto-wait functionality
- Parallel test execution
- Visual regression testing
- Better than Cypress for modern apps

**Installation**:
```bash
pnpm add -D @playwright/test@^1.40.0
```

**Example E2E Test**:
```typescript
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  await page.goto('/products/1');
  await page.click('text=장바구니 담기');
  await page.click('text=장바구니 보기');
  await page.click('text=주문하기');

  await page.fill('input[name="name"]', '홍길동');
  await page.fill('input[name="phone"]', '010-1234-5678');
  await page.click('text=결제하기');

  await expect(page).toHaveURL(/\/order\/complete/);
});
```

---

## Code Quality

### 17. ESLint

**Choice**: ESLint 8.x

**Justification**:
- Catch errors and enforce code style
- TypeScript support
- React-specific rules
- Customizable rules
- IDE integration

**Installation**:
```bash
pnpm add -D eslint@^8.56.0 @typescript-eslint/parser@^6.18.0 @typescript-eslint/eslint-plugin@^6.18.0 eslint-plugin-react@^7.33.0 eslint-plugin-react-hooks@^4.6.0
```

**Configuration** (`.eslintrc.js`):
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

---

### 18. Prettier

**Choice**: Prettier

**Justification**:
- Consistent code formatting
- Reduces bikeshedding
- Auto-formatting on save
- Works with ESLint

**Installation**:
```bash
pnpm add -D prettier@^3.1.0 eslint-config-prettier@^9.1.0
```

**Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## Package Manager

### 19. pnpm

**Choice**: pnpm

**Justification**:
- Faster than npm/yarn
- Disk space efficient (hard links)
- Strict dependency resolution
- Better monorepo support
- Compatible with npm packages

**Installation**:
```bash
npm install -g pnpm@^8.0.0
```

**Usage**:
```bash
pnpm install
pnpm add <package>
pnpm add -D <package>
pnpm run dev
pnpm run build
```

---

## Additional Libraries

### 20. Date Handling - date-fns

**Choice**: date-fns 3.x

**Justification**:
- Modular (tree-shakeable)
- TypeScript support
- Lightweight alternative to Moment.js
- Immutable functions

**Installation**:
```bash
pnpm add date-fns@^3.0.0
```

**Usage**:
```typescript
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const formattedDate = format(parseISO('2024-01-01'), 'PPP', { locale: ko });
// "2024년 1월 1일"
```

---

### 21. Animations - Framer Motion

**Choice**: Framer Motion

**Justification**:
- Declarative animations
- Gesture support
- Smooth performance
- TypeScript support
- Layout animations

**Installation**:
```bash
pnpm add framer-motion@^10.16.0
```

**Usage**:
```typescript
import { motion } from 'framer-motion';

export function ProductCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* card content */}
    </motion.div>
  );
}
```

---

### 22. Icons - Lucide React

**Choice**: Lucide React

**Justification**:
- Beautiful, consistent icons
- Tree-shakeable
- TypeScript support
- Active maintenance
- Large icon library

**Installation**:
```bash
pnpm add lucide-react@^0.303.0
```

**Usage**:
```typescript
import { ShoppingCart, Heart, Search } from 'lucide-react';

export function Header() {
  return (
    <nav>
      <Search size={20} />
      <Heart size={20} />
      <ShoppingCart size={20} />
    </nav>
  );
}
```

---

### 23. Toast Notifications - Sonner

**Choice**: Sonner

**Justification**:
- Beautiful default design
- Easy to use
- Accessible
- Customizable
- Small bundle size

**Installation**:
```bash
pnpm add sonner@^1.3.0
```

**Usage**:
```typescript
import { toast, Toaster } from 'sonner';

// In App.tsx
<Toaster position="top-right" />

// In components
toast.success('장바구니에 추가되었습니다.');
toast.error('오류가 발생했습니다.');
```

---

### 24. Carousel - Swiper

**Choice**: Swiper

**Justification**:
- Modern, touch-friendly carousel
- Excellent mobile support
- Many built-in effects
- Lazy loading support
- Already used in current site

**Installation**:
```bash
pnpm add swiper@^11.0.0
```

**Usage**:
```typescript
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export function ProductCarousel({ products }) {
  return (
    <Swiper spaceBetween={16} slidesPerView={4}>
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

---

### 25. Image Optimization - react-image

**Choice**: react-image

**Justification**:
- Lazy loading
- Placeholder support
- Error handling
- Multiple image sources

**Installation**:
```bash
pnpm add react-image@^4.1.0
```

---

### 26. Currency Formatting - Internationalization API

**Choice**: Built-in Intl API (no library needed)

**Justification**:
- Native browser support
- No additional dependencies
- Locale support

**Usage**:
```typescript
// utils/format/currency.ts
export function formatCurrency(amount: number, currency: string = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Usage
formatCurrency(100000); // "₩100,000"
```

---

## Development Tools

### 27. Version Control - Git

**Standard**: Git + GitHub

**Branch Strategy**: Git Flow
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `hotfix/*`: Emergency fixes

---

### 28. Environment Variables

**Tool**: Vite env variables

**Configuration**:
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PAYMENT_API_KEY=test_key

# .env.production
VITE_API_BASE_URL=https://api.esonge.co.kr
VITE_PAYMENT_API_KEY=prod_key
```

**Usage**:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

### 29. Code Formatting on Commit

**Tools**: Husky + lint-staged

**Installation**:
```bash
pnpm add -D husky@^8.0.0 lint-staged@^15.2.0
```

**Configuration**:
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

---

## Build & Deployment

### 30. Build Configuration

**Production Build**:
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
  }
}
```

---

## Third-Party Integrations

### 31. Payment Gateways

**Cafe24 Payment**: Integration with existing backend
**Kakao Pay**: Direct SDK integration
**Naver Pay**: Direct SDK integration

---

### 32. Analytics

**Google Analytics 4**:
```bash
pnpm add react-ga4@^2.1.0
```

**Naver Analytics**: Script tag integration

---

### 33. Error Tracking

**Sentry**:
```bash
pnpm add @sentry/react@^7.92.0
```

**Configuration**:
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

---

## Summary

### Essential Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.21.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.303.0",
    "sonner": "^1.3.0",
    "swiper": "^11.0.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "vitest": "^1.1.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.18.0",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

### Tech Stack Rationale

This technology stack is chosen to:

1. **Maximize Developer Productivity**: Modern tools with excellent DX
2. **Ensure Type Safety**: TypeScript throughout
3. **Optimize Performance**: Vite, React Query, code splitting
4. **Maintain Code Quality**: ESLint, Prettier, Testing tools
5. **Align with CLAUDE.md**: Component composition, state scoping, cohesion
6. **Support Scalability**: Domain-based architecture, modular structure
7. **Facilitate Testing**: Comprehensive testing strategy
8. **Enable Accessibility**: WCAG-compliant component libraries

The stack balances modern best practices with proven, stable technologies suitable for an e-commerce application.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-04
