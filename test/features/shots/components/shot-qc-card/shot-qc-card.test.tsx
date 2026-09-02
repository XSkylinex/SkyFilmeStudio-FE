import { http, HttpResponse } from 'msw';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sceneIdSchema } from 'sky-filme-studio-be/contracts';
import type { ShotState } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ShotQcCard } from '@/features/shots/components/shot-qc-card';
import { buildQcRun } from '../../../../fixtures/qc-run.fixture';
import { buildShot } from '../../../../fixtures/shot.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';
import { renderInApp } from '../../../../render-in-app';

const server = mockOrchestratorServer(
  http.get('/sfx-assets', () => HttpResponse.json({ items: [] })),
  http.get('/shots/:shotId/audio-cues', () => HttpResponse.json([])),
);

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

  it('keeps the automated verdict advisory when read aloud: kind before verdict, and never the word a human decision uses', async () => {
    const user = userEvent.setup();
    const shot = buildShot({ state: 'APPROVED' });
    server.use(
      http.get(API_PATH.shotQcRuns(shot.id), () =>
        HttpResponse.json([buildQcRun({ outcome: 'PASS' })]),
      ),
    );

    renderCard('APPROVED');
    await user.click(
      screen.getByRole('button', { name: 'Automated checks for shot 0' }),
    );
    await screen.findByText(/none of them is an approval/);

    const section = screen
      .getByRole('heading', { level: 4, name: 'Automated checks' })
      .closest('section');
    expect(section).not.toBeNull();
    const read = section?.textContent ?? '';

    const heading = read.indexOf('Automated checks');
    const advisory = read.indexOf('none of them is an approval');
    const kind = read.indexOf('Technical');
    const verdict = read.indexOf('Pass');
    expect(heading).toBeGreaterThanOrEqual(0);
    expect(advisory).toBeGreaterThan(heading);
    expect(kind).toBeGreaterThan(advisory);
    expect(verdict).toBeGreaterThan(kind);

    expect(within(section as HTMLElement).queryByText('Approved')).toBeNull();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('never announces a hand-over the refetched shot does not carry', () => {
    renderCard('VIDEO_READY');

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
