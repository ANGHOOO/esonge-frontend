import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber } from './currency';

describe('formatCurrency', () => {
  it('formats Korean won correctly', () => {
    expect(formatCurrency(10000)).toBe('₩10,000');
    expect(formatCurrency(1234567)).toBe('₩1,234,567');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('₩0');
  });

  it('supports different currencies', () => {
    expect(formatCurrency(1000, 'USD')).toContain('1,000');
  });
});

describe('formatNumber', () => {
  it('formats numbers with comma separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});
