// Lazy loading imports for code splitting
import { lazy } from 'react';

export const HomePage = lazy(() =>
  import('./HomePage/HomePage').then((m) => ({ default: m.HomePage }))
);
export const LoginPage = lazy(() =>
  import('./LoginPage/LoginPage').then((m) => ({ default: m.LoginPage }))
);
export const RegisterPage = lazy(() =>
  import('./RegisterPage/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
export const ProductsPage = lazy(() =>
  import('./ProductsPage/ProductsPage').then((m) => ({ default: m.ProductsPage }))
);
export const CartPage = lazy(() =>
  import('./CartPage/CartPage').then((m) => ({ default: m.CartPage }))
);
export const NotFoundPage = lazy(() =>
  import('./NotFoundPage/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
