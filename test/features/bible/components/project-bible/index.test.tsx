import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectBible } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ProjectBibleView } from '@/features/bible/components/project-bible';
import { buildProjectBible } from '../../../../fixtures/project-bible.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const orchestratorServes = (
  versions: readonly ProjectBible[],
  active: ProjectBible | undefined,
): void => {
  server.use(
    http.get(API_PATH.projectBibles(PROJECT_ID), () =>
      HttpResponse.json({ items: versions }),
    ),
    http.get(API_PATH.activeProjectBible(PROJECT_ID), () =>
      active === undefined
        ? HttpResponse.json(
            { statusCode: 404, message: 'no active bible' },
            { status: 404 },
          )
        : HttpResponse.json(active),
    ),
    http.get(`${API_PATH.projectBibles(PROJECT_ID)}/:id/markdown`, () =>
      HttpResponse.text('# Project bible', {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      }),
    ),
  );
};

describe('ProjectBibleView', () => {
  it('offers publishing on a draft', async () => {
    orchestratorServes([buildProjectBible({ published: false })], undefined);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(
      await screen.findByRole('button', { name: /^Publish version/ }),
    ).toBeInTheDocument();
  });

  it('renders no publish control at all for a version the server already published, so a reload cannot re-offer it', async () => {
    const published = buildProjectBible({
      published: true,
      publishedAt: '2026-08-22T00:00:00.000Z',
    });
    orchestratorServes([published], published);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(await screen.findByText('World rules')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Publish version/ }),
    ).not.toBeInTheDocument();
  });

  it('says the list is truncated when the orchestrator offers another page', async () => {
    server.use(
      http.get(API_PATH.projectBibles(PROJECT_ID), () =>
        HttpResponse.json({
          items: [buildProjectBible({})],
          nextCursor: 'more',
        }),
      ),
      http.get(API_PATH.activeProjectBible(PROJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 404, message: 'no active bible' },
          { status: 404 },
        ),
      ),
      http.get(`${API_PATH.projectBibles(PROJECT_ID)}/:id/markdown`, () =>
        HttpResponse.text('# Project bible', {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        }),
      ),
    );

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(
      await screen.findByText(
        'This reads the first page of versions only. The orchestrator holds more than are shown here.',
      ),
    ).toBeInTheDocument();
  });

  it('says the project has no bible rather than rendering empty sections', async () => {
    orchestratorServes([], undefined);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(
      await screen.findByText('This project has no bible yet'),
    ).toBeInTheDocument();
    expect(screen.queryByText('World rules')).not.toBeInTheDocument();
  });
});
