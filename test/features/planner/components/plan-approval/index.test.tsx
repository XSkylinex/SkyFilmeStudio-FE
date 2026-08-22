import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import type { Production } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PlanApproval } from '@/features/planner/components/plan-approval';
import { renderInApp } from '../../../../render-in-app';
import { buildProduction } from '../../../../fixtures/production.fixture';
import { buildRuntimeBudgetReport } from '../../../../fixtures/runtime-budget.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const ADDS_UP = buildRuntimeBudgetReport({
  targetRuntimeSeconds: 600,
  segments: [{ label: 'Act one', targetDurationSeconds: 600 }],
});

const IS_SHORT = buildRuntimeBudgetReport({
  targetRuntimeSeconds: 1_200,
  segments: [{ label: 'Act one', targetDurationSeconds: 200 }],
});

const budgetIs = (report: typeof ADDS_UP): void => {
  server.use(
    http.get(API_PATH.planningBudget(PRODUCTION_ID), () =>
      HttpResponse.json(report),
    ),
  );
};

const APPROVE_BUTTON = 'Approve the plan for Pilot';

const render = (production: Production): void => {
  renderInApp(<PlanApproval production={production} />);
};

describe('PlanApproval', () => {
  it('offers the approval when the orchestrator’s own report says the plan adds up', async () => {
    budgetIs(ADDS_UP);

    render(buildProduction({ id: PRODUCTION_ID }));

    expect(
      await screen.findByRole('button', { name: APPROVE_BUTTON }),
    ).toBeInTheDocument();
  });

  it('offers no approval while the plan is short, and says why', async () => {
    budgetIs(IS_SHORT);

    render(buildProduction({ id: PRODUCTION_ID }));

    expect(
      await screen.findByRole('heading', {
        name: 'Approval is refused while the plan does not add up',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: APPROVE_BUTTON }),
    ).not.toBeInTheDocument();
  });

  it('offers no approval from a state that is not the planning gate', async () => {
    budgetIs(ADDS_UP);

    render(buildProduction({ id: PRODUCTION_ID, state: 'STORYBOARDING' }));

    expect(
      await screen.findByRole('heading', {
        name: 'This production is not at the planning gate',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: APPROVE_BUTTON }),
    ).not.toBeInTheDocument();
  });

  it('waits for the server before anything changes, and re-reads what it said', async () => {
    const user = userEvent.setup();
    let approvals = 0;

    budgetIs(ADDS_UP);
    server.use(
      http.post(API_PATH.planningApproval(PRODUCTION_ID), () => {
        approvals += 1;

        return HttpResponse.json(
          buildProduction({ id: PRODUCTION_ID, state: 'STORYBOARDING' }),
        );
      }),
    );

    render(buildProduction({ id: PRODUCTION_ID }));

    await user.click(
      await screen.findByRole('button', { name: APPROVE_BUTTON }),
    );

    await waitFor(() => {
      expect(approvals).toBe(1);
    });
    expect(
      screen.queryByRole('heading', { name: 'The plan was not approved' }),
    ).not.toBeInTheDocument();
  });

  it('shows the orchestrator’s refusal rather than swallowing it', async () => {
    const user = userEvent.setup();

    budgetIs(ADDS_UP);
    server.use(
      http.post(API_PATH.planningApproval(PRODUCTION_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'PLANNING_STAGE_MISSING',
            message: 'Production x has no scenes.',
          },
          { status: 409 },
        ),
      ),
    );

    render(buildProduction({ id: PRODUCTION_ID }));

    await user.click(
      await screen.findByRole('button', { name: APPROVE_BUTTON }),
    );

    expect(
      await screen.findByRole('heading', { name: 'The plan was not approved' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/has no scenes/)).toBeInTheDocument();
  });
});
