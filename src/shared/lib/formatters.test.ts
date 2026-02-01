import { formatPrice } from './formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('should format a price in EUR currency without decimals when .00', () => {
      const result = formatPrice(1329);
      expect(result).toMatch(/1\.?329/);
      expect(result).toContain('EUR');
      expect(result).not.toMatch(/,00/); // No decimals for whole numbers
    });

    it('should format decimal prices with decimals', () => {
      const result = formatPrice(99.99);
      expect(result).toMatch(/99[,.]99/);
      expect(result).toContain('EUR');
    });

    it('should handle zero', () => {
      const result = formatPrice(0);
      expect(result).toBe('0 EUR');
    });
  });
});
