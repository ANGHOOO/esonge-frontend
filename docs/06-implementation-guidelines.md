# Esonge Shopping Mall - Implementation Guidelines

This document provides detailed implementation guidelines, coding standards, best practices, and patterns for the Esonge frontend development team. All guidelines are aligned with the CLAUDE.md design principles.

## Table of Contents

1. [Coding Standards](#coding-standards)
2. [Component Development Patterns](#component-development-patterns)
3. [State Management Best Practices](#state-management-best-practices)
4. [Form Validation Strategies](#form-validation-strategies)
5. [API Integration Patterns](#api-integration-patterns)
6. [Testing Strategies](#testing-strategies)
7. [Performance Optimization](#performance-optimization)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Error Handling Patterns](#error-handling-patterns)
10. [Security Best Practices](#security-best-practices)

---

## Coding Standards

### 1.1 TypeScript Standards

#### Always Use Explicit Types

```typescript
// ❌ Avoid implicit any
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Use explicit types
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### Use Type Inference Wisely

```typescript
// ✅ Good: Let TypeScript infer when obvious
const productName = 'Natural Matsutake'; // inferred as string
const quantity = 5; // inferred as number

// ✅ Good: Explicit types for function parameters and returns
function formatPrice(amount: number, currency: string = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency }).format(amount);
}
```

#### Prefer Interfaces for Object Shapes

```typescript
// ✅ Use interfaces for object shapes
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// ✅ Use type for unions, intersections, or mapped types
type ProductStatus = 'available' | 'out_of_stock' | 'discontinued';
type ReadonlyProduct = Readonly<Product>;
```

#### Use Discriminated Unions for State

```typescript
// ✅ Discriminated unions for API states
type ApiResponse<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Usage with type safety
function handleResponse<T>(response: ApiResponse<T>) {
  if (response.status === 'success') {
    // TypeScript knows response.data exists here
    console.log(response.data);
  }
}
```

### 1.2 Naming Conventions

#### Component Names: PascalCase

```typescript
// ✅ Component names
function ProductCard() {}
function ShippingAddressForm() {}
function OrderStatusTimeline() {}
```

#### Hook Names: camelCase with 'use' prefix

```typescript
// ✅ Hook names
function useProductDetail() {}
function useAuth() {}
function useCart() {}
```

#### Constants: UPPER_SNAKE_CASE

```typescript
// ✅ Constants (CLAUDE.md: Naming magic numbers)
const ANIMATION_DELAY_MS = 300;
const MAX_CART_ITEMS = 99;
const DEFAULT_PAGE_SIZE = 16;
const FREE_SHIPPING_THRESHOLD = 50000; // 50,000 KRW
```

#### Variables and Functions: camelCase

```typescript
// ✅ Variables and functions
const productList = [];
const isAuthenticated = true;
function calculateShipping() {}
function formatPhoneNumber() {}
```

### 1.3 File Naming Conventions

```
// ✅ Component files: PascalCase
ProductCard.tsx
ShippingForm.tsx

// ✅ Hook files: camelCase with 'use' prefix
useProducts.ts
useAuth.ts

// ✅ Utility files: camelCase
formatCurrency.ts
validateEmail.ts

// ✅ Type files: camelCase with '.types.ts' suffix
product.types.ts
user.types.ts

// ✅ Test files: same name with '.test.ts' suffix
ProductCard.test.tsx
useProducts.test.ts
```

### 1.4 Import Order

```typescript
// 1. React and external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 2. Internal absolute imports (path aliases)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/domains/user/hooks/useAuth';
import { Product } from '@/domains/product/types';

// 3. Relative imports
import { ProductCard } from './ProductCard';
import { formatPrice } from '../utils/formatPrice';

// 4. Styles
import styles from './ProductList.module.css';
```

---

## Component Development Patterns

### 2.1 Component Structure Template

```tsx
// CLAUDE.md aligned component structure
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/format/currency';
import styles from './ProductCard.module.css';

// 1. Types and interfaces
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

// 2. Constants (CLAUDE.md: Named constants)
const OUT_OF_STOCK_MESSAGE = '품절';
const ADD_TO_CART_TEXT = '장바구니 담기';

// 3. Component
export function ProductCard({ product, onAddToCart, onToggleWishlist }: ProductCardProps) {
  // 3.1 State
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 3.2 Derived state (CLAUDE.md: Named conditions)
  const isOutOfStock = product.stock <= 0;
  const hasFreeShipping = product.shipping.isFree;
  const isOnSale = product.salePrice < product.regularPrice;

  // 3.3 Event handlers
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleToggleWishlist = () => {
    onToggleWishlist(product.id);
  };

  // 3.4 Render
  return (
    <article className={styles.card}>
      {/* Component JSX */}
    </article>
  );
}

// 4. Sub-components (if needed, prefer separate files for complex ones)
function ProductBadges({ isFreeShipping, isOnSale }: { isFreeShipping: boolean; isOnSale: boolean }) {
  return (
    <div className={styles.badges}>
      {isFreeShipping && <span className={styles.badge}>무료배송</span>}
      {isOnSale && <span className={styles.badgeSale}>할인</span>}
    </div>
  );
}
```

### 2.2 Conditional Rendering Patterns

#### Separating Code Paths (CLAUDE.md Pattern)

```tsx
// ✅ CLAUDE.md: Separate components for different roles
function SubmitButton() {
  const { role } = useAuth();

  // Delegate to specialized components
  return role === 'viewer' ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

// Component specifically for 'viewer' role
function ViewerSubmitButton() {
  return (
    <Button disabled variant="secondary">
      제출 (권한 없음)
    </Button>
  );
}

// Component specifically for 'admin' role
function AdminSubmitButton() {
  const handleSubmit = () => {
    // Admin-specific submission logic
  };

  return (
    <Button onClick={handleSubmit} variant="primary">
      제출
    </Button>
  );
}
```

#### Simple Conditionals

```tsx
// ✅ For simple conditionals, use inline rendering
function ProductCard({ product }) {
  return (
    <div>
      {product.stock > 0 ? (
        <Button onClick={handleAddToCart}>장바구니 담기</Button>
      ) : (
        <Button disabled>품절</Button>
      )}
    </div>
  );
}
```

#### Complex Conditionals (CLAUDE.md: Simplifying ternaries)

```tsx
// ❌ Avoid nested ternaries
const status = isPaid ? (isShipped ? 'delivered' : 'processing') : 'pending';

// ✅ Use IIFE with if statements
const status = (() => {
  if (isPaid && isShipped) return 'delivered';
  if (isPaid) return 'processing';
  return 'pending';
})();

// ✅ Or use early returns in a function
function getOrderStatus(isPaid: boolean, isShipped: boolean): string {
  if (isPaid && isShipped) return 'delivered';
  if (isPaid) return 'processing';
  return 'pending';
}
```

### 2.3 Component Composition (CLAUDE.md: Eliminating Props Drilling)

```tsx
// ❌ Avoid props drilling
function ProductDetailPage() {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  return (
    <ProductLayout addToCart={addToCart} toggleWishlist={toggleWishlist}>
      {/* ... */}
    </ProductLayout>
  );
}

// ✅ Use component composition
function ProductDetailPage() {
  return (
    <ProductLayout>
      <ProductImageGallery />
      <ProductInfo />
      <ProductActions /> {/* Manages its own data needs */}
    </ProductLayout>
  );
}

function ProductActions() {
  const { addToCart } = useCart(); // Fetches its own dependencies
  const { toggleWishlist } = useWishlist();

  return (
    <div>
      <Button onClick={() => addToCart(product)}>장바구니</Button>
      <Button onClick={() => toggleWishlist(product.id)}>위시리스트</Button>
    </div>
  );
}
```

### 2.4 Abstracting Complex Logic (CLAUDE.md Pattern)

```tsx
// ✅ CLAUDE.md: Dedicated component for complex interactions
function InviteButton({ userName }: { userName: string }) {
  const handleClick = async () => {
    const confirmed = await showConfirmDialog({
      title: `${userName}님에게 초대를 보내시겠습니까?`,
      message: '초대 알림이 발송됩니다.',
    });

    if (confirmed) {
      await sendInvitation(userName);
      showToast('초대를 보냈습니다.');
    }
  };

  return <Button onClick={handleClick}>초대하기</Button>;
}

// Usage: Clean parent component
function FriendList() {
  return (
    <div>
      {friends.map((friend) => (
        <div key={friend.id}>
          <span>{friend.name}</span>
          <InviteButton userName={friend.name} />
        </div>
      ))}
    </div>
  );
}
```

---

## State Management Best Practices

### 3.1 Server State with TanStack Query

#### Query Hooks Pattern

```typescript
// domains/product/services/productQueries.ts

// ✅ CLAUDE.md: Consistent return types - always return Query object
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { productApi } from './productApi';
import type { Product, ProductFilters } from '../types';

export function useProducts(filters: ProductFilters): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProductDetail(productId: string): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProductDetail(productId),
    enabled: !!productId, // Only fetch if productId exists
  });
}
```

#### Mutation Hooks Pattern

```typescript
// domains/cart/hooks/useAddToCart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../services/cartApi';
import { useToast } from '@/hooks/useToast';

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: cartApi.addToCart,
    // Optimistic update
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], (old: any) => ({
        ...old,
        items: [...old.items, newItem],
      }));

      return { previousCart };
    },
    // Rollback on error
    onError: (err, newItem, context) => {
      queryClient.setQueryData(['cart'], context?.previousCart);
      showToast({ message: '장바구니 추가 실패', type: 'error' });
    },
    // Refetch on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast({ message: '장바구니에 추가되었습니다', type: 'success' });
    },
  });
}
```

### 3.2 Client State with Zustand

#### Focused Store Pattern (CLAUDE.md: Scoped state management)

```typescript
// domains/product/stores/filterStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FilterState {
  category: string | null;
  priceRange: { min: number; max: number };
  origin: string[];
  inStockOnly: boolean;
  setCategory: (category: string | null) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  toggleOrigin: (origin: string) => void;
  toggleInStockOnly: () => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS = {
  category: null,
  priceRange: { min: 0, max: Infinity },
  origin: [],
  inStockOnly: false,
};

export const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      ...DEFAULT_FILTERS,
      setCategory: (category) => set({ category }),
      setPriceRange: (priceRange) => set({ priceRange }),
      toggleOrigin: (origin) =>
        set((state) => ({
          origin: state.origin.includes(origin)
            ? state.origin.filter((o) => o !== origin)
            : [...state.origin, origin],
        })),
      toggleInStockOnly: () => set((state) => ({ inStockOnly: !state.inStockOnly })),
      resetFilters: () => set(DEFAULT_FILTERS),
    }),
    { name: 'FilterStore' }
  )
);
```

### 3.3 Context Pattern

#### Scoped Context (CLAUDE.md Pattern)

```typescript
// domains/user/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/authApi';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authApi.verifyToken(token);
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user, token } = await authApi.login(email, password);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Form Validation Strategies

### 4.1 Form-Level Cohesion (CLAUDE.md Pattern)

```tsx
// Use when fields are interdependent or form validation is unified
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Single schema for entire form
const shippingSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().regex(/^010-?\d{4}-?\d{4}$/, '올바른 전화번호를 입력해주세요'),
  postalCode: z.string().length(5, '우편번호는 5자리입니다'),
  address: z.string().min(1, '주소를 입력해주세요'),
  detailAddress: z.string().min(1, '상세주소를 입력해주세요'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export function ShippingForm({ onSubmit }: { onSubmit: (data: ShippingFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="이름" />
      {errors.name && <span className="error">{errors.name.message}</span>}

      <input {...register('phone')} placeholder="전화번호" />
      {errors.phone && <span className="error">{errors.phone.message}</span>}

      {/* ... other fields ... */}

      <button type="submit">제출</button>
    </form>
  );
}
```

### 4.2 Field-Level Cohesion (CLAUDE.md Pattern)

```tsx
// Use when fields are independent or require async validation
import { useForm } from 'react-hook-form';
import { checkEmailAvailability } from '../services/userApi';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: '이메일을 입력해주세요',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: '올바른 이메일 형식이 아닙니다',
          },
          validate: async (value) => {
            // Field-level async validation
            const isAvailable = await checkEmailAvailability(value);
            return isAvailable || '이미 사용 중인 이메일입니다';
          },
        })}
        placeholder="이메일"
      />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <input
        {...register('username', {
          required: '사용자명을 입력해주세요',
          minLength: {
            value: 3,
            message: '최소 3자 이상이어야 합니다',
          },
          validate: async (value) => {
            const isAvailable = await checkUsernameAvailability(value);
            return isAvailable || '이미 사용 중인 사용자명입니다';
          },
        })}
        placeholder="사용자명"
      />
      {errors.username && <span className="error">{errors.username.message}</span>}

      <button type="submit">가입하기</button>
    </form>
  );
}
```

### 4.3 Reusable Validation Rules

```typescript
// utils/validation/schemas.ts
import * as z from 'zod';

// Reusable validation schemas
export const emailSchema = z.string().email('올바른 이메일 형식이 아닙니다');

export const phoneSchema = z
  .string()
  .regex(/^010-?\d{4}-?\d{4}$/, '올바른 전화번호 형식이 아닙니다 (010-XXXX-XXXX)');

export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .regex(/[A-Z]/, '대문자를 포함해야 합니다')
  .regex(/[a-z]/, '소문자를 포함해야 합니다')
  .regex(/[0-9]/, '숫자를 포함해야 합니다')
  .regex(/[^A-Za-z0-9]/, '특수문자를 포함해야 합니다');

export const koreanNameSchema = z
  .string()
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(20, '이름은 최대 20자까지 가능합니다')
  .regex(/^[가-힣]+$/, '한글만 입력 가능합니다');

// Usage in forms
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});
```

---

## API Integration Patterns

### 5.1 API Client Setup

```typescript
// services/api/client.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
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
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle common errors)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error);
      // Optionally show global error toast
    }

    return Promise.reject(error);
  }
);
```

### 5.2 API Service Pattern

```typescript
// domains/product/services/productApi.ts
import { apiClient } from '@/services/api/client';
import type { Product, ProductFilters, ProductDetail } from '../types';

// CLAUDE.md: Single responsibility - each function does one thing
export const productApi = {
  getProducts: async (filters: ProductFilters): Promise<Product[]> => {
    const { data } = await apiClient.get('/products', { params: filters });
    return data;
  },

  getProductDetail: async (productId: string): Promise<ProductDetail> => {
    const { data } = await apiClient.get(`/products/${productId}`);
    return data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const { data } = await apiClient.get('/products/search', { params: { q: query } });
    return data;
  },

  getRelatedProducts: async (productId: string): Promise<Product[]> => {
    const { data } = await apiClient.get(`/products/${productId}/related`);
    return data;
  },
};

// Usage in React Query hooks
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
  });
}
```

### 5.3 Error Handling Pattern

```typescript
// utils/errors/apiError.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Centralized error handler
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || '요청 처리 중 오류가 발생했습니다';
    const code = error.response?.data?.code;

    return new ApiError(status, message, code);
  }

  return new ApiError(500, '알 수 없는 오류가 발생했습니다');
}

// Usage in components
function ProductList() {
  const { data, error, isError } = useProducts(filters);

  if (isError) {
    const apiError = handleApiError(error);

    return (
      <div className="error">
        <p>{apiError.message}</p>
        {apiError.status === 404 && <p>상품을 찾을 수 없습니다</p>}
      </div>
    );
  }

  // ... render products
}
```

---

## Testing Strategies

### 6.1 Component Testing

```tsx
// domains/product/components/ProductCard/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

const mockProduct = {
  id: '1',
  name: '자연산 송이버섯',
  price: 100000,
  salePrice: 80000,
  image: '/images/product-1.jpg',
  stock: 10,
  shipping: { isFree: true },
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('자연산 송이버섯')).toBeInTheDocument();
    expect(screen.getByText('₩80,000')).toBeInTheDocument();
  });

  it('shows free shipping badge when applicable', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('무료배송')).toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart button is clicked', () => {
    const mockAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    fireEvent.click(screen.getByText('장바구니 담기'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('disables add to cart button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);

    const button = screen.getByText('품절');
    expect(button).toBeDisabled();
  });
});
```

### 6.2 Hook Testing

```typescript
// domains/cart/hooks/useCart.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCart } from './useCart';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useCart', () => {
  it('adds item to cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual(mockProduct);
    });
  });

  it('calculates total correctly', async () => {
    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToCart({ ...mockProduct, price: 10000, quantity: 2 });
      result.current.addToCart({ ...mockProduct, id: '2', price: 5000, quantity: 3 });
    });

    await waitFor(() => {
      expect(result.current.total).toBe(35000); // (10000*2) + (5000*3)
    });
  });
});
```

### 6.3 E2E Testing

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('completes full checkout process', async ({ page }) => {
    // Navigate to product page
    await page.goto('/products/1');

    // Add to cart
    await page.click('text=장바구니 담기');
    await expect(page.locator('.toast')).toContainText('장바구니에 추가되었습니다');

    // Go to cart
    await page.click('[aria-label="장바구니"]');
    await expect(page).toHaveURL(/\/cart/);

    // Proceed to checkout
    await page.click('text=주문하기');
    await expect(page).toHaveURL(/\/checkout/);

    // Fill shipping information
    await page.fill('input[name="name"]', '홍길동');
    await page.fill('input[name="phone"]', '010-1234-5678');
    await page.fill('input[name="postalCode"]', '12345');
    await page.fill('input[name="address"]', '서울시 강남구');
    await page.click('text=다음');

    // Select payment method
    await page.click('text=신용카드');
    await page.click('text=결제하기');

    // Verify order confirmation
    await expect(page).toHaveURL(/\/order\/complete/);
    await expect(page.locator('h1')).toContainText('주문완료');
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.goto('/checkout');

    await page.click('text=다음');

    await expect(page.locator('text=이름을 입력해주세요')).toBeVisible();
    await expect(page.locator('text=전화번호를 입력해주세요')).toBeVisible();
  });
});
```

---

## Performance Optimization

### 7.1 Code Splitting

```tsx
// Lazy load routes
import { lazy, Suspense } from 'react';
import { PageLoader } from '@/components/loading/PageLoader';

const ProductDetailPage = lazy(() => import('@/domains/product/pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('@/domains/order/pages/CheckoutPage'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 7.2 Memoization (Use Wisely)

```tsx
import { memo, useMemo, useCallback } from 'react';

// ✅ Memoize expensive calculations
function ProductList({ products, filters }) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Expensive filtering logic
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesPrice = product.price >= filters.priceRange.min &&
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

// ✅ Memoize callbacks passed to child components
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Dependencies array empty if no external values used

  return <ChildComponent onClick={handleClick} />;
}

// ✅ Memoize components with expensive renders
export const ProductCard = memo(function ProductCard({ product }) {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function (optional)
  return prevProps.product.id === nextProps.product.id;
});
```

### 7.3 Image Optimization

```tsx
// components/ui/Image/OptimizedImage.tsx
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function OptimizedImage({ src, alt, width, height, className }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="image-placeholder">
        <span>이미지를 불러올 수 없습니다</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {!isLoaded && <div className="skeleton" style={{ width, height }} />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
}
```

---

## Accessibility Guidelines

### 8.1 Semantic HTML

```tsx
// ✅ Use semantic HTML elements
function ProductCard({ product }) {
  return (
    <article> {/* Use article for self-contained content */}
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3> {/* Use proper heading hierarchy */}
      <p>{product.description}</p>
      <button type="button">장바구니 담기</button>
    </article>
  );
}

// ✅ Use nav for navigation
function Header() {
  return (
    <header>
      <nav aria-label="주 메뉴">
        <ul>
          <li><a href="/">홈</a></li>
          <li><a href="/products">상품</a></li>
          <li><a href="/cart">장바구니</a></li>
        </ul>
      </nav>
    </header>
  );
}
```

### 8.2 ARIA Attributes

```tsx
// ✅ Use ARIA attributes for accessibility
function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div role="search">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="상품 검색"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-expanded={isOpen}
      />
      {isOpen && (
        <ul id="search-suggestions" role="listbox">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} role="option">
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ✅ Use aria-live for dynamic content
function CartBadge({ count }) {
  return (
    <button aria-label={`장바구니, ${count}개 상품`}>
      <ShoppingCartIcon />
      <span aria-live="polite" aria-atomic="true">
        {count}
      </span>
    </button>
  );
}
```

### 8.3 Keyboard Navigation

```tsx
function Dropdown({ options, onSelect }) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

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
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown} role="combobox" tabIndex={0}>
      {/* Dropdown content */}
    </div>
  );
}
```

---

## Error Handling Patterns

### 9.1 Error Boundaries

```tsx
// components/error/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

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
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-page">
            <h1>오류가 발생했습니다</h1>
            <p>{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()}>페이지 새로고침</button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### 9.2 API Error Handling

```tsx
// Consistent error handling pattern
function ProductList() {
  const { data, error, isError, isLoading, refetch } = useProducts(filters);

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  if (isError) {
    return (
      <div className="error-state">
        <p>상품을 불러오는 중 오류가 발생했습니다</p>
        <p className="error-message">{error.message}</p>
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>상품이 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Security Best Practices

### 10.1 XSS Prevention

```tsx
// ✅ React automatically escapes values in JSX
function ProductDescription({ description }) {
  return <p>{description}</p>; // Safe from XSS
}

// ⚠️ Be careful with dangerouslySetInnerHTML
function RichTextContent({ html }) {
  // Only use if HTML is sanitized on server
  // Consider using a library like DOMPurify
  return <div dangerouslySetInnerHTML={{ __html: sanitize(html) }} />;
}
```

### 10.2 Secure Token Storage

```typescript
// ✅ Store sensitive tokens securely
class TokenStorage {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static setTokens(token: string, refreshToken: string) {
    // Use httpOnly cookies in production for better security
    // localStorage is acceptable for development
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static clearTokens() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
```

### 10.3 Input Validation

```typescript
// Always validate user input on both client and server
function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^010-?\d{4}-?\d{4}$/;
  return phoneRegex.test(phone);
}

// Sanitize user input before displaying
function sanitizeUserInput(input: string): string {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

---

## Summary

This implementation guide provides:

1. **Coding Standards**: TypeScript, naming conventions, file organization
2. **Component Patterns**: CLAUDE.md-aligned patterns for readability and maintainability
3. **State Management**: TanStack Query, Zustand, Context best practices
4. **Form Validation**: Field-level vs form-level cohesion strategies
5. **API Integration**: Consistent patterns for API calls and error handling
6. **Testing**: Unit, integration, and E2E testing approaches
7. **Performance**: Code splitting, memoization, image optimization
8. **Accessibility**: WCAG compliance patterns
9. **Error Handling**: Error boundaries and graceful degradation
10. **Security**: XSS prevention, token storage, input validation

All patterns align with the four core CLAUDE.md principles:
- **Readability**: Clear, self-documenting code
- **Predictability**: Consistent patterns and return types
- **Cohesion**: Related code grouped together
- **Coupling**: Minimal dependencies between modules

Following these guidelines will ensure a maintainable, scalable, and high-quality codebase.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-04
**Maintained By**: Development Team
