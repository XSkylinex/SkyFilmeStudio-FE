import { queryOptions } from '@tanstack/react-query';
import { canonicalAssetSetSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId, SubjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { CANONICAL_SETS_STALE_TIME_MS } from '@/lib/query/query.constants';

const canonicalAssetSetListSchema = canonicalAssetSetSchema.array();

export const canonicalSetsQueryKey = (
  projectId: ProjectId,
  subjectId: SubjectId,
): string[] => ['canonical-sets', projectId, subjectId];

export const canonicalSetsQueryOptions = (
  projectId: ProjectId,
  subjectId: SubjectId,
) =>
  queryOptions({
    queryKey: canonicalSetsQueryKey(projectId, subjectId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.canonicalSets(projectId, subjectId),
        canonicalAssetSetListSchema,
        { signal },
      ),
    staleTime: CANONICAL_SETS_STALE_TIME_MS,
  });
