import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PlanningStageList } from '@/features/planner/components/planning-stage-list';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const orchestratorServes = (stages: readonly string[]): void => {
  server.use(
    http.get(API_PATH.planningStages(PRODUCTION_ID), () =>
      HttpResponse.json(stages),
    ),
  );
};

describe('PlanningStageList', () => {
  it('shows a screenplay stage when the orchestrator asks for one', async () => {
    orchestratorServes(['LOGLINE', 'SCREENPLAY', 'RUNTIME_ESTIMATE']);

    renderInApp(<PlanningStageList productionId={PRODUCTION_ID} />);

    expect(
      await screen.findByText('Screenplay and dialogue'),
    ).toBeInTheDocument();
  });

  it('shows no screenplay stage when it is absent from the answer', async () => {
    orchestratorServes([
      'MUSIC_SECTIONS',
      'VISUAL_BEATS',
      'SCENE_OUTLINE',
      'RUNTIME_ESTIMATE',
    ]);

    renderInApp(<PlanningStageList productionId={PRODUCTION_ID} />);

    expect(await screen.findByText('Music sections')).toBeInTheDocument();
    expect(
      screen.queryByText('Screenplay and dialogue'),
    ).not.toBeInTheDocument();
  });

  it('renders the answer it was given rather than one derived here', async () => {
    orchestratorServes(['TONE_REVIEW']);

    renderInApp(<PlanningStageList productionId={PRODUCTION_ID} />);

    expect(
      await screen.findByText('Audience and tone review'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Timed scene outline')).not.toBeInTheDocument();
    expect(screen.queryByText('Runtime estimate')).not.toBeInTheDocument();
  });

  it('says the runtime estimate is already answered, and only that one', async () => {
    orchestratorServes(['BEAT_SHEET', 'RUNTIME_ESTIMATE']);

    renderInApp(<PlanningStageList productionId={PRODUCTION_ID} />);

    const answered = await screen.findAllByText('Answered by the budget above');

    expect(answered).toHaveLength(1);
  });

  it('says no stage on this screen can be run', async () => {
    orchestratorServes(['RUNTIME_ESTIMATE']);

    renderInApp(<PlanningStageList productionId={PRODUCTION_ID} />);

    expect(
      await screen.findByText(/publishes no route that runs a stage/),
    ).toBeInTheDocument();
  });
});
