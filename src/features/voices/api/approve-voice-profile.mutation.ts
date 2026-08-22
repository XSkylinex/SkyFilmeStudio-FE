import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { voiceProfileSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  VoiceProfile,
  VoiceProfileId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { voiceProfilesQueryKey } from '@/features/voices/api/voice-profiles.query';

const approveVoiceProfile = (
  projectId: ProjectId,
  voiceProfileId: VoiceProfileId,
): Promise<VoiceProfile> =>
  requestJson(
    API_PATH.approveVoiceProfile(projectId, voiceProfileId),
    voiceProfileSchema,
    { method: 'POST' },
  );

export const approveVoiceProfileMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (voiceProfileId: VoiceProfileId) =>
      approveVoiceProfile(projectId, voiceProfileId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: voiceProfilesQueryKey(projectId),
      });
    },
  });
