import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SearchBar } from './SearchBar';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderSearchBar = (props = {}) => {
  return render(
    <BrowserRouter>
      <SearchBar {...props} />
    </BrowserRouter>
  );
};

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('rendering', () => {
    it('should render search input', () => {
      renderSearchBar();

      expect(screen.getByRole('textbox', { name: '상품 검색' })).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      renderSearchBar({ placeholder: '검색어를 입력하세요' });

      expect(screen.getByPlaceholderText('검색어를 입력하세요')).toBeInTheDocument();
    });

    it('should render with default placeholder', () => {
      renderSearchBar();

      expect(screen.getByPlaceholderText('상품 검색...')).toBeInTheDocument();
    });
  });

  describe('search input behavior', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.type(input, '버섯');

      expect(input).toHaveValue('버섯');
    });

    it('should show clear button when input has value', async () => {
      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.type(input, '버섯');

      expect(screen.getByRole('button', { name: '검색어 지우기' })).toBeInTheDocument();
    });

    it('should clear input when clear button is clicked', async () => {
      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.type(input, '버섯');

      const clearButton = screen.getByRole('button', { name: '검색어 지우기' });
      await user.click(clearButton);

      expect(input).toHaveValue('');
    });

    it('should not show clear button when input is empty', () => {
      renderSearchBar();

      expect(screen.queryByRole('button', { name: '검색어 지우기' })).not.toBeInTheDocument();
    });
  });

  describe('dropdown behavior', () => {
    it('should show dropdown when input is focused with recent searches', async () => {
      // Dropdown only shows when there's query or recent searches
      localStorage.setItem('recentSearches', JSON.stringify(['버섯']));

      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.click(input);

      // Popular keywords should be visible
      expect(screen.getByText('인기 검색어')).toBeInTheDocument();
    });

    it('should show popular keywords when dropdown is open', async () => {
      localStorage.setItem('recentSearches', JSON.stringify(['테스트']));

      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.click(input);

      expect(screen.getByText('송이버섯')).toBeInTheDocument();
      expect(screen.getByText('능이버섯')).toBeInTheDocument();
      expect(screen.getByText('산양산삼')).toBeInTheDocument();
    });

    it('should navigate when popular keyword is clicked', async () => {
      localStorage.setItem('recentSearches', JSON.stringify(['테스트']));

      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.click(input);

      const keyword = screen.getByText('송이버섯');
      await user.click(keyword);

      expect(mockNavigate).toHaveBeenCalledWith(
        '/products?search=%EC%86%A1%EC%9D%B4%EB%B2%84%EC%84%AF'
      );
    });
  });

  describe('search submission', () => {
    it('should navigate to products page on form submit', async () => {
      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.type(input, '버섯{Enter}');

      expect(mockNavigate).toHaveBeenCalledWith('/products?search=%EB%B2%84%EC%84%AF');
    });

    it('should not submit with empty query', async () => {
      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.type(input, '{Enter}');

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should call onClose callback after search', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderSearchBar({ onClose });

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.type(input, '버섯{Enter}');

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('recent searches', () => {
    it('should save recent search to localStorage', async () => {
      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.type(input, '버섯{Enter}');

      const stored = localStorage.getItem('recentSearches');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toContain('버섯');
    });

    it('should show recent searches from localStorage', async () => {
      localStorage.setItem('recentSearches', JSON.stringify(['버섯', '산삼']));

      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.click(input);

      expect(screen.getByText('최근 검색어')).toBeInTheDocument();
      expect(screen.getByText('버섯')).toBeInTheDocument();
      expect(screen.getByText('산삼')).toBeInTheDocument();
    });

    it('should clear all recent searches when clear all button is clicked', async () => {
      localStorage.setItem('recentSearches', JSON.stringify(['버섯', '산삼']));

      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.click(input);

      const clearAllButton = screen.getByText('전체 삭제');
      await user.click(clearAllButton);

      expect(localStorage.getItem('recentSearches')).toBeNull();
    });
  });

  describe('product suggestions', () => {
    it('should show suggestions when typing', async () => {
      const user = userEvent.setup();
      renderSearchBar();

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.type(input, '버섯');

      // Wait for debounced suggestions
      await waitFor(
        () => {
          expect(screen.getByText('상품 추천')).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe('keyboard interaction', () => {
    it('should close dropdown on Escape key', async () => {
      localStorage.setItem('recentSearches', JSON.stringify(['테스트']));

      const user = userEvent.setup();
      const onClose = vi.fn();
      renderSearchBar({ onClose });

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      await user.click(input);

      // Verify dropdown is open
      expect(screen.getByText('인기 검색어')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('autoFocus', () => {
    it('should focus input when autoFocus is true', () => {
      renderSearchBar({ autoFocus: true });

      const input = screen.getByRole('textbox', { name: '상품 검색' });
      expect(document.activeElement).toBe(input);
    });
  });
});
