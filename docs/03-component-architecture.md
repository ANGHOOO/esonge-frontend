# Esonge Shopping Mall - Component Architecture

This document defines the component architecture, state management strategy, and code organization patterns following the CLAUDE.md design principles.

## Architecture Principles

### Core Principles from CLAUDE.md

1. **Readability**: Code should be easy to understand
   - Named constants for magic numbers
   - Abstract complex logic into dedicated components
   - Separate code paths for conditional rendering
   - Simplify complex ternary operators

2. **Predictability**: Code should behave as expected
   - Standardized return types for similar functions
   - Reveal hidden logic (single responsibility)
   - Use unique and descriptive names

3. **Cohesion**: Keep related code together
   - Organize by feature/domain, not by type
   - Field-level or form-level validation cohesion
   - Relate magic numbers to logic

4. **Coupling**: Minimize dependencies
   - Balance abstraction (avoid premature abstraction)
   - Scope state management appropriately
   - Eliminate props drilling with composition

---

## Project Structure

```
esonge-frontend/
├── public/                      # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/                     # App-level configuration
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── components/              # Shared components
│   │   ├── ui/                  # Base UI components
│   │   ├── layout/              # Layout components
│   │   ├── loading/             # Loading states
│   │   ├── error/               # Error handling
│   │   ├── notification/        # Toast, alerts
│   │   └── modal/               # Modals, dialogs
│   ├── domains/                 # Domain-specific modules
│   │   ├── user/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── review/
│   │   └── customer-service/
│   ├── hooks/                   # Shared custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useIntersectionObserver.ts
│   ├── services/                # API services
│   │   ├── api/
│   │   │   ├── client.ts        # Axios instance
│   │   │   ├── endpoints.ts     # API endpoint constants
│   │   │   └── interceptors.ts  # Request/response interceptors
│   │   └── third-party/
│   │       ├── analytics.ts
│   │       ├── payment.ts
│   │       └── social-login.ts
│   ├── utils/                   # Utility functions
│   │   ├── format/
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   └── phone.ts
│   │   ├── validation/
│   │   │   ├── email.ts
│   │   │   ├── password.ts
│   │   │   └── phone.ts
│   │   └── helpers/
│   │       ├── string.ts
│   │       ├── array.ts
│   │       └── object.ts
│   ├── types/                   # Shared TypeScript types
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   ├── constants/               # Global constants
│   │   ├── routes.ts
│   │   ├── config.ts
│   │   └── messages.ts
│   ├── styles/                  # Global styles
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── themes/
│   └── main.tsx                 # App entry point
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Domain Structure (Detailed Example: Product Domain)

```
domains/product/
├── components/                  # Product-specific components
│   ├── Catalog/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductCard/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductImage.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   ├── ProductPrice.tsx
│   │   │   └── ProductActions.tsx
│   │   ├── CategoryNavigation.tsx
│   │   └── Breadcrumbs.tsx
│   ├── Search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchSuggestions.tsx
│   │   ├── SearchResults.tsx
│   │   └── PopularKeywords.tsx
│   ├── Filter/
│   │   ├── FilterPanel.tsx
│   │   ├── PriceRangeFilter.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── ActiveFilters.tsx
│   ├── Detail/
│   │   ├── ProductDetailPage.tsx
│   │   ├── ImageGallery/
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ImageZoom.tsx
│   │   │   └── ThumbnailList.tsx
│   │   ├── ProductInfo/
│   │   │   ├── ProductTitle.tsx
│   │   │   ├── ProductDescription.tsx
│   │   │   └── NutritionInfo.tsx
│   │   └── ProductOptions/
│   │       ├── QuantitySelector.tsx
│   │       └── GradeSelector.tsx
│   └── Featured/
│       ├── BestProducts.tsx
│       ├── NewArrivals.tsx
│       └── ProductCarousel.tsx
├── hooks/                       # Product-specific hooks
│   ├── useProducts.ts
│   ├── useProductDetail.ts
│   ├── useProductSearch.ts
│   ├── useProductFilter.ts
│   ├── useProductSort.ts
│   └── useRelatedProducts.ts
├── services/                    # Product API services
│   ├── productApi.ts
│   └── productQueries.ts        # React Query queries
├── types/                       # Product types
│   ├── product.types.ts
│   ├── category.types.ts
│   └── filter.types.ts
├── utils/                       # Product utilities
│   ├── productFormatters.ts
│   └── productHelpers.ts
├── constants/                   # Product constants
│   └── productConstants.ts
└── index.ts                     # Barrel export
```

---

## Component Categories

### 1. Base UI Components (`components/ui/`)

Reusable, atomic UI components following a design system.

#### Button Component Example

```tsx
// components/ui/Button/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  // Applying CLAUDE.md: Named conditions for clarity
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <span className={styles.spinner} />}
      {!isLoading && leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <span className={styles.content}>{children}</span>
      {!isLoading && rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
}
```

**UI Components List:**
- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Tag
- Card
- Divider
- IconButton
- Link

### 2. Layout Components (`components/layout/`)

Components that define page structure and layout.

#### Header Component Example

```tsx
// components/layout/Header/Header.tsx
import { Logo } from './Logo';
import { CategoryMenu } from './CategoryMenu';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { CartBadge } from '@/domains/cart/components';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <Logo />
        <SearchBar />
        <div className={styles.actions}>
          <UserMenu />
          <CartBadge />
        </div>
      </div>
      <nav className={styles.navigation}>
        <CategoryMenu />
      </nav>
    </header>
  );
}
```

**Layout Components List:**
- Header
- Footer
- Sidebar
- MainContent
- Container
- Grid
- Stack
- Spacer

### 3. Domain Components

Domain-specific business logic components.

#### Product Card Example (Following CLAUDE.md Principles)

```tsx
// domains/product/components/Catalog/ProductCard/ProductCard.tsx
import { Product } from '@/domains/product/types';
import { useCart } from '@/domains/cart/hooks';
import { useWishlist } from '@/domains/user/hooks';
import { ProductImage } from './ProductImage';
import { ProductInfo } from './ProductInfo';
import { ProductPrice } from './ProductPrice';
import { ProductActions } from './ProductActions';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // CLAUDE.md: Named conditions for clarity
  const isOutOfStock = product.stock <= 0;
  const hasFreeShipping = product.shipping.isFree;
  const isOnSale = product.salePrice < product.regularPrice;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
  };

  return (
    <article className={styles.card}>
      <ProductImage
        src={product.image}
        alt={product.name}
        badges={{
          freeShipping: hasFreeShipping,
          sale: isOnSale,
          outOfStock: isOutOfStock,
        }}
      />
      <ProductInfo
        name={product.name}
        origin={product.origin}
        grade={product.grade}
      />
      <ProductPrice
        regularPrice={product.regularPrice}
        salePrice={product.salePrice}
      />
      <ProductActions
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isInWishlist={isInWishlist(product.id)}
        isOutOfStock={isOutOfStock}
      />
    </article>
  );
}
```

#### Abstracting Complex Logic (CLAUDE.md Pattern)

```tsx
// domains/order/components/Checkout/CheckoutPage.tsx

// CLAUDE.md: Separate components for different conditional rendering
export function CheckoutPage() {
  const { isAuthenticated } = useAuth();

  // CLAUDE.md: Separating code paths for conditional rendering
  return isAuthenticated ? <AuthenticatedCheckout /> : <GuestCheckout />;
}

// Component specifically for authenticated users
function AuthenticatedCheckout() {
  const { user } = useAuth();
  const { addresses } = useAddresses(user.id);

  // Pre-filled with user data, saved addresses, etc.
  return (
    <div>
      <h1>Checkout</h1>
      <SavedAddressSelector addresses={addresses} />
      <CheckoutForm defaultValues={{ email: user.email }} />
    </div>
  );
}

// Component specifically for guest users
function GuestCheckout() {
  // Guest checkout with full form
  return (
    <div>
      <h1>Guest Checkout</h1>
      <GuestInfoNotice />
      <CheckoutForm />
      <CreateAccountPrompt />
    </div>
  );
}
```

---

## State Management Architecture

### State Management Strategy

We'll use a layered approach to state management:

1. **Server State**: TanStack Query (React Query)
2. **Client State**: React Context + hooks
3. **Form State**: React Hook Form
4. **URL State**: React Router + custom hooks
5. **Local Storage**: Custom hooks

### 1. Server State with TanStack Query

#### Query Organization

```tsx
// domains/product/services/productQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from './productApi';
import type { Product, ProductFilters } from '../types';

// CLAUDE.md: Consistent return types - always return the Query object
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProductDetail(productId),
    enabled: !!productId,
  });
}

export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: ['products', 'related', productId],
    queryFn: () => productApi.getRelatedProducts(productId),
    enabled: !!productId,
  });
}
```

#### Mutation Example

```tsx
// domains/cart/hooks/useCart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../services/cartApi';
import { useToast } from '@/components/notification';

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      // Invalidate cart queries to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast({ message: '장바구니에 추가되었습니다.', type: 'success' });
    },
    onError: (error) => {
      showToast({ message: '장바구니 추가에 실패했습니다.', type: 'error' });
      console.error('Failed to add to cart:', error);
    },
  });
}
```

### 2. Client State with Context

#### Scoped Context Example (CLAUDE.md: Avoiding Overly Broad State)

```tsx
// domains/user/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { useAuthState } from '../hooks/useAuthState';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthState();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

```tsx
// CLAUDE.md: Focused hooks for specific needs
// domains/product/hooks/useProductFilters.ts

import { create } from 'zustand';
import { ProductFilters } from '../types';

interface ProductFilterState {
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: ProductFilters = {
  category: null,
  priceRange: { min: 0, max: Infinity },
  origin: [],
  grade: [],
  inStock: false,
};

export const useProductFilters = create<ProductFilterState>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
```

### 3. Form State with React Hook Form + Zod

#### Form-Level Cohesion Example (CLAUDE.md Pattern)

```tsx
// domains/order/components/Checkout/ShippingForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// CLAUDE.md: Form-level cohesion - single schema for related fields
const shippingSchema = z.object({
  recipientName: z.string().min(1, '수령인 이름을 입력해주세요.'),
  phone: z.string().regex(/^010-?\d{4}-?\d{4}$/, '올바른 전화번호를 입력해주세요.'),
  postalCode: z.string().length(5, '우편번호는 5자리입니다.'),
  address: z.string().min(1, '주소를 입력해주세요.'),
  detailAddress: z.string().min(1, '상세주소를 입력해주세요.'),
  deliveryInstructions: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  defaultValues?: Partial<ShippingFormData>;
}

export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('recipientName')} placeholder="수령인" />
        {errors.recipientName && <span>{errors.recipientName.message}</span>}
      </div>
      <div>
        <input {...register('phone')} placeholder="전화번호" />
        {errors.phone && <span>{errors.phone.message}</span>}
      </div>
      <div>
        <input {...register('postalCode')} placeholder="우편번호" />
        {errors.postalCode && <span>{errors.postalCode.message}</span>}
      </div>
      <div>
        <input {...register('address')} placeholder="주소" />
        {errors.address && <span>{errors.address.message}</span>}
      </div>
      <div>
        <input {...register('detailAddress')} placeholder="상세주소" />
        {errors.detailAddress && <span>{errors.detailAddress.message}</span>}
      </div>
      <div>
        <textarea {...register('deliveryInstructions')} placeholder="배송 요청사항 (선택)" />
      </div>
      <button type="submit">다음</button>
    </form>
  );
}
```

#### Field-Level Cohesion Example (CLAUDE.md Pattern)

```tsx
// domains/user/components/RegisterForm.tsx
import { useForm } from 'react-hook-form';

// When fields have independent validation or async checks, use field-level cohesion
export function RegisterForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log('Form submitted:', data);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          {...register('email', {
            validate: async (value) => {
              // Field-level async validation
              const isAvailable = await checkEmailAvailability(value);
              return isAvailable || '이미 사용 중인 이메일입니다.';
            },
          })}
          placeholder="이메일"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <input
          {...register('username', {
            validate: async (value) => {
              // Field-level async validation
              const isAvailable = await checkUsernameAvailability(value);
              return isAvailable || '이미 사용 중인 사용자명입니다.';
            },
          })}
          placeholder="사용자명"
        />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <button type="submit">가입하기</button>
    </form>
  );
}
```

### 4. URL State Management

```tsx
// hooks/useQueryParams.ts
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useQueryParam<T = string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = (searchParams.get(key) as T) ?? defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (newValue === null || newValue === undefined) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(newValue));
      }
      setSearchParams(newSearchParams, { replace: true });
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}

// Usage example
function ProductListPage() {
  const [category, setCategory] = useQueryParam('category', 'all');
  const [sort, setSort] = useQueryParam('sort', 'newest');

  // category and sort are synced with URL
}
```

---

## Routing Architecture

### Route Structure

```tsx
// app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { AuthGuard } from '@/domains/user/components/AuthGuard';

// Lazy loading for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductListPage = lazy(() => import('@/domains/product/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/domains/product/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/domains/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/domains/order/pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('@/domains/order/pages/OrderHistoryPage'));
const LoginPage = lazy(() => import('@/domains/user/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/domains/user/pages/RegisterPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductListPage />,
          },
          {
            path: ':productId',
            element: <ProductDetailPage />,
          },
          {
            path: 'category/:categoryId',
            element: <ProductListPage />,
          },
        ],
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: (
          <AuthGuard>
            <CheckoutPage />
          </AuthGuard>
        ),
      },
      {
        path: 'orders',
        element: (
          <AuthGuard>
            <OrderHistoryPage />
          </AuthGuard>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
]);
```

### Route Constants

```tsx
// constants/routes.ts

// CLAUDE.md: Named constants for clarity
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  PRODUCT_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: (orderId: string) => `/orders/${orderId}`,
  LOGIN: '/login',
  REGISTER: '/register',
  MY_PAGE: '/my-page',
  WISHLIST: '/wishlist',
  REVIEWS: '/reviews',
  QA: '/customer-service/qa',
  NOTICES: '/customer-service/notices',
  FAQ: '/customer-service/faq',
  CONTACT: '/customer-service/contact',
} as const;
```

---

## Component Composition Patterns

### Eliminating Props Drilling (CLAUDE.md Pattern)

#### Before (Props Drilling)

```tsx
// ❌ Not Recommended: Props drilling through multiple levels
function ProductDetailPage() {
  const { data: product } = useProductDetail(productId);
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  return (
    <ProductDetailLayout
      product={product}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
    />
  );
}

function ProductDetailLayout({ product, addToCart, toggleWishlist }) {
  return (
    <div>
      <ProductInfo product={product} />
      <ProductActions
        product={product}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
      />
    </div>
  );
}

function ProductActions({ product, addToCart, toggleWishlist }) {
  return (
    <div>
      <AddToCartButton onClick={() => addToCart(product)} />
      <WishlistButton onClick={() => toggleWishlist(product.id)} />
    </div>
  );
}
```

#### After (Component Composition)

```tsx
// ✅ Recommended: Component composition
function ProductDetailPage() {
  const { data: product } = useProductDetail(productId);

  if (!product) return <ProductDetailSkeleton />;

  return (
    <ProductDetailLayout>
      <ProductImageGallery images={product.images} />
      <ProductInfo product={product} />
      <ProductActions productId={product.id} product={product} />
    </ProductDetailLayout>
  );
}

function ProductDetailLayout({ children }) {
  return <div className={styles.layout}>{children}</div>;
}

// Each component manages its own data needs
function ProductActions({ productId, product }) {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  return (
    <div>
      <AddToCartButton onClick={() => addToCart(product)} />
      <WishlistButton onClick={() => toggleWishlist(productId)} />
    </div>
  );
}
```

### Compound Components Pattern

```tsx
// components/ui/Tabs/Tabs.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
}

export function Tabs({
  defaultTab,
  children,
}: {
  defaultTab: string;
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

export function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return <div className="tab-panel">{children}</div>;
}

// Usage
function ProductDetailTabs() {
  return (
    <Tabs defaultTab="description">
      <TabList>
        <Tab value="description">상품설명</Tab>
        <Tab value="reviews">리뷰</Tab>
        <Tab value="qa">Q&A</Tab>
      </TabList>
      <TabPanel value="description">
        <ProductDescription />
      </TabPanel>
      <TabPanel value="reviews">
        <ReviewList />
      </TabPanel>
      <TabPanel value="qa">
        <ProductQA />
      </TabPanel>
    </Tabs>
  );
}
```

---

## Error Handling & Loading States

### Error Boundary

```tsx
// components/error/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { ErrorPage } from './ErrorPage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### Loading States with Suspense

```tsx
// app/App.tsx
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { PageLoader } from '@/components/loading/PageLoader';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Skeleton Loading States

```tsx
// components/loading/Skeleton.tsx
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  className?: string;
}

export function Skeleton({
  width,
  height,
  variant = 'text',
  className,
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className || ''}`}
      style={{ width, height }}
    />
  );
}

// Usage in ProductCard skeleton
export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}
```

---

## Performance Optimization Strategies

### Code Splitting

```tsx
// Lazy load routes
const ProductDetailPage = lazy(() => import('@/domains/product/pages/ProductDetailPage'));

// Lazy load heavy components
const ImageZoom = lazy(() => import('@/components/ui/ImageZoom'));
```

### Memoization

```tsx
// CLAUDE.md: Only memoize when necessary
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive calculations
function ProductList({ products, filters }) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesPrice =
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max;
      return matchesCategory && matchesPrice;
    });
  }, [products, filters]);

  return (
    <div>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Memoize components that receive complex props
export const ProductCard = memo(function ProductCard({ product }) {
  // Component implementation
});
```

### Virtual Scrolling

```tsx
// For long lists, use virtual scrolling
import { useVirtualizer } from '@tanstack/react-virtual';

function ProductListVirtualized({ products }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // Estimated item height
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Image Optimization

```tsx
// components/ui/Image/OptimizedImage.tsx
import { useState } from 'react';
import { Skeleton } from '@/components/loading/Skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return <div className="image-error">이미지를 불러올 수 없습니다.</div>;
  }

  return (
    <>
      {isLoading && <Skeleton variant="rectangular" width={width} height={height} />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
}
```

---

## Accessibility Patterns

### Keyboard Navigation

```tsx
// components/ui/Dropdown/Dropdown.tsx
import { useState, useRef, useEffect } from 'react';

export function Dropdown({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (focusedIndex >= 0) {
          onSelect(options[focusedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        Select option
      </button>
      {isOpen && (
        <ul role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={index === focusedIndex}
              onClick={() => onSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Screen Reader Support

```tsx
// Use semantic HTML and ARIA attributes
function ProductCard({ product }) {
  return (
    <article aria-labelledby={`product-${product.id}-title`}>
      <img src={product.image} alt={product.name} />
      <h3 id={`product-${product.id}-title`}>{product.name}</h3>
      <p aria-label="가격">
        <span aria-hidden="true">₩</span>
        {product.price.toLocaleString()}
        <span className="sr-only">원</span>
      </p>
      <button aria-label={`${product.name} 장바구니에 추가`}>
        장바구니 담기
      </button>
    </article>
  );
}
```

---

## Testing Strategy

### Component Testing

```tsx
// domains/product/components/ProductCard/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

const mockProduct = {
  id: '1',
  name: '자연산 송이버섯',
  price: 100000,
  image: '/images/product-1.jpg',
  stock: 10,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('자연산 송이버섯')).toBeInTheDocument();
    expect(screen.getByText('₩100,000')).toBeInTheDocument();
  });

  it('calls addToCart when add to cart button is clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    fireEvent.click(screen.getByText('장바구니 담기'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

### Hook Testing

```tsx
// domains/cart/hooks/useCart.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';

describe('useCart', () => {
  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockProduct);
  });
});
```

---

## Summary

This component architecture document provides:

1. **Clear Structure**: Domain-based organization following CLAUDE.md cohesion principles
2. **State Management**: Layered approach with appropriate tools for each state type
3. **Component Patterns**: Reusable patterns following CLAUDE.md principles (composition, abstraction, separation)
4. **Performance**: Optimization strategies (code splitting, memoization, virtual scrolling)
5. **Accessibility**: WCAG compliance patterns
6. **Testing**: Component and hook testing strategies

The architecture prioritizes:
- **Readability**: Clear, self-documenting code
- **Predictability**: Consistent patterns and return types
- **Cohesion**: Related code grouped together
- **Low Coupling**: Minimal dependencies between modules
- **Maintainability**: Easy to understand, modify, and extend
- **Scalability**: Can grow with the project

All patterns align with the CLAUDE.md design guidelines and modern React best practices.
