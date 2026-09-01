import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { voiceProfileSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  UpdateVoiceProfileRequest,
  VoiceProfile,
  VoiceProfileId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { voiceProfilesQueryKey } from '@/features/voices/api/voice-profiles.query';

const updateVoiceProfile = (
  projectId: ProjectId,
  voiceProfileId: VoiceProfileId,
  request: UpdateVoiceProfileRequest,
): Promise<VoiceProfile> =>
  requestJson(
    API_PATH.voiceProfile(projectId, voiceProfileId),
    voiceProfileSchema,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );

export const updateVoiceProfileMutationOptions = (
  projectId: ProjectId,
  voiceProfileId: VoiceProfileId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: UpdateVoiceProfileRequest) =>
      updateVoiceProfile(projectId, voiceProfileId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: voiceProfilesQueryKey(projectId),
      });
    },
  });
