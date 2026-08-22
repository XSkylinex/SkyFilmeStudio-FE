import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { canonicalAssetSetSchema } from 'sky-filme-studio-be/contracts';
import type {
  CanonicalAssetSet,
  CanonicalAssetSetId,
  ProjectId,
  SubjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { approvedCanonicalSetQueryKey } from '@/features/subjects/api/approved-canonical-set.query';
import { canonicalSetsQueryKey } from '@/features/subjects/api/canonical-sets.query';

const approveCanonicalSet = (
  projectId: ProjectId,
  subjectId: SubjectId,
  setId: CanonicalAssetSetId,
): Promise<CanonicalAssetSet> =>
  requestJson(
    API_PATH.approveCanonicalSet(projectId, subjectId, setId),
    canonicalAssetSetSchema,
    { method: 'POST' },
  );

export const approveCanonicalSetMutationOptions = (
  projectId: ProjectId,
  subjectId: SubjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (setId: CanonicalAssetSetId) =>
      approveCanonicalSet(projectId, subjectId, setId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: canonicalSetsQueryKey(projectId, subjectId),
        }),
        queryClient.invalidateQueries({
          queryKey: approvedCanonicalSetQueryKey(projectId, subjectId),
        }),
      ]);
    },
  });
