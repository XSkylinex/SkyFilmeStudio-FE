import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  artifactIdSchema,
  locationIdSchema,
  locationPlateIdSchema,
  projectIdSchema,
  sourceAssetIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PlateList } from '@/features/locations/components/plate-list';
import { buildLocationPlate } from '../../../../fixtures/location.fixture';
import { buildSourceAsset } from '../../../../fixtures/source-asset.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const LOCATION_ID = locationIdSchema.parse(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
);
const PLATE_ID = locationPlateIdSchema.parse(
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
);
const ASSET_ID = sourceAssetIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);
const ARTIFACT_ID = artifactIdSchema.parse(
  '55555555-5555-4555-8555-555555555555',
);

const server = mockOrchestratorServer(
  http.get(API_PATH.projectAssets(PROJECT_ID), () =>
    HttpResponse.json({ items: [buildSourceAsset({ id: ASSET_ID })] }),
  ),
);

const serves = (
  items: readonly ReturnType<typeof buildLocationPlate>[],
): void => {
  server.use(
    http.get(API_PATH.locationPlates(PROJECT_ID, LOCATION_ID), () =>
      HttpResponse.json({ items }),
    ),
  );
};

const render = (): void => {
  renderInApp(<PlateList projectId={PROJECT_ID} locationId={LOCATION_ID} />);
};

describe('PlateList', () => {
  it('says a location has no plates rather than showing nothing at all', async () => {
    serves([]);

    render();

    expect(
      await screen.findByText('This location has no plates yet.'),
    ).toBeInTheDocument();
  });

  it('says an artifact-anchored plate has no picture, and why', async () => {
    serves([
      buildLocationPlate({
        id: PLATE_ID,
        sourceAssetId: undefined,
        artifactId: ARTIFACT_ID,
      }),
    ]);

    render();

    expect(
      await screen.findByText(/no route serves an artifact’s bytes/),
    ).toBeInTheDocument();
  });

  it('renders no approval and no edit on an approved plate, so a reload cannot re-offer either', async () => {
    serves([
      buildLocationPlate({
        id: PLATE_ID,
        sourceAssetId: ASSET_ID,
        approved: true,
      }),
    ]);

    render();

    expect(
      await screen.findByText(/An approved plate is frozen/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Approve/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Edit/ })).toBeNull();
  });

  it('switches the anchor in a single request, setting the new and clearing the old', async () => {
    const user = userEvent.setup();
    serves([buildLocationPlate({ id: PLATE_ID, sourceAssetId: ASSET_ID })]);
    let patched: unknown;
    server.use(
      http.patch(
        API_PATH.locationPlate(PROJECT_ID, LOCATION_ID, PLATE_ID),
        async ({ request }) => {
          patched = await request.json();
          return HttpResponse.json(
            buildLocationPlate({
              id: PLATE_ID,
              sourceAssetId: undefined,
              artifactId: ARTIFACT_ID,
            }),
          );
        },
      ),
    );

    render();

    await user.click(await screen.findByRole('button', { name: /^Edit/ }));
    await user.selectOptions(screen.getByLabelText('Anchored to'), 'ARTIFACT');
    await user.type(screen.getByLabelText('Artifact id'), ARTIFACT_ID);
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(patched).toBeDefined();
    });
    expect(patched).toStrictEqual({
      artifactId: ARTIFACT_ID,
      sourceAssetId: null,
    });
  });

  it('creates a plate anchored to a source asset chosen by its path', async () => {
    const user = userEvent.setup();
    serves([]);
    let posted: unknown;
    server.use(
      http.post(
        API_PATH.locationPlates(PROJECT_ID, LOCATION_ID),
        async ({ request }) => {
          posted = await request.json();
          return HttpResponse.json(
            buildLocationPlate({ id: PLATE_ID, sourceAssetId: ASSET_ID }),
          );
        },
      ),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Add a plate' }),
    );
    await user.type(screen.getByLabelText('Kind'), 'WIDE_ESTABLISHING');
    await user.selectOptions(screen.getByLabelText('Source asset'), ASSET_ID);
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect(posted).toStrictEqual({
      kind: 'WIDE_ESTABLISHING',
      sourceAssetId: ASSET_ID,
    });
  });

  it('says an artifact id is typed rather than chosen, because nothing lists artifacts', async () => {
    const user = userEvent.setup();
    serves([]);

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Add a plate' }),
    );
    await user.selectOptions(screen.getByLabelText('Anchored to'), 'ARTIFACT');

    expect(
      screen.getByText(/nothing in the orchestrator lists artifacts/),
    ).toBeInTheDocument();
  });

  it('offers the four kinds the orchestrator suggests without closing the set', async () => {
    const user = userEvent.setup();
    serves([]);

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Add a plate' }),
    );

    expect(screen.getByText(/WIDE_ESTABLISHING/)).toBeInTheDocument();
    expect(screen.getByLabelText('Kind').tagName).toBe('INPUT');
  });
});
