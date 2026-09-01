import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import {
  artifactIdSchema,
  sceneIdSchema,
  shotIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ShotFrames } from '@/features/storyboard/components/shot-frames';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';
import { buildStoryboardFrame } from '../../../../fixtures/storyboard-frame.fixture';
import { buildShotKeyframeStatus } from '../../../../fixtures/shot-keyframe-status.fixture';

const SHOT_ID = shotIdSchema.parse('55555555-5555-4555-8555-555555555555');
const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const APPROVED_ARTIFACT = artifactIdSchema.parse(
  '88888888-8888-4888-8888-888888888888',
);

const server = mockOrchestratorServer();

const serve = (
  frames: ReturnType<typeof buildStoryboardFrame>[],
  status: ReturnType<typeof buildShotKeyframeStatus>,
): void => {
  server.use(
    http.get(API_PATH.shotStoryboardFrames(SHOT_ID), () =>
      HttpResponse.json(frames),
    ),
    http.get(API_PATH.shotKeyframeStatus(SHOT_ID), () =>
      HttpResponse.json(status),
    ),
  );
};

describe('ShotFrames', () => {
  it('offers no approval on a draft, because the orchestrator refuses one', async () => {
    serve(
      [buildStoryboardFrame({ level: 'DRAFT' })],
      buildShotKeyframeStatus(),
    );

    renderInApp(
      <ShotFrames shotId={SHOT_ID} sceneId={SCENE_ID} shotOrder={3} />,
    );

    expect(
      await screen.findByText(/A draft cannot be approved/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Approve/ })).toBeNull();
    expect(screen.getByRole('button', { name: /^Reject/ })).toBeInTheDocument();
  });

  it('names the shot and attempt in the approval control, not just "Approve"', async () => {
    serve([buildStoryboardFrame({ attempt: 2 })], buildShotKeyframeStatus());

    renderInApp(
      <ShotFrames shotId={SHOT_ID} sceneId={SCENE_ID} shotOrder={3} />,
    );

    expect(
      await screen.findByRole('button', {
        name: 'Approve the keyframe from attempt 2 of shot 3',
      }),
    ).toBeInTheDocument();
  });

  it('takes "already approved" from the server\'s own answer, not a client flag', async () => {
    serve(
      [buildStoryboardFrame()],
      buildShotKeyframeStatus({
        approvedKeyframeId: APPROVED_ARTIFACT,
        videoPermitted: true,
      }),
    );

    renderInApp(
      <ShotFrames shotId={SHOT_ID} sceneId={SCENE_ID} shotOrder={3} />,
    );

    expect(
      await screen.findByText('This frame is the approved keyframe.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Approve/ })).toBeNull();
  });

  it('says the picture is not shown rather than rendering a broken box', async () => {
    serve([buildStoryboardFrame()], buildShotKeyframeStatus());

    renderInApp(
      <ShotFrames shotId={SHOT_ID} sceneId={SCENE_ID} shotOrder={3} />,
    );

    expect(
      await screen.findByText(/The picture itself is not shown/),
    ).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });
});
