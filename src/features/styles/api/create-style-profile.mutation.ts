import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { styleProfileSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreateStyleProfileRequest,
  ProjectId,
  StyleProfile,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { styleProfilesQueryKey } from '@/features/styles/api/style-profiles.query';

const createStyleProfile = (
  projectId: ProjectId,
  request: CreateStyleProfileRequest,
): Promise<StyleProfile> =>
  requestJson(API_PATH.styleProfiles(projectId), styleProfileSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createStyleProfileMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateStyleProfileRequest) =>
      createStyleProfile(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: styleProfilesQueryKey(projectId),
      });
    },
  });
