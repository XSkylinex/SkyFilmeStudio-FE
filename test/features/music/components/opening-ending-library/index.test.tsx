import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  openingEndingAssetIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { OpeningEndingLibrary } from '@/features/music/components/opening-ending-library';
import { buildOpeningEndingAsset } from '../../../../fixtures/opening-ending-asset.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const ASSET_ID = openingEndingAssetIdSchema.parse(
  '99999999-9999-4999-8999-999999999999',
);
const VERSION_TWO = openingEndingAssetIdSchema.parse(
  '22222222-2222-4222-8222-222222222222',
);

const server = mockOrchestratorServer();

const serves = (
  items: readonly ReturnType<typeof buildOpeningEndingAsset>[],
  nextCursor?: string,
): void => {
  server.use(
    http.get(API_PATH.openingEndingAssets(PROJECT_ID), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
  );
};

const render = (): void => {
  renderInApp(<OpeningEndingLibrary projectId={PROJECT_ID} />);
};

describe('OpeningEndingLibrary', () => {
  it('shows a lineage with its version count and which version is approved', async () => {
    serves([
      buildOpeningEndingAsset({ version: 1, approved: true }),
      buildOpeningEndingAsset({ id: VERSION_TWO, version: 2 }),
    ]);

    render();

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Series opening' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Versions: 2')).toBeInTheDocument();
    expect(screen.getByText('Approved: v1')).toBeInTheDocument();
  });

  it('says a lineage has no approved version rather than leaving it blank', async () => {
    serves([buildOpeningEndingAsset()]);

    render();

    expect(await screen.findByText('No approved version')).toBeInTheDocument();
  });

  it('offers the import form from an empty library, and lets a new file start a lineage', async () => {
    const user = userEvent.setup();
    serves([]);

    render();

    expect(
      await screen.findByText('No opening or ending yet'),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Import an opening or ending' }),
    );

    expect(screen.getByLabelText('New version of')).toHaveValue('');
    expect(
      screen.getByRole('option', { name: 'Start a new lineage' }),
    ).toBeInTheDocument();
  });

  it('offers an existing lineage to import the next version into', async () => {
    const user = userEvent.setup();
    serves([buildOpeningEndingAsset()]);

    render();

    await user.click(
      await screen.findByRole('button', {
        name: 'Import an opening or ending',
      }),
    );

    expect(
      screen.getByRole('option', { name: 'Series opening' }),
    ).toBeInTheDocument();
  });

  it('sends the lineage id when the import continues a lineage', async () => {
    const user = userEvent.setup();
    serves([buildOpeningEndingAsset()]);
    let posted: unknown;
    server.use(
      http.post(
        API_PATH.openingEndingAssets(PROJECT_ID),
        async ({ request }) => {
          posted = await request.json();
          return HttpResponse.json(buildOpeningEndingAsset({ version: 2 }));
        },
      ),
    );

    render();

    await user.click(
      await screen.findByRole('button', {
        name: 'Import an opening or ending',
      }),
    );
    await user.type(
      screen.getByLabelText('Path to the file'),
      '/titles/opening-v2.mp4',
    );
    await user.type(screen.getByLabelText('Name'), 'Series opening, revised');
    await user.type(screen.getByLabelText('Kind'), 'OPENING_VIDEO');
    await user.selectOptions(screen.getByLabelText('New version of'), ASSET_ID);
    await user.click(screen.getByRole('button', { name: 'Import' }));

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect(posted).toStrictEqual({
      sourcePath: '/titles/opening-v2.mp4',
      name: 'Series opening, revised',
      kind: 'OPENING_VIDEO',
      lineageId: ASSET_ID,
    });
  });

  it('omits the lineage id when the import starts a new one', async () => {
    const user = userEvent.setup();
    serves([]);
    let posted: unknown;
    server.use(
      http.post(
        API_PATH.openingEndingAssets(PROJECT_ID),
        async ({ request }) => {
          posted = await request.json();
          return HttpResponse.json(buildOpeningEndingAsset());
        },
      ),
    );

    render();

    await user.click(
      await screen.findByRole('button', {
        name: 'Import an opening or ending',
      }),
    );
    await user.type(
      screen.getByLabelText('Path to the file'),
      '/titles/ending.mp4',
    );
    await user.type(screen.getByLabelText('Name'), 'Series ending');
    await user.type(screen.getByLabelText('Kind'), 'ENDING_VIDEO');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect(posted).not.toHaveProperty('lineageId');
  });

  it('renders no approval on an approved version, and says why', async () => {
    serves([buildOpeningEndingAsset({ approved: true })]);

    render();

    expect(
      await screen.findByText(/import the next version into this lineage/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Approve/ })).toBeNull();
  });

  it('says a frame was not measured rather than showing a blank', async () => {
    serves([
      buildOpeningEndingAsset({
        width: undefined,
        height: undefined,
        fps: undefined,
      }),
    ]);

    render();

    expect((await screen.findAllByText('Not measured')).length).toBeGreaterThan(
      0,
    );
  });
});
