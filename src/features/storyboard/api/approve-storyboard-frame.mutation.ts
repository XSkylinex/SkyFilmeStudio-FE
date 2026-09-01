import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { shotKeyframeStatusSchema } from 'sky-filme-studio-be/contracts';
import type {
  ShotId,
  ShotKeyframeStatus,
  StoryboardFrameId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';

const approveStoryboardFrame = (
  frameId: StoryboardFrameId,
): Promise<ShotKeyframeStatus> =>
  requestJson(
    API_PATH.storyboardFrameApproval(frameId),
    shotKeyframeStatusSchema,
    { method: 'POST' },
  );

export const approveStoryboardFrameMutationOptions = (
  shotId: ShotId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (frameId: StoryboardFrameId) => approveStoryboardFrame(frameId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: shotStoryboardQueryKey(shotId),
      }),
  });
