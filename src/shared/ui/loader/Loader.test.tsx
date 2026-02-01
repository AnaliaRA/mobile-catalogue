import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

describe('Loader', () => {
  it('renders with default size', () => {
    render(<Loader />);
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
  });

  it('renders with data-testid', () => {
    render(<Loader />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('applies small size class', () => {
    const { container } = render(<Loader size="sm" />);
    expect(container.querySelector('.sm')).toBeInTheDocument();
  });

  it('applies medium size class', () => {
    const { container } = render(<Loader size="md" />);
    expect(container.querySelector('.md')).toBeInTheDocument();
  });

  it('applies large size class', () => {
    const { container } = render(<Loader size="lg" />);
    expect(container.querySelector('.lg')).toBeInTheDocument();
  });

  it('applies fullScreen class when fullScreen is true', () => {
    const { container } = render(<Loader fullScreen />);
    expect(container.querySelector('.fullScreen')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Loader className="custom-loader" />);
    expect(container.firstChild).toHaveClass('custom-loader');
  });
});
