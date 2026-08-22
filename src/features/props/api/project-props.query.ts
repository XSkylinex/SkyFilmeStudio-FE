import { queryOptions } from '@tanstack/react-query';
import { pageSchema, propSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PROJECT_PROPS_STALE_TIME_MS } from '@/lib/query/query.constants';

const propPageSchema = pageSchema(propSchema);

export const projectPropsQueryKey = (projectId: ProjectId): string[] => [
  'project-props',
  projectId,
];

export const projectPropsQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: projectPropsQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.projectProps(projectId), propPageSchema, { signal }),
    staleTime: PROJECT_PROPS_STALE_TIME_MS,
  });
