import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { API_PATH } from '@/lib/api/api.constants';
import { SfxPage } from '@/features/sfx/SfxPage';
import { buildSfxAsset } from '../../fixtures/sfx-asset.fixture';
import { renderInApp } from '../../render-in-app';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const serves = (
  items: readonly ReturnType<typeof buildSfxAsset>[],
  nextCursor?: string,
): void => {
  server.use(
    http.get(API_PATH.sfxAssets(), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
  );
};

const renderPage = (): void => {
  renderInApp(
    <MemoryRouter>
      <SfxPage />
    </MemoryRouter>,
  );
};

describe('SfxPage', () => {
  it('says the library belongs to the installation rather than to a project', async () => {
    serves([]);

    renderPage();

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sound effects' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /belongs to this installation rather than to any one project/,
      ),
    ).toBeInTheDocument();
  });

  it('shows each effect with the provenance the library exists to keep', async () => {
    serves([buildSfxAsset()]);

    renderPage();

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Boots on gravel' }),
    ).toBeInTheDocument();
    expect(screen.getByText('FOOTSTEPS')).toBeInTheDocument();
    expect(screen.getByText('CC0')).toBeInTheDocument();
    expect(screen.getByText('Imported')).toBeInTheDocument();
  });

  it('offers the import form from an empty library rather than being a dead end', async () => {
    const user = userEvent.setup();
    serves([]);

    renderPage();

    expect(await screen.findByText('No effects yet')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Import a sound' }));

    expect(
      screen.getByRole('heading', { level: 3, name: 'Import a sound' }),
    ).toBeInTheDocument();
  });

  it('says the list is truncated when the orchestrator offers another page', async () => {
    serves([buildSfxAsset()], 'more');

    renderPage();

    expect(
      await screen.findByText(/first page of effects only/),
    ).toBeInTheDocument();
  });
});
