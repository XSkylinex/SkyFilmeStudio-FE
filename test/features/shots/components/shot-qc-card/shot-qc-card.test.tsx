import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sceneIdSchema } from 'sky-filme-studio-be/contracts';
import type { ShotState } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ShotQcCard } from '@/features/shots/components/shot-qc-card';
import { buildQcRun } from '../../../../fixtures/qc-run.fixture';
import { buildShot } from '../../../../fixtures/shot.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';
import { renderInApp } from '../../../../render-in-app';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const renderCard = (state: ShotState) =>
  renderInApp(
    <ul>
      <ShotQcCard shot={buildShot({ state })} sceneId={SCENE_ID} />
    </ul>,
  );

describe('ShotQcCard', () => {
  it.each(['VIDEO_READY', 'AUTO_QC'] as const)(
    'offers the hand-over from %s, the states the orchestrator moves to review from',
    (state) => {
      renderCard(state);

      expect(
        screen.getByRole('button', { name: 'Send to review for shot 0' }),
      ).toBeInTheDocument();
    },
  );

  it.each(['PLANNED', 'MANUAL_REVIEW', 'APPROVED', 'REJECTED'] as const)(
    'offers no hand-over from %s, because the server would refuse it',
    (state) => {
      renderCard(state);

      expect(
        screen.queryByRole('button', { name: /Send to review/ }),
      ).not.toBeInTheDocument();
      expect(screen.getByText(/Review is offered once/)).toBeInTheDocument();
    },
  );

  it('shows a passing automated run as advisory, never in the tone a human approval wears', async () => {
    const user = userEvent.setup();
    const shot = buildShot({ state: 'AUTO_QC' });
    server.use(
      http.get(API_PATH.shotQcRuns(shot.id), () =>
        HttpResponse.json([buildQcRun({ outcome: 'PASS' })]),
      ),
    );

    renderCard('AUTO_QC');
    await user.click(
      screen.getByRole('button', { name: 'Automated checks for shot 0' }),
    );

    expect(
      await screen.findByText(/none of them is an approval/),
    ).toBeInTheDocument();
    expect(screen.getByText('Technical')).toBeInTheDocument();
    const badges = screen.getAllByText('Pass');
    expect(badges.length).toBeGreaterThan(0);
    for (const badge of badges) {
      expect(badge.closest('[data-tone]')).not.toHaveAttribute(
        'data-tone',
        'success',
      );
    }
  });

  it('never announces a hand-over the refetched shot does not carry', () => {
    renderCard('VIDEO_READY');

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
