import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { styleProfileSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  StyleProfile,
  StyleProfileId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { styleProfilesQueryKey } from '@/features/styles/api/style-profiles.query';

const approveStyleProfile = (
  projectId: ProjectId,
  styleProfileId: StyleProfileId,
): Promise<StyleProfile> =>
  requestJson(
    API_PATH.approveStyleProfile(projectId, styleProfileId),
    styleProfileSchema,
    { method: 'POST' },
  );

export const approveStyleProfileMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (styleProfileId: StyleProfileId) =>
      approveStyleProfile(projectId, styleProfileId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: styleProfilesQueryKey(projectId),
      });
    },
  });
