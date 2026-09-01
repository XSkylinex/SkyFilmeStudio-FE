import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { styleProfileSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  StyleProfile,
  StyleProfileId,
  UpdateStyleProfileRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { styleProfileVersionsQueryKey } from '@/features/styles/api/style-profile-versions.query';
import { styleProfilesQueryKey } from '@/features/styles/api/style-profiles.query';

const updateStyleProfile = (
  projectId: ProjectId,
  styleProfileId: StyleProfileId,
  request: UpdateStyleProfileRequest,
): Promise<StyleProfile> =>
  requestJson(
    API_PATH.styleProfile(projectId, styleProfileId),
    styleProfileSchema,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );

export const updateStyleProfileMutationOptions = (
  projectId: ProjectId,
  lineageId: StyleProfileId,
  styleProfileId: StyleProfileId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: UpdateStyleProfileRequest) =>
      updateStyleProfile(projectId, styleProfileId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: styleProfilesQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: styleProfileVersionsQueryKey(projectId, lineageId),
        }),
      ]);
    },
  });
