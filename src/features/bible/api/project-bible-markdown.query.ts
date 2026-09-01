import { queryOptions } from '@tanstack/react-query';
import type {
  ProjectBibleVersionId,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestText } from '@/lib/api/request-text';
import { PROJECT_BIBLE_MARKDOWN_STALE_TIME_MS } from '@/lib/query/query.constants';

export const projectBibleMarkdownQueryKey = (
  projectId: ProjectId,
  bibleId: ProjectBibleVersionId,
): string[] => ['project-bible-markdown', projectId, bibleId];

export const projectBibleMarkdownQueryOptions = (
  projectId: ProjectId,
  bibleId: ProjectBibleVersionId,
) =>
  queryOptions({
    queryKey: projectBibleMarkdownQueryKey(projectId, bibleId),
    queryFn: ({ signal }) =>
      requestText(API_PATH.projectBibleMarkdown(projectId, bibleId), {
        signal,
      }),
    staleTime: PROJECT_BIBLE_MARKDOWN_STALE_TIME_MS,
  });
