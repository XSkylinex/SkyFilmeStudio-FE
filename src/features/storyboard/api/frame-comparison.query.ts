import { queryOptions } from '@tanstack/react-query';
import { frameComparisonSchema } from 'sky-filme-studio-be/contracts';
import type { StoryboardFrameId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { FRAME_COMPARISON_STALE_TIME_MS } from '@/lib/query/query.constants';

export const frameComparisonQueryKey = (
  frameId: StoryboardFrameId,
): string[] => ['frame-comparison', frameId];

export const frameComparisonQueryOptions = (frameId: StoryboardFrameId) =>
  queryOptions({
    queryKey: frameComparisonQueryKey(frameId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.storyboardFrameComparison(frameId),
        frameComparisonSchema,
        { signal },
      ),
    staleTime: FRAME_COMPARISON_STALE_TIME_MS,
  });
