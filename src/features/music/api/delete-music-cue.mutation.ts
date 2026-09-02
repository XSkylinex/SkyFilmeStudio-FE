import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { musicCueSchema } from 'sky-filme-studio-be/contracts';
import type {
  MusicCue,
  MusicCueId,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { musicCuesQueryKey } from '@/features/music/api/music-cues.query';

const deleteMusicCue = (
  projectId: ProjectId,
  musicCueId: MusicCueId,
): Promise<MusicCue> =>
  requestJson(API_PATH.musicCue(projectId, musicCueId), musicCueSchema, {
    method: 'DELETE',
  });

export const deleteMusicCueMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (musicCueId: MusicCueId) =>
      deleteMusicCue(projectId, musicCueId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: musicCuesQueryKey(projectId),
      });
    },
  });
