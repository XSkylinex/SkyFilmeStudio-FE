import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ProductionMix } from '@/features/audio/components/production-mix';
import { buildProductionMix } from '../../../../fixtures/mix.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const server = mockOrchestratorServer();

const serves = (
  mixes: readonly ReturnType<typeof buildProductionMix>[],
): void => {
  server.use(
    http.get(API_PATH.productionMixes(PRODUCTION_ID), () =>
      HttpResponse.json(mixes),
    ),
  );
};

const render = (): void => {
  renderInApp(<ProductionMix productionId={PRODUCTION_ID} />);
};

describe('ProductionMix', () => {
  it('shows loudness as measured numbers against the target, not as a tick', async () => {
    serves([buildProductionMix()]);

    render();

    expect(
      await screen.findByText('Loudness, measured against the target'),
    ).toBeInTheDocument();
    expect(screen.getByText('-21.4 LUFS, -0.8 dBTP')).toBeInTheDocument();
    expect(screen.getByText('-16 LUFS, -1.2 dBTP')).toBeInTheDocument();
    expect(screen.getByText('-16 LUFS, -1 dBTP')).toBeInTheDocument();
    expect(screen.getByText('7 LU')).toBeInTheDocument();
  });

  it('says why the corrected figure is the one an export is judged on', async () => {
    serves([buildProductionMix()]);

    render();

    expect(
      await screen.findByText(/measured values, not a tick/),
    ).toBeInTheDocument();
  });

  it('says every scene is mixed first when the production has no mix yet', async () => {
    serves([]);

    render();

    expect(
      await screen.findByText(/Every scene is mixed first/),
    ).toBeInTheDocument();
  });

  it('submits the mix and never awaits a file', async () => {
    const user = userEvent.setup();
    serves([]);
    let submitted = false;
    server.use(
      http.post(API_PATH.productionMixes(PRODUCTION_ID), () => {
        submitted = true;
        return HttpResponse.json(
          { renderJobId: '55555555-5555-4555-8555-555555555555' },
          { status: 202 },
        );
      }),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Mix this production' }),
    );

    await waitFor(() => {
      expect(submitted).toBe(true);
    });
  });

  it('shows the refusal when a scene has not been mixed yet', async () => {
    const user = userEvent.setup();
    serves([]);
    server.use(
      http.post(API_PATH.productionMixes(PRODUCTION_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'SCENE_MIX_MISSING',
            message: 'scenes 2 and 3 have no scene mix',
          },
          { status: 409 },
        ),
      ),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Mix this production' }),
    );

    expect(
      await screen.findByText('The production was not mixed'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/every scene has to be mixed first/),
    ).toBeInTheDocument();
  });
});
