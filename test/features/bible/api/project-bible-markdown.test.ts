import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  projectBibleVersionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  projectBibleMarkdownQueryKey,
  projectBibleMarkdownQueryOptions,
} from '@/features/bible/api/project-bible-markdown.query';
import { PROJECT_BIBLE_MARKDOWN_STALE_TIME_MS } from '@/lib/query/query.constants';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const BIBLE_ID = projectBibleVersionIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('projectBibleMarkdownQueryKey', () => {
  it('keys by project and bible, so two versions never share cached prose', () => {
    const otherBible = projectBibleVersionIdSchema.parse(
      '88888888-8888-4888-8888-888888888888',
    );

    expect(projectBibleMarkdownQueryKey(PROJECT_ID, BIBLE_ID)).toEqual([
      'project-bible-markdown',
      PROJECT_ID,
      BIBLE_ID,
    ]);
    expect(projectBibleMarkdownQueryKey(PROJECT_ID, BIBLE_ID)).not.toEqual(
      projectBibleMarkdownQueryKey(PROJECT_ID, otherBible),
    );
    expect(
      projectBibleMarkdownQueryOptions(PROJECT_ID, BIBLE_ID).staleTime,
    ).toBe(PROJECT_BIBLE_MARKDOWN_STALE_TIME_MS);
  });
});

describe('projectBibleMarkdownQueryOptions', () => {
  it('resolves to the markdown body as plain text, not a parsed object', async () => {
    const markdown = '# World\n\nDiffuse, even lighting.';
    server.use(
      http.get(API_PATH.projectBibleMarkdown(PROJECT_ID, BIBLE_ID), () =>
        HttpResponse.text(markdown, {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        }),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(
        projectBibleMarkdownQueryOptions(PROJECT_ID, BIBLE_ID),
      ),
    ).resolves.toBe(markdown);
  });

  it('rejects when the project bible does not exist', async () => {
    server.use(
      http.get(API_PATH.projectBibleMarkdown(PROJECT_ID, BIBLE_ID), () =>
        HttpResponse.json(
          {
            statusCode: 404,
            message: `No project bible ${BIBLE_ID} in project ${PROJECT_ID}`,
          },
          { status: 404 },
        ),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(
        projectBibleMarkdownQueryOptions(PROJECT_ID, BIBLE_ID),
      ),
    ).rejects.toMatchObject({ kind: 'HTTP', status: 404 });
  });
});
