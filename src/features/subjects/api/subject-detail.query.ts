import { queryOptions } from '@tanstack/react-query';
import { subjectSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId, SubjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SUBJECT_DETAIL_STALE_TIME_MS } from '@/lib/query/query.constants';

export const subjectDetailQueryKey = (
  projectId: ProjectId,
  subjectId: SubjectId,
): string[] => ['subject-detail', projectId, subjectId];

export const subjectDetailQueryOptions = (
  projectId: ProjectId,
  subjectId: SubjectId,
) =>
  queryOptions({
    queryKey: subjectDetailQueryKey(projectId, subjectId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.projectSubject(projectId, subjectId),
        subjectSchema,
        { signal },
      ),
    staleTime: SUBJECT_DETAIL_STALE_TIME_MS,
  });
