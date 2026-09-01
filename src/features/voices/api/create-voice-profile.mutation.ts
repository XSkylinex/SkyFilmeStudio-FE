import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { voiceProfileSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreateVoiceProfileRequest,
  ProjectId,
  VoiceProfile,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { voiceProfilesQueryKey } from '@/features/voices/api/voice-profiles.query';

const createVoiceProfile = (
  projectId: ProjectId,
  request: CreateVoiceProfileRequest,
): Promise<VoiceProfile> =>
  requestJson(API_PATH.voiceProfiles(projectId), voiceProfileSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createVoiceProfileMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateVoiceProfileRequest) =>
      createVoiceProfile(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: voiceProfilesQueryKey(projectId),
      });
    },
  });
