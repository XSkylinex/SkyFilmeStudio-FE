import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import type { Production } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ProductionListPage } from '@/features/productions/ProductionListPage';
import { InterfaceLanguageSelect } from '@/shell/interface-language-select';
import { renderInApp } from '../../render-in-app';
import { buildProduction } from '../../fixtures/production.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderPage = (
  path: string = `/projects/${PROJECT_ID}/productions`,
): void => {
  renderInApp(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/projects/:projectId/productions"
          element={<ProductionListPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

const orchestratorHasProductions = (
  items: readonly Production[],
  nextCursor?: string,
): void => {
  server.use(
    http.get(API_PATH.productions(PROJECT_ID), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
  );
};

describe('ProductionListPage', () => {
  it('rejects a malformed project id rather than asking the orchestrator', () => {
    renderPage('/projects/not-a-uuid/productions');

    expect(
      screen.getByRole('heading', { name: 'That is not a project id' }),
    ).toBeInTheDocument();
  });

  it('lists every production the orchestrator returns', async () => {
    orchestratorHasProductions([buildProduction({ title: 'Pilot' })]);

    renderPage();

    expect(
      await screen.findByRole('link', { name: 'Open the plan for Pilot' }),
    ).toBeInTheDocument();
  });

  it('admits a production may be missing when the server offers a next cursor', async () => {
    orchestratorHasProductions([buildProduction()], 'opaque-cursor');

    renderPage();

    expect(
      await screen.findByText(
        'The orchestrator has more productions than this. Only the first page is read here.',
      ),
    ).toBeInTheDocument();
  });

  it('does not claim a page boundary the server did not report', async () => {
    orchestratorHasProductions([buildProduction()]);

    renderPage();

    await screen.findByRole('link', { name: /Open the plan for/ });
    expect(
      screen.queryByText(
        'The orchestrator has more productions than this. Only the first page is read here.',
      ),
    ).not.toBeInTheDocument();
  });

  it('offers to create the first production from the empty list', async () => {
    orchestratorHasProductions([]);

    renderPage();

    expect(await screen.findByText('No productions yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'New production' }),
    ).toBeInTheDocument();
  });

  it('reveals the create form inline rather than navigating away', async () => {
    const user = userEvent.setup();

    orchestratorHasProductions([]);
    server.use(
      http.get(API_PATH.styleProfiles(PROJECT_ID), () =>
        HttpResponse.json({ items: [] }),
      ),
      http.get(API_PATH.productionProfiles(PROJECT_ID), () =>
        HttpResponse.json({ items: [] }),
      ),
    );

    renderPage();

    await user.click(
      await screen.findByRole('button', { name: 'New production' }),
    );

    expect(
      screen.getByRole('heading', { name: 'New production', level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'New production' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Productions', level: 1 }),
    ).toBeInTheDocument();
  });

  it('reads in Hebrew once the interface is switched through the app’s own control, and still isolates a Hebrew title', async () => {
    const user = userEvent.setup();

    orchestratorHasProductions([buildProduction({ title: 'מסע הלילה' })]);

    renderInApp(
      <>
        <InterfaceLanguageSelect />
        <MemoryRouter initialEntries={[`/projects/${PROJECT_ID}/productions`]}>
          <Routes>
            <Route
              path="/projects/:projectId/productions"
              element={<ProductionListPage />}
            />
          </Routes>
        </MemoryRouter>
      </>,
    );

    await screen.findByRole('heading', { name: 'Productions', level: 1 });
    await user.selectOptions(screen.getByRole('combobox'), 'he');

    expect(
      await screen.findByRole('heading', { name: 'הפקות', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'ההפקות בפרויקט הזה', level: 2 }),
    ).toBeInTheDocument();

    const title = screen.getByText('מסע הלילה');
    expect(title.tagName).toBe('BDI');
    expect(title).toHaveAttribute('dir', 'auto');
  });
});
