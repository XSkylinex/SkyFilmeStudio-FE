import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectIdSchema,
  styleModeSchema,
  styleProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { StyleLineageCard } from '@/features/styles/components/style-lineage-card';
import { renderInApp } from '../../../../render-in-app';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const MODE = styleModeSchema.parse('TEST_MODE');

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const LINEAGE_ID = styleProfileIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

const renderCard = (): void => {
  renderInApp(
    <ul>
      <StyleLineageCard
        projectId={PROJECT_ID}
        lineageId={LINEAGE_ID}
        name="Nightfall"
      />
    </ul>,
  );
};

describe('StyleLineageCard', () => {
  it('offers editing on a draft version, in place beside its approve control', async () => {
    server.use(
      http.get(API_PATH.styleProfileVersions(PROJECT_ID), () =>
        HttpResponse.json([
          buildStyleProfile({
            id: LINEAGE_ID,
            lineageId: LINEAGE_ID,
            version: 1,
          }),
        ]),
      ),
    );

    renderCard();

    expect(
      await screen.findByRole('button', { name: /^Edit/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Create the next version/ }),
    ).not.toBeInTheDocument();
  });

  it('offers no edit control on an approved version, only the next version', async () => {
    server.use(
      http.get(API_PATH.styleProfileVersions(PROJECT_ID), () =>
        HttpResponse.json([
          buildStyleProfile({
            id: LINEAGE_ID,
            lineageId: LINEAGE_ID,
            version: 1,
            approved: true,
          }),
        ]),
      ),
    );

    renderCard();

    expect(await screen.findByText('Approved: v1')).toBeInTheDocument();
    expect(
      screen.getByText(/frozen/, { selector: '.style-lineage-card__frozen' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Edit/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Create the next version/ }),
    ).toBeInTheDocument();
  });

  it('POSTs the next version carrying lineageId, prefilled from the version it was opened from', async () => {
    const user = userEvent.setup();
    let created: Record<string, unknown> = {};

    server.use(
      http.get(API_PATH.styleProfileVersions(PROJECT_ID), () =>
        HttpResponse.json([
          buildStyleProfile({
            id: LINEAGE_ID,
            lineageId: LINEAGE_ID,
            version: 1,
            name: 'Nightfall',
            description: 'Cold key light.',
            mode: MODE,
            approved: true,
          }),
        ]),
      ),
      http.post(API_PATH.styleProfiles(PROJECT_ID), async ({ request }) => {
        created = (await request.json()) as Record<string, unknown>;

        return HttpResponse.json(
          buildStyleProfile({
            id: styleProfileIdSchema.parse(
              '33333333-3333-4333-8333-333333333333',
            ),
            lineageId: LINEAGE_ID,
            version: 2,
          }),
        );
      }),
    );

    renderCard();

    await user.click(
      await screen.findByRole('button', { name: /^Create the next version/ }),
    );

    expect(screen.getByText(/copied from this one/)).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Nightfall');

    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(created['lineageId']).toBe(LINEAGE_ID);
    });
    expect(created['name']).toBe('Nightfall');
    expect(created['description']).toBe('Cold key light.');
    expect(created['mode']).toBe('TEST_MODE');
  });
});
