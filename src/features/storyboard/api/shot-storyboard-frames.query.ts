import { queryOptions } from '@tanstack/react-query';
import { storyboardFrameSchema } from 'sky-filme-studio-be/contracts';
import type { ShotId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';
import { SHOT_STORYBOARD_FRAMES_STALE_TIME_MS } from '@/lib/query/query.constants';

const shotStoryboardFramesSchema = storyboardFrameSchema.array();

export const shotStoryboardFramesQueryKey = (shotId: ShotId): string[] => [
  ...shotStoryboardQueryKey(shotId),
  'frames',
];

export const shotStoryboardFramesQueryOptions = (shotId: ShotId) =>
  queryOptions({
    queryKey: shotStoryboardFramesQueryKey(shotId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.shotStoryboardFrames(shotId),
        shotStoryboardFramesSchema,
        { signal },
      ),
    staleTime: SHOT_STORYBOARD_FRAMES_STALE_TIME_MS,
  });
