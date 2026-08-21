import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ERROR_CODE } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { CaptureGuidePanel } from '@/features/assets/components/capture-guide-panel';
import { renderInApp } from '../../../../render-in-app';
import { buildCaptureGuide } from '../../../../fixtures/capture-guide.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

let guideRequests = 0;

const orchestratorServesTheGuide = (): void => {
  guideRequests = 0;
  server.use(
    http.get(API_PATH.captureGuide(), () => {
      guideRequests += 1;
      return HttpResponse.json(buildCaptureGuide());
    }),
  );
};

describe('CaptureGuidePanel', () => {
  it('is closed until asked for, and does not fetch a guide nobody opened', () => {
    orchestratorServesTheGuide();

    renderInApp(<CaptureGuidePanel />);

    expect(screen.queryByText('Front')).not.toBeInTheDocument();
    expect(guideRequests).toBe(0);
  });

  it('says on its face that the views are advice rather than a checklist', () => {
    orchestratorServesTheGuide();

    renderInApp(<CaptureGuidePanel />);

    expect(
      screen.getByText(/every view below is optional/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/is not an error/i)).toBeInTheDocument();
  });

  it('shows the views and the advice once opened', async () => {
    orchestratorServesTheGuide();
    const user = userEvent.setup();

    renderInApp(<CaptureGuidePanel />);
    await user.click(
      screen.getByRole('button', { name: 'Show the capture guide' }),
    );

    expect(await screen.findByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Short 360-degree clip')).toBeInTheDocument();
    expect(screen.getByText('Diffuse, even lighting.')).toBeInTheDocument();
  });

  it('reports its open state to assistive technology, not only visually', async () => {
    orchestratorServesTheGuide();
    const user = userEvent.setup();

    renderInApp(<CaptureGuidePanel />);
    const toggle = screen.getByRole('button', {
      name: 'Show the capture guide',
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(
      screen.getByRole('button', { name: 'Hide the capture guide' }),
    ).toHaveAttribute('aria-expanded', 'true');
  });
  it('isolates the guide text, which the orchestrator wrote and we do not translate', async () => {
    orchestratorServesTheGuide();
    const user = userEvent.setup();

    renderInApp(<CaptureGuidePanel />);
    await user.click(
      screen.getByRole('button', { name: 'Show the capture guide' }),
    );

    const advice = await screen.findByText('Diffuse, even lighting.');

    expect(advice.tagName).toBe('BDI');
    expect(advice).toHaveAttribute('dir', 'auto');
  });

  it('names the code when the orchestrator refuses, rather than only the status', async () => {
    server.use(
      http.get(API_PATH.captureGuide(), () =>
        HttpResponse.json(
          {
            statusCode: 507,
            code: ERROR_CODE.DISK_SPACE_LOW,
            message: 'Only 2 GB free on the project volume.',
          },
          { status: 507 },
        ),
      ),
    );
    const user = userEvent.setup();

    renderInApp(<CaptureGuidePanel />);
    await user.click(
      screen.getByRole('button', { name: 'Show the capture guide' }),
    );

    const chip = await screen.findByText(ERROR_CODE.DISK_SPACE_LOW);

    expect(chip.tagName).toBe('CODE');
    expect(
      screen.getByText((content) =>
        content.includes(EN_CATALOGUE['error.DISK_SPACE_LOW']),
      ),
    ).toBeInTheDocument();
  });
});
