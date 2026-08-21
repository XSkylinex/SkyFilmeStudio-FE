import { queryOptions } from '@tanstack/react-query';
import { pageSchema, projectSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PROJECTS_STALE_TIME_MS } from '@/lib/query/query.constants';

const projectPageSchema = pageSchema(projectSchema);

export const projectsQueryKey = (): string[] => ['projects'];

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: projectsQueryKey(),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.projects(), projectPageSchema, { signal }),
    staleTime: PROJECTS_STALE_TIME_MS,
  });
