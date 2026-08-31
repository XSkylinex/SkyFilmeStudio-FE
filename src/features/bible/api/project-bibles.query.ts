import { queryOptions } from '@tanstack/react-query';
import { pageSchema, projectBibleSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PROJECT_BIBLES_STALE_TIME_MS } from '@/lib/query/query.constants';

const projectBiblePageSchema = pageSchema(projectBibleSchema);

export const projectBiblesQueryKey = (projectId: ProjectId): string[] => [
  'project-bibles',
  projectId,
];

export const projectBiblesQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: projectBiblesQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.projectBibles(projectId), projectBiblePageSchema, {
        signal,
      }),
    staleTime: PROJECT_BIBLES_STALE_TIME_MS,
  });
