import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // 여러 요소가 있을 수 있으므로 getAllByText 사용
    const elements = screen.getAllByText(/강원송이총판/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renders main layout with header', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
