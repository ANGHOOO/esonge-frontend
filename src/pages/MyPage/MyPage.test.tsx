import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
import { MyPage } from './MyPage';
import { useAuth, useCart, useWishlist } from '@/stores';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderMyPage = () => {
  return render(
    <BrowserRouter>
      <MyPage />
    </BrowserRouter>
  );
};

describe('MyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.getState().logout();
    useCart.getState().clearCart();
    useWishlist.getState().clearWishlist();
  });

  describe('not logged in state', () => {
    it('should show login required message when not authenticated', () => {
      renderMyPage();

      expect(screen.getByText('로그인이 필요합니다')).toBeInTheDocument();
      expect(screen.getByText('마이페이지를 이용하시려면 로그인해주세요.')).toBeInTheDocument();
    });

    it('should render login button', () => {
      renderMyPage();

      expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    });

    it('should render register button', () => {
      renderMyPage();

      expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
    });

    it('should navigate to login page when login button clicked', async () => {
      const user = userEvent.setup();
      renderMyPage();

      const loginButton = screen.getByRole('button', { name: '로그인' });
      await user.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should navigate to register page when register button clicked', async () => {
      const user = userEvent.setup();
      renderMyPage();

      const registerButton = screen.getByRole('button', { name: '회원가입' });
      await user.click(registerButton);

      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });

  describe('logged in state', () => {
    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should render page title', () => {
      renderMyPage();

      expect(screen.getByRole('heading', { name: '마이페이지' })).toBeInTheDocument();
    });

    it('should render user profile section', () => {
      renderMyPage();

      expect(screen.getByText('내 정보')).toBeInTheDocument();
      // Default state shows profile info as text, not form inputs
      expect(screen.getByText('홍길동')).toBeInTheDocument();
      expect(screen.getByText('demo@esonge.com')).toBeInTheDocument();
    });

    it('should render quick stats section', () => {
      renderMyPage();

      expect(screen.getByText('장바구니')).toBeInTheDocument();
      expect(screen.getByText('찜 목록')).toBeInTheDocument();
      expect(screen.getByText('주문내역')).toBeInTheDocument();
    });

    it('should show cart and wishlist counts', () => {
      renderMyPage();

      // Both cart and wishlist start at 0, so we'll see "0개" twice
      const zeroCountElements = screen.getAllByText('0개');
      expect(zeroCountElements.length).toBeGreaterThanOrEqual(2);
    });

    it('should render address section', () => {
      renderMyPage();

      expect(screen.getByText('배송지 관리')).toBeInTheDocument();
      expect(screen.getByText('기본 배송지')).toBeInTheDocument();
    });

    it('should render default address when available', () => {
      renderMyPage();

      expect(screen.getByText('집')).toBeInTheDocument();
      expect(screen.getByText(/강원특별자치도 춘천시/)).toBeInTheDocument();
    });

    it('should render menu section with settings and logout', () => {
      renderMyPage();

      expect(screen.getByText('설정')).toBeInTheDocument();
      expect(screen.getByText('로그아웃')).toBeInTheDocument();
    });
  });

  describe('profile editing', () => {
    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should show edit form when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderMyPage();

      const editButton = screen.getByText('수정');
      await user.click(editButton);

      // Form inputs are shown after clicking edit
      expect(screen.getByDisplayValue('홍길동')).toBeInTheDocument();
      expect(screen.getByDisplayValue('010-1234-5678')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    });

    it('should cancel editing when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderMyPage();

      const editButton = screen.getByText('수정');
      await user.click(editButton);

      const cancelButton = screen.getByRole('button', { name: '취소' });
      await user.click(cancelButton);

      // Should show profile info as text again (not form)
      expect(screen.getByText('홍길동')).toBeInTheDocument();
      // Edit button should be visible again
      expect(screen.getByText('수정')).toBeInTheDocument();
    });

    it('should update profile when form is submitted', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');
      renderMyPage();

      const editButton = screen.getByText('수정');
      await user.click(editButton);

      // Find name input by its value
      const nameInput = screen.getByDisplayValue('홍길동');
      await user.clear(nameInput);
      await user.type(nameInput, '김철수');

      const saveButton = screen.getByRole('button', { name: '저장' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('프로필이 수정되었습니다.');
      });

      expect(screen.getByText('김철수')).toBeInTheDocument();
    });

    it('should show email as disabled', async () => {
      const user = userEvent.setup();
      renderMyPage();

      const editButton = screen.getByText('수정');
      await user.click(editButton);

      // Find email input by its value
      const emailInput = screen.getByDisplayValue('demo@esonge.com');
      expect(emailInput).toBeDisabled();
      expect(screen.getByText('이메일은 변경할 수 없습니다.')).toBeInTheDocument();
    });
  });

  describe('logout', () => {
    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should logout when logout button is clicked', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');
      renderMyPage();

      const logoutButton = screen.getByText('로그아웃');
      await user.click(logoutButton);

      expect(toast.success).toHaveBeenCalledWith('로그아웃 되었습니다.');
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(useAuth.getState().isAuthenticated).toBe(false);
    });
  });

  describe('integration with cart and wishlist', () => {
    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should display cart count from store', () => {
      act(() => {
        useCart.getState().addItem(
          {
            id: 'test',
            name: 'Test',
            price: 1000,
            images: [],
            category: 'test',
            categoryName: 'Test',
            origin: '국내산',
            grade: '상',
            freeShipping: false,
            stock: 10,
            createdAt: '2024-01-01',
            salesCount: 0,
            rating: 4,
            reviewCount: 0,
          },
          3
        );
      });

      renderMyPage();

      expect(screen.getByText('3개')).toBeInTheDocument();
    });

    it('should display wishlist count from store', () => {
      act(() => {
        useWishlist.getState().addItem('product-1');
        useWishlist.getState().addItem('product-2');
      });

      renderMyPage();

      expect(screen.getByText('2개')).toBeInTheDocument();
    });
  });
});
