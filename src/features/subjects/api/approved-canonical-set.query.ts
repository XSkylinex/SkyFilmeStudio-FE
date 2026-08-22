import { queryOptions } from '@tanstack/react-query';
import { canonicalAssetSetSchema } from 'sky-filme-studio-be/contracts';
import type {
  CanonicalAssetSet,
  ProjectId,
  SubjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { StudioError } from '@/lib/api/studio-error';
import { APPROVED_CANONICAL_SET_STALE_TIME_MS } from '@/lib/query/query.constants';

const NOT_FOUND = 404;

export const approvedCanonicalSetQueryKey = (
  projectId: ProjectId,
  subjectId: SubjectId,
): string[] => ['approved-canonical-set', projectId, subjectId];

const fetchApprovedCanonicalSet = async (
  projectId: ProjectId,
  subjectId: SubjectId,
  signal: AbortSignal,
): Promise<CanonicalAssetSet | null> => {
  try {
    return await requestJson(
      API_PATH.approvedCanonicalSet(projectId, subjectId),
      canonicalAssetSetSchema,
      { signal },
    );
  } catch (error) {
    if (error instanceof StudioError && error.status === NOT_FOUND) {
      return null;
    }
    throw error;
  }
};

export const approvedCanonicalSetQueryOptions = (
  projectId: ProjectId,
  subjectId: SubjectId,
) =>
  queryOptions({
    queryKey: approvedCanonicalSetQueryKey(projectId, subjectId),
    queryFn: ({ signal }) =>
      fetchApprovedCanonicalSet(projectId, subjectId, signal),
    staleTime: APPROVED_CANONICAL_SET_STALE_TIME_MS,
  });
