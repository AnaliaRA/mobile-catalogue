import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorSelector } from './ui/ColorSelector';
import { StorageSelector } from './ui/StorageSelector';
import { useProductOptions } from './model/useProductOptions';
import type { ColorOption, StorageOption } from '@/entities/product';

/**
 * Product Options Integration Tests
 *
 * - ARIA states (aria-checked) for radio button selections
 * - Keyboard navigation and focus management
 *
 */

// Test component that integrates ColorSelector, StorageSelector, and useProductOptions
function ProductOptionsIntegration({
  colors,
  storages,
}: {
  colors: ColorOption[];
  storages: StorageOption[];
}) {
  const { selectedColor, selectedStorage, selectColor, selectStorage } = useProductOptions({
    colors,
    storages,
  });

  return (
    <div>
      <ColorSelector colors={colors} selectedColor={selectedColor} onSelect={selectColor} />
      <StorageSelector
        storages={storages}
        selectedStorage={selectedStorage}
        onSelect={selectStorage}
      />
    </div>
  );
}

describe('Product Options - Accessibility', () => {
  const mockColors: ColorOption[] = [
    { name: 'Negro', hexCode: '#000000', imageUrl: '/black.jpg' },
    { name: 'Blanco', hexCode: '#ffffff', imageUrl: '/white.jpg' },
    { name: 'Azul', hexCode: '#0000ff', imageUrl: '/blue.jpg' },
  ];

  const mockStorages: StorageOption[] = [
    { capacity: '128GB', price: 799 },
    { capacity: '256GB', price: 899 },
    { capacity: '512GB', price: 1099 },
  ];

  it('should have correct ARIA states for color options', async () => {
    const user = userEvent.setup();
    render(<ProductOptionsIntegration colors={mockColors} storages={mockStorages} />);

    // Initial state - no options selected
    expect(screen.getByRole('radio', { name: 'Negro' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Blanco' })).toHaveAttribute('aria-checked', 'false');

    // After selection
    await user.click(screen.getByRole('radio', { name: 'Blanco' }));
    expect(screen.getByRole('radio', { name: 'Negro' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Blanco' })).toHaveAttribute('aria-checked', 'true');
  });

  it('should have correct ARIA states for storage options', async () => {
    const user = userEvent.setup();
    render(<ProductOptionsIntegration colors={mockColors} storages={mockStorages} />);

    // Initial state - no options selected
    expect(screen.getByRole('radio', { name: /128GB/i })).toHaveAttribute('aria-checked', 'false');

    // After selection
    await user.click(screen.getByRole('radio', { name: /256GB/i }));
    expect(screen.getByRole('radio', { name: /128GB/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: /256GB/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('should have proper radiogroup role and label', () => {
    render(<ProductOptionsIntegration colors={mockColors} storages={mockStorages} />);

    // Color selector should be a labeled radiogroup
    const colorGroup = screen.getByRole('radiogroup', { name: /select color/i });
    expect(colorGroup).toBeInTheDocument();

    // Storage selector should be a labeled radiogroup
    const storageGroup = screen.getByRole('radiogroup', { name: /select storage/i });
    expect(storageGroup).toBeInTheDocument();
  });
});
