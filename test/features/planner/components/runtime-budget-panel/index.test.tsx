import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import type { RuntimeBudgetReport } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { RuntimeBudgetPanel } from '@/features/planner/components/runtime-budget-panel';
import { renderInApp } from '../../../../render-in-app';
import { buildRuntimeBudgetReport } from '../../../../fixtures/runtime-budget.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const orchestratorServes = (report: RuntimeBudgetReport): void => {
  server.use(
    http.get(API_PATH.planningBudget(PRODUCTION_ID), () =>
      HttpResponse.json(report),
    ),
  );
};

const orchestratorRefuses = (code: string, message: string): void => {
  server.use(
    http.get(API_PATH.planningBudget(PRODUCTION_ID), () =>
      HttpResponse.json({ statusCode: 409, code, message }, { status: 409 }),
    ),
  );
};

const ELEVEN_MINUTES_AGAINST_TWENTY = buildRuntimeBudgetReport({
  targetRuntimeSeconds: 1_200,
  segments: [
    { label: 'EXT. CANAL — DAWN', targetDurationSeconds: 200 },
    { label: 'INT. TRAM — CONTINUOUS', targetDurationSeconds: 40 },
    { label: 'EXT. MARKET — LATE AFTERNOON', targetDurationSeconds: 180 },
    { label: 'INT. DEPOT — NIGHT', targetDurationSeconds: 80 },
    { label: 'Recap', targetDurationSeconds: 45, reused: true },
  ],
  detail: 'A server-authored sentence about a plan that is short.',
});

describe('RuntimeBudgetPanel', () => {
  it('names the scenes the shortfall could come out of, not only the total', async () => {
    orchestratorServes(ELEVEN_MINUTES_AGAINST_TWENTY);

    renderInApp(<RuntimeBudgetPanel productionId={PRODUCTION_ID} />);

    const underweight = await screen.findByRole('heading', {
      name: 'Which scenes are underweight',
    });
    const list = underweight.parentElement?.querySelector('ul');

    expect(list?.textContent).toContain('INT. TRAM — CONTINUOUS');
    expect(list?.textContent).toContain('INT. DEPOT — NIGHT');
    expect(list?.textContent).not.toContain('EXT. CANAL — DAWN');
  });

  it('never counts reused material as an underweight scene', async () => {
    orchestratorServes(ELEVEN_MINUTES_AGAINST_TWENTY);

    renderInApp(<RuntimeBudgetPanel productionId={PRODUCTION_ID} />);

    const underweight = await screen.findByRole('heading', {
      name: 'Which scenes are underweight',
    });

    expect(
      underweight.parentElement?.querySelector('ul')?.textContent,
    ).not.toContain('Recap');
  });

  it('shows the shortfall as a clock rather than a raw second count', async () => {
    orchestratorServes(ELEVEN_MINUTES_AGAINST_TWENTY);

    renderInApp(<RuntimeBudgetPanel productionId={PRODUCTION_ID} />);

    expect(await screen.findByText('Missing:')).toBeInTheDocument();
    expect(screen.getByText('10:55')).toBeInTheDocument();
    expect(screen.queryByText('655')).not.toBeInTheDocument();
  });

  it('passes the orchestrator’s own sentence through untranslated', async () => {
    orchestratorServes(ELEVEN_MINUTES_AGAINST_TWENTY);

    renderInApp(<RuntimeBudgetPanel productionId={PRODUCTION_ID} />);

    expect(
      await screen.findByText(
        'A server-authored sentence about a plan that is short.',
      ),
    ).toBeInTheDocument();
  });

  it('names no scene at all when the plan adds up', async () => {
    orchestratorServes(
      buildRuntimeBudgetReport({
        targetRuntimeSeconds: 600,
        segments: [
          { label: 'Act one', targetDurationSeconds: 400 },
          { label: 'Act two', targetDurationSeconds: 200 },
        ],
      }),
    );

    renderInApp(<RuntimeBudgetPanel productionId={PRODUCTION_ID} />);

    expect(await screen.findByText('The plan adds up')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Which scenes are underweight' }),
    ).not.toBeInTheDocument();
  });

  it('says a plan with no tolerance cannot be judged, rather than reporting a failure', async () => {
    orchestratorRefuses(
      'RUNTIME_TOLERANCE_UNDECLARED',
      'Production x declares no runtime tolerance and is bound to no structure profile that declares one.',
    );

    renderInApp(<RuntimeBudgetPanel productionId={PRODUCTION_ID} />);

    expect(
      await screen.findByRole('heading', {
        name: 'Nothing here declares a tolerance',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: 'The runtime budget could not be read',
      }),
    ).not.toBeInTheDocument();
  });

  it('still reports an ordinary failure as a failure', async () => {
    orchestratorRefuses('PLANNING_STAGE_MISSING', 'No scenes.');

    renderInApp(<RuntimeBudgetPanel productionId={PRODUCTION_ID} />);

    expect(
      await screen.findByRole('heading', {
        name: 'The runtime budget could not be read',
      }),
    ).toBeInTheDocument();
  });

  it('says nothing about an average scene when the production has no scenes', async () => {
    orchestratorServes(
      buildRuntimeBudgetReport({
        targetRuntimeSeconds: 210,
        toleranceSeconds: 5,
        segments: [],
      }),
    );

    renderInApp(<RuntimeBudgetPanel productionId={PRODUCTION_ID} />);

    expect(
      await screen.findByText(
        'This production has no scenes and no reusable material, so there is nothing to total. The scene-outline stage is what creates them.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Which scenes are underweight' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('This plan\u2019s own average scene:'),
    ).not.toBeInTheDocument();
  });
});
