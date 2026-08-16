import { render, screen } from '@testing-library/react';
import { ErrorState } from '@/lib/components/error-state';

describe('ErrorState', () => {
  it('renders the title as a heading', () => {
    render(<ErrorState title="Render failed" />);

    expect(
      screen.getByRole('heading', { name: 'Render failed' }),
    ).toBeInTheDocument();
  });

  it('keeps the technical detail separate from the human description', () => {
    render(
      <ErrorState
        title="Render failed"
        description="The GPU ran out of memory partway through this shot."
        detail="CUDA_OUT_OF_MEMORY"
      />,
    );

    const description = screen.getByText(
      'The GPU ran out of memory partway through this shot.',
    );
    const detail = screen.getByText('CUDA_OUT_OF_MEMORY');

    expect(description).not.toBe(detail);
    expect(detail).toHaveClass('error-state__detail');
    expect(description).not.toHaveClass('error-state__detail');
  });

  it('renders neither description nor detail when not given', () => {
    const { container } = render(<ErrorState title="Render failed" />);

    expect(
      container.querySelector('.error-state__description'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('.error-state__detail'),
    ).not.toBeInTheDocument();
  });

  it('does not use role="alert", since this renders as part of a page region', () => {
    const { container } = render(<ErrorState title="Render failed" />);

    expect(container.querySelector('.error-state')).not.toHaveAttribute(
      'role',
      'alert',
    );
  });

  it('renders the action only when given', () => {
    render(
      <ErrorState
        title="Render failed"
        action={<button type="button">Retry with the same seed</button>}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Retry with the same seed' }),
    ).toBeInTheDocument();
  });
});
