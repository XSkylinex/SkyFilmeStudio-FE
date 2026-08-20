import { queryOptions } from '@tanstack/react-query';
import { renderJobSchema } from 'sky-filme-studio-be/contracts';
import type { RenderJobId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { isPermanentFailure } from '@/lib/api/helpers/is-permanent-failure';
import { isTerminalJobState } from '@/features/render-queue/api/helpers/is-terminal-job-state';
import {
  RENDER_JOB_POLL_FLOOR_MS,
  RENDER_JOB_STALE_TIME_MS,
} from '@/lib/query/query.constants';

export const renderJobQueryKey = (renderJobId: RenderJobId): string[] => [
  'render-jobs',
  renderJobId,
];

export const renderJobQueryOptions = (renderJobId: RenderJobId) =>
  queryOptions({
    queryKey: renderJobQueryKey(renderJobId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.renderJob(renderJobId), renderJobSchema, { signal }),
    staleTime: RENDER_JOB_STALE_TIME_MS,
    refetchInterval: (query) =>
      isTerminalJobState(query.state.data?.state) ||
      isPermanentFailure(query.state.error)
        ? false
        : RENDER_JOB_POLL_FLOOR_MS,
  });
