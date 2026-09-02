import { http, HttpResponse } from 'msw';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  productionIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { ContinuityPage } from '@/features/continuity/ContinuityPage';
import { renderInApp } from '../../render-in-app';
import { buildContinuityFact } from '../../fixtures/continuity-fact.fixture';
import { buildScene } from '../../fixtures/scene.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);
const SCENE_ONE = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const SCENE_TWO = sceneIdSchema.parse('55555555-5555-4555-8555-555555555555');

const SCENES = [
  buildScene({ id: SCENE_ONE, order: 5, slugline: 'INT. WORKSHOP — DAY' }),
  buildScene({ id: SCENE_TWO, order: 9 }),
];

const renderPage = (): void => {
  renderInApp(
    <MemoryRouter
      initialEntries={[`/productions/${PRODUCTION_ID}/continuity`]}
    >
      <Routes>
        <Route
          path="/productions/:productionId/continuity"
          element={<ContinuityPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ContinuityPage', () => {
  beforeEach(() => {
    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/planning/scenes`, () =>
        HttpResponse.json(SCENES),
      ),
    );
  });

  it('reads a fact as the range of scenes it holds for, not as two ids', async () => {
    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/continuity-facts`, () =>
        HttpResponse.json({
          items: [
            buildContinuityFact({
              scopeStartScene: SCENE_ONE,
              scopeEndScene: SCENE_TWO,
            }),
          ],
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText('Scenes 5 to 9')).toBeInTheDocument();
    expect(
      screen.getByText('wardrobe.jacket-condition'),
    ).toBeInTheDocument();
  });

  it('reads an open-ended fact as holding from its scene onward', async () => {
    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/continuity-facts`, () =>
        HttpResponse.json({
          items: [
            buildContinuityFact({
              scopeStartScene: SCENE_ONE,
              scopeEndScene: undefined,
            }),
          ],
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText('Scene 5 onward')).toBeInTheDocument();
  });

  it('narrows to one entity by sending the filter to the orchestrator', async () => {
    const user = userEvent.setup();
    const requested: string[] = [];

    server.use(
      http.get(
        `*/productions/${PRODUCTION_ID}/continuity-facts`,
        ({ request }) => {
          const url = new URL(request.url);
          requested.push(url.searchParams.get('entityId') ?? '');
          return HttpResponse.json({
            items: [buildContinuityFact({ scopeStartScene: SCENE_ONE })],
          });
        },
      ),
    );

    renderPage();

    await user.click(
      await screen.findByRole('button', {
        name: /Show only the facts about the entity/,
      }),
    );

    expect(await screen.findByText(/Showing one entity only/)).toBeInTheDocument();
    expect(requested).toContain('cccccccc-cccc-4ccc-8ccc-cccccccccccc');
  });

  it('says the list is the first page when the orchestrator offers a cursor', async () => {
    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/continuity-facts`, () =>
        HttpResponse.json({
          items: [buildContinuityFact({ scopeStartScene: SCENE_ONE })],
          nextCursor: 'next-page',
        }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText(/This is the first page of facts/),
    ).toBeInTheDocument();
  });

  it('reads the planning context for the scene a person chooses', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/continuity-facts`, () =>
        HttpResponse.json({ items: [] }),
      ),
      http.get(`*/productions/${PRODUCTION_ID}/planning-context`, () =>
        HttpResponse.text('## Scene 5\n- הדמות מגיעה רטובה', {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        }),
      ),
    );

    renderPage();

    await user.selectOptions(
      await screen.findByLabelText('Scene'),
      SCENE_ONE,
    );

    const document = await screen.findByRole('region', {
      name: 'The context a scene was planned from',
    });

    expect(document).toHaveAttribute('dir', 'auto');
    expect(within(document).getByText(/הדמות מגיעה רטובה/)).toBeInTheDocument();
  });

  it('asks for the chosen scene rather than the first one', async () => {
    const user = userEvent.setup();
    const asked: string[] = [];

    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/continuity-facts`, () =>
        HttpResponse.json({ items: [] }),
      ),
      http.get(
        `*/productions/${PRODUCTION_ID}/planning-context`,
        ({ request }) => {
          asked.push(new URL(request.url).searchParams.get('scene') ?? '');
          return HttpResponse.text('## Scene 9', {
            headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
          });
        },
      ),
    );

    renderPage();

    await user.selectOptions(
      await screen.findByLabelText('Scene'),
      SCENE_TWO,
    );

    expect(await screen.findByText('## Scene 9')).toBeInTheDocument();
    expect(asked).toStrictEqual([SCENE_TWO]);
  });
});
