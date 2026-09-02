import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  audioCueIdSchema,
  sfxAssetIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { AudioCue } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ShotAudioCues } from '@/features/shots/components/shot-audio-cues';
import { buildSfxAsset } from '../../../../fixtures/sfx-asset.fixture';
import { buildShot } from '../../../../fixtures/shot.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const shot = buildShot();
const ASSET_ID = sfxAssetIdSchema.parse('77777777-7777-4777-8777-777777777777');

const placed: AudioCue = {
  id: audioCueIdSchema.parse('aaaaaaaa-9999-4aaa-8aaa-aaaaaaaaaaaa'),
  shotId: shot.id,
  sfxAssetId: ASSET_ID,
  stemKind: 'FX',
  order: 0,
  atMs: 1_000,
  durationMs: 2_400,
  gainDb: -6,
  fadeInMs: 100,
  fadeOutMs: 200,
};

const server = mockOrchestratorServer(
  http.get(API_PATH.sfxAssets(), () =>
    HttpResponse.json({ items: [buildSfxAsset({ id: ASSET_ID })] }),
  ),
);

const serves = (cues: readonly AudioCue[]): void => {
  server.use(
    http.get(API_PATH.shotAudioCues(shot.id), () => HttpResponse.json(cues)),
  );
};

const capturePut = (): { body: () => unknown } => {
  let captured: unknown;
  server.use(
    http.put(API_PATH.shotAudioCues(shot.id), async ({ request }) => {
      captured = await request.json();
      return HttpResponse.json([]);
    }),
  );

  return { body: () => captured };
};

const render = (): void => {
  renderInApp(<ShotAudioCues shot={shot} />);
};

describe('ShotAudioCues', () => {
  it('says nothing is placed rather than showing an empty editor', async () => {
    serves([]);

    render();

    expect(
      await screen.findByText('Nothing is placed on this shot.'),
    ).toBeInTheDocument();
  });

  it('says the whole list is sent, because the route replaces rather than adds', async () => {
    serves([]);

    render();

    expect(
      await screen.findByText(/replaces a shot’s cues rather than adding/),
    ).toBeInTheDocument();
  });

  it('cannot be saved until something changes, so an untouched shot sends nothing', async () => {
    serves([placed]);

    render();

    expect(
      await screen.findByRole('button', {
        name: 'Save the effects on this shot',
      }),
    ).toBeDisabled();
  });

  it('sends every cue with its position as the order', async () => {
    const user = userEvent.setup();
    serves([placed]);
    const put = capturePut();

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Add an effect' }),
    );
    await user.selectOptions(
      screen.getAllByLabelText('Effect')[1] as HTMLElement,
      ASSET_ID,
    );
    await user.type(
      screen.getAllByLabelText(/Starts at/)[1] as HTMLElement,
      '5000',
    );
    await user.type(
      screen.getAllByLabelText(/Duration in/)[1] as HTMLElement,
      '1000',
    );
    await user.type(
      screen.getAllByLabelText(/Gain in/)[1] as HTMLElement,
      '-3',
    );
    await user.type(screen.getAllByLabelText(/Fade in/)[1] as HTMLElement, '0');
    await user.type(
      screen.getAllByLabelText(/Fade out/)[1] as HTMLElement,
      '0',
    );
    await user.click(
      screen.getByRole('button', { name: 'Save the effects on this shot' }),
    );

    await waitFor(() => {
      expect(put.body()).toBeDefined();
    });
    expect(put.body()).toStrictEqual({
      cues: [
        {
          sfxAssetId: ASSET_ID,
          stemKind: 'FX',
          order: 0,
          atMs: 1_000,
          durationMs: 2_400,
          gainDb: -6,
          fadeInMs: 100,
          fadeOutMs: 200,
        },
        {
          sfxAssetId: ASSET_ID,
          stemKind: 'FX',
          order: 1,
          atMs: 5_000,
          durationMs: 1_000,
          gainDb: -3,
          fadeInMs: 0,
          fadeOutMs: 0,
        },
      ],
    });
  });

  it('sends an empty list when the last cue is removed, which is how a shot is cleared', async () => {
    const user = userEvent.setup();
    serves([placed]);
    const put = capturePut();

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Remove effect 1' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Save the effects on this shot' }),
    );

    await waitFor(() => {
      expect(put.body()).toBeDefined();
    });
    expect(put.body()).toStrictEqual({ cues: [] });
  });

  it('refuses two fades that overlap, against the second fade', async () => {
    const user = userEvent.setup();
    serves([placed]);
    const put = capturePut();

    render();

    const fadeOut = await screen.findByLabelText(/Fade out/);
    await user.clear(fadeOut);
    await user.type(fadeOut, '3000');
    await user.click(
      screen.getByRole('button', { name: 'Save the effects on this shot' }),
    );

    expect(
      await screen.findByText(/Fields needing attention/),
    ).toBeInTheDocument();
    expect(fadeOut).toBeInvalid();
    expect(put.body()).toBeUndefined();
  });
});
