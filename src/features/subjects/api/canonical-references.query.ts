import { queryOptions } from '@tanstack/react-query';
import { canonicalReferenceSchema } from 'sky-filme-studio-be/contracts';
import type {
  CanonicalAssetSetId,
  ProjectId,
  SubjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { CANONICAL_REFERENCES_STALE_TIME_MS } from '@/lib/query/query.constants';

const canonicalReferenceListSchema = canonicalReferenceSchema.array();

export const canonicalReferencesQueryKey = (
  projectId: ProjectId,
  subjectId: SubjectId,
  setId: CanonicalAssetSetId,
): string[] => ['canonical-references', projectId, subjectId, setId];

export const canonicalReferencesQueryOptions = (
  projectId: ProjectId,
  subjectId: SubjectId,
  setId: CanonicalAssetSetId,
) =>
  queryOptions({
    queryKey: canonicalReferencesQueryKey(projectId, subjectId, setId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.canonicalReferences(projectId, subjectId, setId),
        canonicalReferenceListSchema,
        { signal },
      ),
    staleTime: CANONICAL_REFERENCES_STALE_TIME_MS,
  });
