import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { BiblePin } from '@/features/planner/components/bible-pin';
import { renderInApp } from '../../../../render-in-app';
import { buildProjectBible } from '../../../../fixtures/project-bible.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const renderPin = (): void => {
  renderInApp(<BiblePin productionId={PRODUCTION_ID} />);
};

describe('BiblePin', () => {
  it('names the version the production planned against, not the project current one', async () => {
    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/bible`, () =>
        HttpResponse.json(
          buildProjectBible({
            version: 2,
            published: true,
            publishedAt: '2026-08-30T09:00:00.000Z',
          }),
        ),
      ),
    );

    renderPin();

    expect(
      await screen.findByText(
        'Bible version this production planned against',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(
      screen.getByText(/Publishing a newer bible does not move a production/),
    ).toBeInTheDocument();
  });

  it('says a bible is unpublished rather than leaving the date blank', async () => {
    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/bible`, () =>
        HttpResponse.json(
          buildProjectBible({ published: false, publishedAt: undefined }),
        ),
      ),
    );

    renderPin();

    expect(await screen.findByText('Not published')).toBeInTheDocument();
  });

  it('keeps the two 404 causes together, because the orchestrator does not separate them', async () => {
    server.use(
      http.get(`*/productions/${PRODUCTION_ID}/bible`, () =>
        HttpResponse.json({ statusCode: 404, message: 'not pinned' }, { status: 404 }),
      ),
    );

    renderPin();

    expect(
      await screen.findByText(/not pinned to a bible version, or the version it names/),
    ).toBeInTheDocument();
  });
});
