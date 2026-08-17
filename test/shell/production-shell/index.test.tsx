import { createRoutesStub } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProductionShell } from '@/shell/production-shell';

describe('ProductionShell', () => {
  it('renders the production nav and the outlet content together', () => {
    const Stub = createRoutesStub([
      {
        path: '/projects/:projectId/productions/:productionId',
        Component: ProductionShell,
        children: [{ index: true, Component: () => <p>storyboard content</p> }],
      },
    ]);

    render(<Stub initialEntries={['/projects/proj-1/productions/prod-1']} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('storyboard content')).toBeInTheDocument();
  });
});
