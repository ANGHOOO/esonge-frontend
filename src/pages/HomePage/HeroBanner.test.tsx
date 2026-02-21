import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroBanner } from './HeroBanner';

const renderHeroBanner = () => {
  return render(
    <BrowserRouter>
      <HeroBanner />
    </BrowserRouter>
  );
};

describe('HeroBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('첫 번째 배너 이미지가 렌더링된다', () => {
    renderHeroBanner();

    const firstImage = screen.getByAltText('강원송이총판 배너 1');
    expect(firstImage).toBeInTheDocument();
    expect(firstImage).toHaveAttribute(
      'src',
      'https://esonge.cafe24.com/web/upload/mainbanner1.jpg'
    );
  });

  it('5개의 배너 이미지가 모두 렌더링된다', () => {
    renderHeroBanner();

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByAltText(`강원송이총판 배너 ${i}`)).toBeInTheDocument();
    }
  });

  it('5개의 점 네비게이션 버튼이 렌더링된다', () => {
    renderHeroBanner();

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('tab', { name: `배너 ${i}` })).toBeInTheDocument();
    }
  });

  it('점 네비게이션 클릭 시 해당 슬라이드로 이동한다', () => {
    renderHeroBanner();

    const thirdDot = screen.getByRole('tab', { name: '배너 3' });
    fireEvent.click(thirdDot);

    expect(thirdDot).toHaveAttribute('aria-selected', 'true');
  });

  it('3초 후 자동으로 다음 슬라이드로 이동한다', () => {
    renderHeroBanner();

    const firstDot = screen.getByRole('tab', { name: '배너 1' });
    const secondDot = screen.getByRole('tab', { name: '배너 2' });

    expect(firstDot).toHaveAttribute('aria-selected', 'true');
    expect(secondDot).toHaveAttribute('aria-selected', 'false');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(firstDot).toHaveAttribute('aria-selected', 'false');
    expect(secondDot).toHaveAttribute('aria-selected', 'true');
  });

  it('마지막 슬라이드에서 3초 후 첫 번째 슬라이드로 순환된다', () => {
    renderHeroBanner();

    act(() => {
      vi.advanceTimersByTime(3000 * 5); // 5번 전진 → 첫 번째로 돌아옴
    });

    const firstDot = screen.getByRole('tab', { name: '배너 1' });
    expect(firstDot).toHaveAttribute('aria-selected', 'true');
  });

  it('히어로 텍스트와 쇼핑 시작하기 버튼이 표시된다', () => {
    renderHeroBanner();

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('쇼핑 시작하기')).toBeInTheDocument();
  });

  it('메인 배너 섹션에 접근성 레이블이 있다', () => {
    renderHeroBanner();

    expect(screen.getByRole('region', { name: '메인 배너' })).toBeInTheDocument();
  });
});
