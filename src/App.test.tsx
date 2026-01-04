import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Esonge Shopping Mall/i)).toBeInTheDocument();
  });

  it('displays setup completion message', () => {
    render(<App />);
    expect(screen.getByText(/환경 설정이 완료되었습니다/i)).toBeInTheDocument();
  });
});
