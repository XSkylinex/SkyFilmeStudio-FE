import { queryOptions } from '@tanstack/react-query';
import { projectSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PROJECTS_STALE_TIME_MS } from '@/lib/query/query.constants';

export const projectQueryKey = (projectId: ProjectId): string[] => [
  'project',
  projectId,
];

export const projectQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: projectQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.project(projectId), projectSchema, { signal }),
    staleTime: PROJECTS_STALE_TIME_MS,
  });
