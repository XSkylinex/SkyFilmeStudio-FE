import { queryOptions } from '@tanstack/react-query';
import { pageSchema, subjectSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PROJECT_SUBJECTS_STALE_TIME_MS } from '@/lib/query/query.constants';

const subjectPageSchema = pageSchema(subjectSchema);

export const projectSubjectsQueryKey = (projectId: ProjectId): string[] => [
  'project-subjects',
  projectId,
];

export const projectSubjectsQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: projectSubjectsQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.projectSubjects(projectId), subjectPageSchema, {
        signal,
      }),
    staleTime: PROJECT_SUBJECTS_STALE_TIME_MS,
  });
