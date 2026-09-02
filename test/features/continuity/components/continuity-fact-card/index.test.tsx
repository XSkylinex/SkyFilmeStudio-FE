import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  productionIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { ContinuityFactCard } from '@/features/continuity/components/continuity-fact-card';
import { renderInApp } from '../../../../render-in-app';
import { buildContinuityFact } from '../../../../fixtures/continuity-fact.fixture';
import { buildScene } from '../../../../fixtures/scene.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);
const SCENE = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const FACT = buildContinuityFact({ scopeStartScene: SCENE });
const SCENES = [buildScene({ id: SCENE, order: 3 })];

const renderCard = (): void => {
  renderInApp(
    <ul>
      <ContinuityFactCard
        productionId={PRODUCTION_ID}
        fact={FACT}
        scenes={SCENES}
        onFilterByEntity={() => undefined}
        onRemoved={() => undefined}
      />
    </ul>,
  );
};

describe('ContinuityFactCard', () => {
  it('names the fact in both controls, so a list of them is not two identical buttons', () => {
    renderCard();

    expect(
      screen.getByRole('button', {
        name: 'Delete the fact that wardrobe.jacket-condition is torn at the left sleeve',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Only this entity, the one whose wardrobe.jacket-condition is torn at the left sleeve',
      }),
    ).toBeInTheDocument();
  });

  it('contains each visible label inside its own accessible name', () => {
    renderCard();

    for (const visible of ['Delete', 'Only this entity']) {
      const control = screen.getByText(visible);
      const name = control.getAttribute('aria-label') ?? '';

      expect(name).toContain(visible);
    }
  });

  it('shows the entity id as notation, since it is not a name in any language', () => {
    renderCard();

    const id = screen.getByText(FACT.entityId);

    expect(id).toHaveAttribute('dir', 'ltr');
  });

  it('keeps the fact on screen until the server confirms the delete', async () => {
    const user = userEvent.setup();
    let release = (): void => undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.delete(
        `*/productions/${PRODUCTION_ID}/continuity-facts/${FACT.id}`,
        async () => {
          await held;
          return new HttpResponse(null, { status: 204 });
        },
      ),
    );

    renderCard();

    await user.click(screen.getByRole('button', { name: /^Delete the fact/ }));

    expect(await screen.findByText('Deleting…')).toBeInTheDocument();
    expect(screen.getByText('torn at the left sleeve')).toBeInTheDocument();

    release();
  });
});
