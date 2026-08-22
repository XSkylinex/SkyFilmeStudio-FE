import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  projectIdSchema,
  styleProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { StyleProfile } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { StylesPage } from '@/features/styles/StylesPage';
import { renderInApp } from '../../render-in-app';
import { buildStyleProfile } from '../../fixtures/style-profile.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const LINEAGE = styleProfileIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);
const SECOND_VERSION = styleProfileIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const renderPage = (): void => {
  renderInApp(
    <MemoryRouter initialEntries={[`/projects/${PROJECT_ID}/styles`]}>
      <Routes>
        <Route path="/projects/:projectId/styles" element={<StylesPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

const orchestratorServes = (
  items: readonly StyleProfile[],
  nextCursor?: string,
): void => {
  server.use(
    http.get(API_PATH.styleProfiles(PROJECT_ID), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
  );
};

describe('StylesPage', () => {
  it('gathers every version of one lineage under a single heading', async () => {
    orchestratorServes([
      buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE, version: 1 }),
      buildStyleProfile({
        id: SECOND_VERSION,
        lineageId: LINEAGE,
        version: 2,
      }),
    ]);

    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'Nightfall', level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Nightfall' })).toHaveLength(
      1,
    );
    expect(screen.getByText('2 versions')).toBeInTheDocument();
  });

  it('names the approved version rather than only marking one', async () => {
    orchestratorServes([
      buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE, version: 1 }),
      buildStyleProfile({
        id: SECOND_VERSION,
        lineageId: LINEAGE,
        version: 2,
        approved: true,
      }),
    ]);

    renderPage();

    expect(await screen.findByText('Approved: v2')).toBeInTheDocument();
  });

  it('says so when no version of a lineage is approved', async () => {
    orchestratorServes([
      buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE }),
    ]);

    renderPage();

    expect(await screen.findByText('No approved version')).toBeInTheDocument();
  });

  it('gives each approve control the version it would approve', async () => {
    orchestratorServes([
      buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE, version: 1 }),
      buildStyleProfile({
        id: SECOND_VERSION,
        lineageId: LINEAGE,
        version: 2,
      }),
    ]);

    renderPage();

    expect(
      await screen.findByRole('button', {
        name: 'Approve version 1 of Nightfall',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Approve version 2 of Nightfall' }),
    ).toBeInTheDocument();
  });

  it('offers no approve control on a version already approved', async () => {
    orchestratorServes([
      buildStyleProfile({
        id: LINEAGE,
        lineageId: LINEAGE,
        version: 1,
        approved: true,
      }),
    ]);

    renderPage();

    expect(await screen.findByText('Approved: v1')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Approve/ }),
    ).not.toBeInTheDocument();
  });

  it('admits it is showing one page when the server offers a next cursor', async () => {
    orchestratorServes(
      [buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE })],
      'opaque-cursor',
    );

    renderPage();

    expect(
      await screen.findByText(/reads the first page only/),
    ).toBeInTheDocument();
  });

  it('does not claim a page boundary the server did not report', async () => {
    orchestratorServes([
      buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE }),
    ]);

    renderPage();

    await screen.findByRole('heading', { name: 'Nightfall', level: 3 });
    expect(
      screen.queryByText(/reads the first page only/),
    ).not.toBeInTheDocument();
  });
});
