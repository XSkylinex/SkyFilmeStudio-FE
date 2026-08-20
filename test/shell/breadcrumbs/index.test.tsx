import type { FC } from 'react';
import { createRoutesStub } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from '@/shell/breadcrumbs';

const routeHandle = (title: string): { title: string } => ({ title });

const renderAt = (initialEntry: string): void => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: Breadcrumbs,
      children: [
        {
          path: 'projects/:projectId',
          handle: routeHandle('Project'),
          children: [
            {
              path: 'assets',
              handle: routeHandle('Assets'),
              Component: (() => null) as FC,
            },
          ],
        },
        {
          path: 'system',
          handle: routeHandle('System'),
          Component: (() => null) as FC,
        },
      ],
    },
  ]);

  render(<Stub initialEntries={[initialEntry]} />);
};

describe('Breadcrumbs', () => {
  it('is a labelled landmark, so it is not just another list of links', () => {
    renderAt('/projects/p1/assets');

    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeInTheDocument();
  });

  it('links every ancestor and leaves the current page as plain text', () => {
    renderAt('/projects/p1/assets');

    expect(screen.getByRole('link', { name: 'Project' })).toHaveAttribute(
      'href',
      '/projects/p1',
    );
    expect(
      screen.queryByRole('link', { name: 'Assets' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Assets')).toHaveAttribute('aria-current', 'page');
  });

  it('renders nothing at the root, rather than a trail of one', () => {
    const { container } = render(
      (() => {
        const Stub = createRoutesStub([
          { path: '/', Component: Breadcrumbs, children: [] },
        ]);

        return <Stub initialEntries={['/']} />;
      })(),
    );

    expect(container.querySelector('.breadcrumbs')).not.toBeInTheDocument();
  });
});
