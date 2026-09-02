import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  productionIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ContinuityFactList } from '@/features/continuity/components/continuity-fact-list';
import { SfxLibrary } from '@/features/sfx/components/sfx-library';
import { renderInApp } from '../render-in-app';
import { buildContinuityFact } from '../fixtures/continuity-fact.fixture';
import { buildScene } from '../fixtures/scene.fixture';
import { buildSfxAsset } from '../fixtures/sfx-asset.fixture';
import { mockOrchestratorServer } from '../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);
const SCENE = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const FACT = buildContinuityFact({ scopeStartScene: SCENE });
const ASSET = buildSfxAsset();

describe('deleting the last row in a list', () => {
  it('announces the removal and lands focus on it, rather than dropping to the body', async () => {
    const user = userEvent.setup();
    let gone = false;

    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/planning/scenes`, () =>
        HttpResponse.json([buildScene({ id: SCENE, order: 1 })]),
      ),
      http.get(`*/productions/${PRODUCTION_ID}/continuity-facts`, () =>
        HttpResponse.json({ items: gone ? [] : [FACT] }),
      ),
      http.delete(
        `*/productions/${PRODUCTION_ID}/continuity-facts/${FACT.id}`,
        () => {
          gone = true;
          return new HttpResponse(null, { status: 204 });
        },
      ),
    );

    renderInApp(<ContinuityFactList productionId={PRODUCTION_ID} />);

    await user.click(
      await screen.findByRole('button', { name: /^Delete the fact/ }),
    );

    const notice = await screen.findByText(
      /The fact about wardrobe.jacket-condition was deleted/,
    );

    expect(notice).toHaveFocus();
    expect(document.activeElement).not.toBe(document.body);
  });

  it('does the same on a library whose rows are a different shape', async () => {
    const user = userEvent.setup();
    let gone = false;

    server.use(
      http.get(API_PATH.sfxAssets(), () =>
        HttpResponse.json({ items: gone ? [] : [ASSET] }),
      ),
      http.delete(API_PATH.sfxAsset(ASSET.id), () => {
        gone = true;
        return HttpResponse.json(ASSET);
      }),
    );

    renderInApp(<SfxLibrary />);

    const remove = await screen.findAllByRole('button', {
      name: /Remove|Delete/,
    });
    await user.click(remove[0] as HTMLElement);

    await waitFor(() =>
      expect(screen.queryByText(ASSET.name)).not.toBeInTheDocument(),
    );

    expect(document.activeElement).not.toBe(document.body);
  });
});
