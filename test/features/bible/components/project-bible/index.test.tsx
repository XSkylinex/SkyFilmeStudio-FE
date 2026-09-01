import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectBibleVersionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { ProjectBible, ProjectKind } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ProjectBibleView } from '@/features/bible/components/project-bible';
import { buildProject } from '../../../../fixtures/project.fixture';
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
  projectKind: ProjectKind = 'STANDALONE',
): void => {
  server.use(
    http.get(API_PATH.project(PROJECT_ID), () =>
      HttpResponse.json(buildProject({ projectKind })),
    ),
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

describe('ProjectBibleView writes', () => {
  it('offers a way to start the first bible instead of a dead end', async () => {
    orchestratorServes([], undefined);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(
      await screen.findByRole('button', { name: 'Start a draft' }),
    ).toBeInTheDocument();
  });

  it('calls it the next version once one exists, since a POST always creates a new one', async () => {
    const published = buildProjectBible({
      published: true,
      publishedAt: '2026-08-22T00:00:00.000Z',
    });
    orchestratorServes([published], published);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(
      await screen.findByRole('button', { name: 'Start the next version' }),
    ).toBeInTheDocument();
  });

  it('offers Edit on a draft', async () => {
    orchestratorServes([buildProjectBible({ published: false })], undefined);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(
      await screen.findByRole('button', { name: /^Edit this draft/ }),
    ).toBeInTheDocument();
  });

  it('renders no Edit control for a published version and says why, from the record rather than a flag', async () => {
    const published = buildProjectBible({
      published: true,
      publishedAt: '2026-08-22T00:00:00.000Z',
    });
    orchestratorServes([published], published);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(
      await screen.findByText(/published, so it can no longer be edited/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Edit this draft/ }),
    ).not.toBeInTheDocument();
  });

  it('keeps the trigger mounted while its dialog is open, so closing returns focus somewhere', async () => {
    orchestratorServes([buildProjectBible({ published: false })], undefined);
    server.use(
      http.get(API_PATH.styleProfiles(PROJECT_ID), () =>
        HttpResponse.json({ items: [] }),
      ),
    );

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    const trigger = await screen.findByRole('button', {
      name: 'Start the next version',
    });
    await userEvent.click(trigger);

    expect(trigger).toBeInTheDocument();
  });

  it('names the version in the Edit control accessible name, and keeps the visible text inside it', async () => {
    orchestratorServes(
      [buildProjectBible({ published: false, version: 4 })],
      undefined,
    );

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    const edit = await screen.findByRole('button', {
      name: /^Edit this draft/,
    });

    expect(edit).toHaveAccessibleName(
      'Edit this draft of the project bible, version 4',
    );
    expect(edit).toHaveTextContent('Edit this draft');
  });
});

describe('ProjectBibleView', () => {
  it('offers publishing on a draft', async () => {
    orchestratorServes([buildProjectBible({ published: false })], undefined);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    expect(
      await screen.findByRole('button', { name: /^Publish/ }),
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
      screen.queryByRole('button', { name: /^Publish/ }),
    ).not.toBeInTheDocument();
  });

  it('says the list is truncated when the orchestrator offers another page', async () => {
    server.use(
      http.get(API_PATH.project(PROJECT_ID), () =>
        HttpResponse.json(buildProject()),
      ),
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

  it('names the publish control so its visible text is part of its accessible name', async () => {
    orchestratorServes([buildProjectBible({ published: false })], undefined);

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);

    const control = await screen.findByRole('button', { name: /^Publish/ });
    const visible = control.textContent ?? '';
    const accessible = control.getAttribute('aria-label') ?? '';

    expect(visible.length).toBeGreaterThan(0);
    expect(accessible).toContain(visible);
  });

  it('announces a publish only for the version that was published, not for any published version', async () => {
    const DRAFT_ID = projectBibleVersionIdSchema.parse(
      '11111111-1111-4111-8111-111111111111',
    );
    const OLDER_ID = projectBibleVersionIdSchema.parse(
      '22222222-2222-4222-8222-222222222222',
    );
    const older = buildProjectBible({
      id: OLDER_ID,
      version: 1,
      published: true,
      publishedAt: '2026-08-22T00:00:00.000Z',
    });
    const draft = buildProjectBible({ id: DRAFT_ID, version: 2 });
    const draftPublished = buildProjectBible({
      id: DRAFT_ID,
      version: 2,
      published: true,
      publishedAt: '2026-08-23T00:00:00.000Z',
    });

    let draftIsPublished = false;
    server.use(
      http.get(API_PATH.project(PROJECT_ID), () =>
        HttpResponse.json(buildProject()),
      ),
      http.get(API_PATH.projectBibles(PROJECT_ID), () =>
        HttpResponse.json({
          items: [draftIsPublished ? draftPublished : draft, older],
        }),
      ),
      http.get(API_PATH.activeProjectBible(PROJECT_ID), () =>
        HttpResponse.json(draftIsPublished ? draftPublished : older),
      ),
      http.post(API_PATH.publishProjectBible(PROJECT_ID, DRAFT_ID), () => {
        draftIsPublished = true;
        return HttpResponse.json(draftPublished);
      }),
      http.get(`${API_PATH.projectBibles(PROJECT_ID)}/:id/markdown`, () =>
        HttpResponse.text('# Project bible', {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        }),
      ),
    );

    renderInApp(<ProjectBibleView projectId={PROJECT_ID} />);
    await screen.findByText('World rules');

    await userEvent.click(
      screen.getByRole('button', { name: 'Show version 2' }),
    );
    await userEvent.click(screen.getByRole('button', { name: /^Publish/ }));

    expect(
      await screen.findByText(
        'Published. This is now the version a new production plans against.',
      ),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Show version 1' }),
    );

    expect(
      screen.queryByText(
        'Published. This is now the version a new production plans against.',
      ),
    ).not.toBeInTheDocument();
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
