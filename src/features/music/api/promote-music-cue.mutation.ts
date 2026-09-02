import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { musicCueSchema } from 'sky-filme-studio-be/contracts';
import type {
  MusicCue,
  ProjectId,
  PromoteMusicCueRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { musicCueRendersQueryKey } from '@/features/music/api/music-cue-renders.query';
import { musicCuesQueryKey } from '@/features/music/api/music-cues.query';

const promote = (
  projectId: ProjectId,
  request: PromoteMusicCueRequest,
): Promise<MusicCue> =>
  requestJson(API_PATH.musicCues(projectId), musicCueSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const promoteMusicCueMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: PromoteMusicCueRequest) =>
      promote(projectId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: musicCuesQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: musicCueRendersQueryKey(projectId),
        }),
      ]);
    },
  });
