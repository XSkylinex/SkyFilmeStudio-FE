import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  productionProfileIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ProductionProfileList } from '@/features/productions/components/production-profile-list';
import { buildProductionProfile } from '../../../../fixtures/production-profile.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const server = mockOrchestratorServer();

const orchestratorServes = (
  items: readonly ReturnType<typeof buildProductionProfile>[],
  nextCursor?: string,
): void => {
  server.use(
    http.get(API_PATH.productionProfiles(PROJECT_ID), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
  );
};

describe('ProductionProfileList', () => {
  it('shows each profile’s target, tolerance, frame, audio and sections as figures', async () => {
    orchestratorServes([
      buildProductionProfile({
        sections: [
          {
            order: 0,
            label: 'Cold open',
            startSeconds: 0,
            endSeconds: 90,
            reusable: false,
          },
          {
            order: 1,
            label: 'Titles',
            startSeconds: 90,
            endSeconds: 120,
            reusable: true,
          },
        ],
      }),
    ]);

    renderInApp(<ProductionProfileList projectId={PROJECT_ID} />);

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: 'Twenty-minute episode',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('1920×1080 at 24 fps')).toBeInTheDocument();
    expect(screen.getByText('48000 Hz, 2 channels')).toBeInTheDocument();
    expect(screen.getByText('2 in all, 1 reusable')).toBeInTheDocument();
  });

  it('says so when a project has no structure profile, and still offers to add one', async () => {
    orchestratorServes([]);

    renderInApp(<ProductionProfileList projectId={PROJECT_ID} />);

    expect(
      await screen.findByText('No structure profile yet'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'New structure profile' }),
    ).toBeInTheDocument();
  });

  it('reveals the create form inline and keeps the control that opened it', async () => {
    const user = userEvent.setup();
    orchestratorServes([]);

    renderInApp(<ProductionProfileList projectId={PROJECT_ID} />);

    const open = await screen.findByRole('button', {
      name: 'New structure profile',
    });
    await user.click(open);

    expect(
      screen.getByRole('heading', { level: 3, name: 'New structure profile' }),
    ).toBeInTheDocument();
    expect(open).toHaveAttribute('aria-expanded', 'true');
  });

  it('says the list is truncated when the orchestrator offers another page', async () => {
    orchestratorServes(
      [
        buildProductionProfile({
          id: productionProfileIdSchema.parse(
            '55555555-5555-4555-8555-555555555555',
          ),
        }),
      ],
      'more',
    );

    renderInApp(<ProductionProfileList projectId={PROJECT_ID} />);

    expect(
      await screen.findByText(/first page of structure profiles only/),
    ).toBeInTheDocument();
  });
});
