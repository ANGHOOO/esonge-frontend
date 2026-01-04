import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime } from './date';

describe('formatDate', () => {
  it('formats date in default format', () => {
    const date = new Date('2024-01-15T12:00:00');
    const formatted = formatDate(date);
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  it('formats ISO string dates', () => {
    const isoString = '2024-01-15T12:00:00';
    const formatted = formatDate(isoString);
    expect(formatted).toBeTruthy();
  });

  it('supports custom format strings', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date, 'yyyy-MM-dd');
    expect(formatted).toBe('2024-01-15');
  });
});

describe('formatRelativeTime', () => {
  it('formats recent dates as relative time', () => {
    const now = new Date();
    const formatted = formatRelativeTime(now);
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });
});
