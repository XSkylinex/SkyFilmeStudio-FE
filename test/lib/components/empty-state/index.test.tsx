import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import { EmptyState } from '@/lib/components/empty-state';

describe('EmptyState', () => {
  it('renders the title as a heading', () => {
    renderInStore(<EmptyState title="No shots yet" />);

    expect(
      screen.getByRole('heading', { name: 'No shots yet' }),
    ).toBeInTheDocument();
  });

  it('defaults to a level-2 heading, so it slots under a page title', () => {
    renderInStore(<EmptyState title="No shots yet" />);

    expect(
      screen.getByRole('heading', { name: 'No shots yet', level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders at the heading level the caller chose, so it can sit under a panel heading', () => {
    renderInStore(<EmptyState title="No shots yet" headingLevel={3} />);

    expect(
      screen.getByRole('heading', { name: 'No shots yet', level: 3 }),
    ).toBeInTheDocument();
  });

  it('renders the description only when given', () => {
    const { container, rerender } = renderInStore(
      <EmptyState title="No shots yet" />,
    );
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
    const { container, rerender } = renderInStore(
      <EmptyState title="No shots yet" />,
    );
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
