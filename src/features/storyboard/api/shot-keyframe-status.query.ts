import { queryOptions } from '@tanstack/react-query';
import { shotKeyframeStatusSchema } from 'sky-filme-studio-be/contracts';
import type { ShotId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';
import { SHOT_KEYFRAME_STATUS_STALE_TIME_MS } from '@/lib/query/query.constants';

export const shotKeyframeStatusQueryKey = (shotId: ShotId): string[] => [
  ...shotStoryboardQueryKey(shotId),
  'keyframe-status',
];

export const shotKeyframeStatusQueryOptions = (shotId: ShotId) =>
  queryOptions({
    queryKey: shotKeyframeStatusQueryKey(shotId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.shotKeyframeStatus(shotId),
        shotKeyframeStatusSchema,
        { signal },
      ),
    staleTime: SHOT_KEYFRAME_STATUS_STALE_TIME_MS,
  });
