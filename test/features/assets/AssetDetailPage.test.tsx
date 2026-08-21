import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  projectIdSchema,
  sourceAssetIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { AssetDetailPage } from '@/features/assets/AssetDetailPage';
import { renderInApp } from '../../render-in-app';
import { buildSourceAsset } from '../../fixtures/source-asset.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const ASSET_ID = sourceAssetIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

const renderAt = (path: string): void => {
  renderInApp(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/projects/:projectId/assets/:assetId"
          element={<AssetDetailPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('AssetDetailPage', () => {
  it('shows the checksum, which is how a user identifies the exact file', async () => {
    const asset = buildSourceAsset();
    server.use(
      http.get(API_PATH.projectAsset(PROJECT_ID, ASSET_ID), () =>
        HttpResponse.json(asset),
      ),
    );

    renderAt(`/projects/${PROJECT_ID}/assets/${ASSET_ID}`);

    expect(await screen.findByText(asset.sha256)).toBeInTheDocument();
    expect(screen.getByText(asset.path)).toBeInTheDocument();
  });

  it('names what it cannot show, rather than rendering an empty section', async () => {
    server.use(
      http.get(API_PATH.projectAsset(PROJECT_ID, ASSET_ID), () =>
        HttpResponse.json(buildSourceAsset()),
      ),
    );

    renderAt(`/projects/${PROJECT_ID}/assets/${ASSET_ID}`);

    expect(
      await screen.findByRole('heading', { name: 'Derived assets' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Subjects that reference this' }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/missing endpoint, not an empty result/i),
    ).toHaveLength(2);
  });

  it('says an exportable asset may leave the machine, because that is what the field means', async () => {
    server.use(
      http.get(API_PATH.projectAsset(PROJECT_ID, ASSET_ID), () =>
        HttpResponse.json(buildSourceAsset({ privacyClass: 'EXPORTABLE' })),
      ),
    );

    renderAt(`/projects/${PROJECT_ID}/assets/${ASSET_ID}`);

    expect(
      await screen.findByText(/may leave this machine in a delivery/i),
    ).toBeInTheDocument();
  });

  it('refuses an asset id the orchestrator would reject, without asking it', () => {
    renderAt(`/projects/${PROJECT_ID}/assets/not-a-uuid`);

    expect(
      screen.getByRole('heading', { name: 'That is not an asset id' }),
    ).toBeInTheDocument();
  });

  it('refuses a project id the orchestrator would reject, without asking it', () => {
    renderAt(`/projects/not-a-uuid/assets/${ASSET_ID}`);

    expect(
      screen.getByRole('heading', { name: 'That is not a project id' }),
    ).toBeInTheDocument();
  });
});
