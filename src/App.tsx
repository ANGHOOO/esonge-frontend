import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from './services/query/client';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { MainLayout } from './components/layout';
import { Spinner } from './components/ui';
import { ROUTES } from './constants/routes';
import { HomePage, LoginPage, RegisterPage, ProductsPage, CartPage, NotFoundPage } from './pages';

// Loading fallback component
function PageLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <Spinner size="lg" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MainLayout>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                {/* Public Routes */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

                {/* Product Routes */}
                <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />

                {/* Shopping Routes */}
                <Route path={ROUTES.CART} element={<CartPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
