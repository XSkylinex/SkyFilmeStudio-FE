import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { shotKeyframeStatusSchema } from 'sky-filme-studio-be/contracts';
import type {
  SceneId,
  ShotId,
  ShotKeyframeStatus,
  StoryboardFrameId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sceneShotsQueryKey } from '@/features/storyboard/api/scene-shots.query';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';

const rejectStoryboardFrame = (
  frameId: StoryboardFrameId,
): Promise<ShotKeyframeStatus> =>
  requestJson(
    API_PATH.storyboardFrameApproval(frameId),
    shotKeyframeStatusSchema,
    { method: 'DELETE' },
  );

export const rejectStoryboardFrameMutationOptions = (
  shotId: ShotId,
  sceneId: SceneId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (frameId: StoryboardFrameId) => rejectStoryboardFrame(frameId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: shotStoryboardQueryKey(shotId),
        }),
        queryClient.invalidateQueries({
          queryKey: sceneShotsQueryKey(sceneId),
        }),
      ]);
    },
  });
