import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  projectIdSchema,
  sourceAssetIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { AssetLibrary } from '@/features/assets/components/asset-library';
import { renderInApp } from '../../../../render-in-app';
import { buildSourceAsset } from '../../../../fixtures/source-asset.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const renderLibrary = (): void => {
  renderInApp(
    <MemoryRouter>
      <AssetLibrary projectId={PROJECT_ID} />
    </MemoryRouter>,
  );
};

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const orchestratorLists = (items: unknown[]): void => {
  server.use(
    http.get(API_PATH.projectAssets(PROJECT_ID), () =>
      HttpResponse.json({ items }),
    ),
  );
};

describe('AssetLibrary', () => {
  it('shows a thumbnail served by the orchestrator, never the original file', async () => {
    const asset = buildSourceAsset();
    orchestratorLists([asset]);

    renderLibrary();

    const image = await screen.findByRole('img', {
      name: `Thumbnail of ${asset.path}`,
    });
    expect(image).toHaveAttribute(
      'src',
      `/projects/${PROJECT_ID}/assets/${asset.id}/thumbnail`,
    );
    expect(image.getAttribute('src')).not.toContain(asset.path);
  });

  it('asks for no thumbnail for an asset type that cannot have one', async () => {
    orchestratorLists([
      buildSourceAsset({ type: 'AUDIO', mimeType: 'audio/wav' }),
    ]);

    renderLibrary();

    expect(await screen.findByText('Audio')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('marks an exportable asset apart from a project-private one', async () => {
    orchestratorLists([
      buildSourceAsset({ privacyClass: 'EXPORTABLE' }),
      buildSourceAsset({
        id: sourceAssetIdSchema.parse('22222222-2222-4222-8222-222222222222'),
        privacyClass: 'PROJECT_PRIVATE',
      }),
    ]);

    renderLibrary();

    expect(await screen.findByText('Exportable')).toBeInTheDocument();
    expect(screen.getByText('Project private')).toBeInTheDocument();
  });

  it('says there are none rather than rendering an empty grid', async () => {
    orchestratorLists([]);

    renderLibrary();

    expect(
      await screen.findByRole('heading', { name: 'No source assets yet' }),
    ).toBeInTheDocument();
  });

  it('offers no import control, because nothing here can import one yet', async () => {
    orchestratorLists([]);

    renderLibrary();

    await screen.findByRole('heading', { name: 'No source assets yet' });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('says the list could not be read when the orchestrator does not answer', async () => {
    server.use(
      http.get(API_PATH.projectAssets(PROJECT_ID), () => HttpResponse.error()),
    );

    renderLibrary();

    expect(
      await screen.findByRole('heading', {
        name: 'The asset list could not be read',
      }),
    ).toBeInTheDocument();
  });
});
