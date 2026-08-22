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
  lineageVersions?: readonly StyleProfile[],
): void => {
  server.use(
    http.get(API_PATH.styleProfiles(PROJECT_ID), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
    http.get(API_PATH.styleProfileVersions(PROJECT_ID), () =>
      HttpResponse.json(lineageVersions ?? items),
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

    expect(await screen.findByText('Versions: 2')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Nightfall' })).toHaveLength(
      1,
    );
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

  it('admits a lineage may be missing when the server offers a next cursor', async () => {
    orchestratorServes(
      [buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE })],
      'opaque-cursor',
    );

    renderPage();

    expect(
      await screen.findByText(/a lineage may be missing from this list/),
    ).toBeInTheDocument();
  });

  it('reads the whole lineage, so a version off the first page still counts', async () => {
    orchestratorServes(
      [buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE, version: 1 })],
      'opaque-cursor',
      [
        buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE, version: 1 }),
        buildStyleProfile({
          id: SECOND_VERSION,
          lineageId: LINEAGE,
          version: 2,
        }),
        buildStyleProfile({
          id: styleProfileIdSchema.parse(
            '44444444-4444-4444-8444-444444444444',
          ),
          lineageId: LINEAGE,
          version: 3,
          approved: true,
        }),
      ],
    );

    renderPage();

    expect(await screen.findByText('Approved: v3')).toBeInTheDocument();
    expect(screen.getByText('Versions: 3')).toBeInTheDocument();
    expect(screen.queryByText('No approved version')).not.toBeInTheDocument();
  });

  it('says the lineage is unknown rather than empty when its versions fail', async () => {
    server.use(
      http.get(API_PATH.styleProfiles(PROJECT_ID), () =>
        HttpResponse.json({
          items: [buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE })],
        }),
      ),
      http.get(API_PATH.styleProfileVersions(PROJECT_ID), () =>
        HttpResponse.json(null, { status: 503 }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText(/is unknown rather than none/),
    ).toBeInTheDocument();
    expect(screen.queryByText('No approved version')).not.toBeInTheDocument();
  });

  it('does not claim a page boundary the server did not report', async () => {
    orchestratorServes([
      buildStyleProfile({ id: LINEAGE, lineageId: LINEAGE }),
    ]);

    renderPage();

    await screen.findByRole('heading', { name: 'Nightfall', level: 3 });
    expect(
      screen.queryByText(/a lineage may be missing from this list/),
    ).not.toBeInTheDocument();
  });
});
