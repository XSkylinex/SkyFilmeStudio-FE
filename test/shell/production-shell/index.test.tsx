import type { FC } from 'react';
import { createRoutesStub } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProductionShell } from '@/shell/production-shell';
import { ShellStateProvider } from '@/shell/shell-state';
import { useShellState } from '@/shell/shell-state/use-shell-state';

const ShellStateProbe: FC = () => {
  const { currentProjectId, currentProductionId } = useShellState();

  return (
    <p>
      project:{currentProjectId ?? 'none'} production:
      {currentProductionId ?? 'none'}
    </p>
  );
};

describe('ProductionShell', () => {
  it('publishes the route params into shell state so ancestor chrome can read them', () => {
    const Stub = createRoutesStub([
      {
        path: '/projects/:projectId/productions/:productionId',
        Component: ProductionShell,
        children: [{ index: true, Component: ShellStateProbe }],
      },
    ]);

    render(
      <ShellStateProvider>
        <Stub initialEntries={['/projects/proj-1/productions/prod-1']} />
      </ShellStateProvider>,
    );

    expect(
      screen.getByText('project:proj-1 production:prod-1'),
    ).toBeInTheDocument();
  });

  it('renders the production nav and the outlet content together', () => {
    const Stub = createRoutesStub([
      {
        path: '/projects/:projectId/productions/:productionId',
        Component: ProductionShell,
        children: [{ index: true, Component: () => <p>storyboard content</p> }],
      },
    ]);

    render(
      <ShellStateProvider>
        <Stub initialEntries={['/projects/proj-1/productions/prod-1']} />
      </ShellStateProvider>,
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('storyboard content')).toBeInTheDocument();
  });
});
