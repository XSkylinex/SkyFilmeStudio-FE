import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sfxAssetIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { SfxAssetCard } from '@/features/sfx/components/sfx-asset-card';
import { buildSfxAsset } from '../../../../fixtures/sfx-asset.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const ASSET_ID = sfxAssetIdSchema.parse('77777777-7777-4777-8777-777777777777');

const server = mockOrchestratorServer(
  http.get(API_PATH.sfxAssets(), () => HttpResponse.json({ items: [] })),
);

const renderCard = (
  asset: ReturnType<typeof buildSfxAsset> = buildSfxAsset(),
): void => {
  renderInApp(
    <ul>
      <SfxAssetCard asset={asset}   onRemoved={() => undefined}
      />
    </ul>,
  );
};

describe('SfxAssetCard', () => {
  it('offers approval on a draft, named for the effect it would approve', () => {
    renderCard();

    expect(
      screen.getByRole('button', {
        name: 'Approve the effect Boots on gravel',
      }),
    ).toBeInTheDocument();
  });

  it('renders no approval on an approved effect at all, so a reload cannot re-offer it', () => {
    renderCard(buildSfxAsset({ approved: true }));

    expect(screen.queryByRole('button', { name: /^Approve/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Remove/ })).toBeNull();
    expect(
      screen.getByText(/An approved effect is frozen/),
    ).toBeInTheDocument();
  });

  it('does not treat the effect as approved before the server answers', async () => {
    const user = userEvent.setup();
    let release: () => void = () => undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      http.post(API_PATH.approveSfxAsset(ASSET_ID), async () => {
        await held;
        return HttpResponse.json(buildSfxAsset({ approved: true }));
      }),
    );

    renderCard();

    await user.click(
      screen.getByRole('button', {
        name: 'Approve the effect Boots on gravel',
      }),
    );

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.queryByText(/An approved effect is frozen/)).toBeNull();

    release();
  });

  it('says an approval was refused rather than showing it as done', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(API_PATH.approveSfxAsset(ASSET_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'SFX_ASSET_IMMUTABLE',
            message: 'frozen',
          },
          { status: 409 },
        ),
      ),
    );

    renderCard();

    await user.click(
      screen.getByRole('button', {
        name: 'Approve the effect Boots on gravel',
      }),
    );

    expect(
      await screen.findByText('The effect was not approved'),
    ).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('removes a draft effect, named for the effect it would remove', async () => {
    const user = userEvent.setup();
    let deleted = false;
    server.use(
      http.delete(API_PATH.sfxAsset(ASSET_ID), () => {
        deleted = true;
        return HttpResponse.json(buildSfxAsset());
      }),
    );

    renderCard();

    await user.click(
      screen.getByRole('button', { name: 'Remove the effect Boots on gravel' }),
    );

    await waitFor(() => {
      expect(deleted).toBe(true);
    });
  });

  it('says an effect has no measured duration rather than showing a zero', () => {
    const { durationMs: _omitted, ...withoutDuration } = buildSfxAsset();

    renderCard(buildSfxAsset({ ...withoutDuration, durationMs: undefined }));

    expect(screen.getAllByText('Not measured').length).toBeGreaterThan(0);
  });

  it('says a licence is absent rather than leaving the row blank', () => {
    renderCard(
      buildSfxAsset({ origin: 'LOCALLY_GENERATED', licence: undefined }),
    );

    expect(
      screen.getByText(/only for a sound this installation made itself/),
    ).toBeInTheDocument();
  });
});
