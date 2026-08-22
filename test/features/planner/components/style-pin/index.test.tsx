import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import {
  projectIdSchema,
  styleProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { StylePin } from '@/features/planner/components/style-pin';
import { renderInApp } from '../../../../render-in-app';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const STYLE_PROFILE_ID = styleProfileIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

describe('StylePin', () => {
  it('resolves the version a production is pinned to, by its own id', async () => {
    server.use(
      http.get(API_PATH.styleProfile(PROJECT_ID, STYLE_PROFILE_ID), () =>
        HttpResponse.json(
          buildStyleProfile({
            id: STYLE_PROFILE_ID,
            name: 'ליל ירח',
            version: 3,
          }),
        ),
      ),
    );

    renderInApp(
      <StylePin projectId={PROJECT_ID} styleProfileId={STYLE_PROFILE_ID} />,
    );

    const name = await screen.findByText('ליל ירח');

    expect(name.closest('bdi')).toHaveAttribute('dir', 'auto');
    expect(screen.getByText('Style version:')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('says the version did not resolve rather than showing nothing', async () => {
    server.use(
      http.get(API_PATH.styleProfile(PROJECT_ID, STYLE_PROFILE_ID), () =>
        HttpResponse.json(
          { statusCode: 404, message: 'No style profile' },
          { status: 404 },
        ),
      ),
    );

    renderInApp(
      <StylePin projectId={PROJECT_ID} styleProfileId={STYLE_PROFILE_ID} />,
    );

    expect(
      await screen.findByText(
        'This production names a style version the orchestrator did not return.',
      ),
    ).toBeInTheDocument();
  });
});
