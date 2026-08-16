import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/lib/components/empty-state';

describe('EmptyState', () => {
  it('renders the title as a heading', () => {
    render(<EmptyState title="No shots yet" />);

    expect(
      screen.getByRole('heading', { name: 'No shots yet' }),
    ).toBeInTheDocument();
  });

  it('renders the description only when given', () => {
    const { container, rerender } = render(<EmptyState title="No shots yet" />);
    expect(
      container.querySelector('.empty-state__description'),
    ).not.toBeInTheDocument();

    rerender(
      <EmptyState
        title="No shots yet"
        description="Plan a scene to see its shots here"
      />,
    );
    expect(
      screen.getByText('Plan a scene to see its shots here'),
    ).toBeInTheDocument();
  });

  it('renders the action only when given', () => {
    const { container, rerender } = render(<EmptyState title="No shots yet" />);
    expect(
      container.querySelector('.empty-state__action'),
    ).not.toBeInTheDocument();

    rerender(
      <EmptyState
        title="No shots yet"
        action={<button type="button">Plan a scene</button>}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Plan a scene' }),
    ).toBeInTheDocument();
  });
});
