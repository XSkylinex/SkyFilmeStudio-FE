import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  productionIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { CreateContinuityFactForm } from '@/features/continuity/components/create-continuity-fact-form';
import { renderInApp } from '../../../../render-in-app';
import { buildContinuityFact } from '../../../../fixtures/continuity-fact.fixture';
import { buildScene } from '../../../../fixtures/scene.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);
const SCENE_ONE = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const SCENE_TWO = sceneIdSchema.parse('55555555-5555-4555-8555-555555555555');
const ENTITY_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

const SCENES = [
  buildScene({ id: SCENE_ONE, order: 3 }),
  buildScene({ id: SCENE_TWO, order: 7 }),
];

const renderForm = (): void => {
  renderInApp(
    <CreateContinuityFactForm
      productionId={PRODUCTION_ID}
      scenes={SCENES}
      onClose={() => undefined}
    />,
  );
};

const recordRequests = (): unknown[] => {
  const sent: unknown[] = [];

  server.use(
    http.post(
      `*/productions/${PRODUCTION_ID}/continuity-facts`,
      async ({ request }) => {
        sent.push(await request.json());
        return HttpResponse.json(buildContinuityFact());
      },
    ),
  );

  return sent;
};

const fillRequiredFields = async (
  user: ReturnType<typeof userEvent.setup>,
): Promise<void> => {
  await user.type(screen.getByLabelText('Entity id'), ENTITY_ID);
  await user.type(screen.getByLabelText('Property'), 'wardrobe.jacket');
  await user.type(screen.getByLabelText('Value'), 'torn');
  await user.type(screen.getByLabelText('Recorded from'), 'the market chase');
  await user.selectOptions(
    screen.getByLabelText('Holds from scene'),
    SCENE_ONE,
  );
};

describe('CreateContinuityFactForm', () => {
  it('omits the end scene entirely for an open-ended fact', async () => {
    const user = userEvent.setup();
    const sent = recordRequests();

    renderForm();
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Record this fact' }));

    expect(await screen.findByText('Created.')).toBeInTheDocument();
    expect(sent).toStrictEqual([
      {
        entityId: ENTITY_ID,
        property: 'wardrobe.jacket',
        value: 'torn',
        sourceEvent: 'the market chase',
        scopeStartScene: SCENE_ONE,
      },
    ]);
  });

  it('sends the end scene when the fact stops holding', async () => {
    const user = userEvent.setup();
    const sent = recordRequests();

    renderForm();
    await fillRequiredFields(user);
    await user.selectOptions(
      screen.getByLabelText('Holds to scene'),
      SCENE_TWO,
    );
    await user.click(screen.getByRole('button', { name: 'Record this fact' }));

    expect(await screen.findByText('Created.')).toBeInTheDocument();
    expect(sent).toStrictEqual([
      {
        entityId: ENTITY_ID,
        property: 'wardrobe.jacket',
        value: 'torn',
        sourceEvent: 'the market chase',
        scopeStartScene: SCENE_ONE,
        scopeEndScene: SCENE_TWO,
      },
    ]);
  });

  it('refuses an entity id that is not one, and never reaches the orchestrator', async () => {
    const user = userEvent.setup();
    const sent = recordRequests();

    renderForm();
    await user.type(screen.getByLabelText('Entity id'), 'not-a-uuid');
    await user.type(screen.getByLabelText('Property'), 'wardrobe.jacket');
    await user.type(screen.getByLabelText('Value'), 'torn');
    await user.type(screen.getByLabelText('Recorded from'), 'the market chase');
    await user.selectOptions(
      screen.getByLabelText('Holds from scene'),
      SCENE_ONE,
    );
    await user.click(screen.getByRole('button', { name: 'Record this fact' }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(sent).toStrictEqual([]);
  });
});
