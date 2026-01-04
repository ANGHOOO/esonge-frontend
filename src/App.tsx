import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from './services/query/client';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { ROUTES } from './constants/routes';

// Placeholder components
function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Esonge Shopping Mall</h1>
      <p>강원송이총판 동성유통 쇼핑몰 프론트엔드</p>
      <p>환경 설정이 완료되었습니다! 🎉</p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
