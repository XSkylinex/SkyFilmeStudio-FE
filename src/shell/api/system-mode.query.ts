import { queryOptions } from '@tanstack/react-query';
import { systemModeSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import {
  SYSTEM_MODE_POLL_FLOOR_MS,
  SYSTEM_MODE_STALE_TIME_MS,
} from '@/lib/query/query.constants';

export const systemModeQueryKey = (): string[] => ['system', 'mode'];

export const systemModeQueryOptions = () =>
  queryOptions({
    queryKey: systemModeQueryKey(),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.systemMode(), systemModeSchema, { signal }),
    staleTime: SYSTEM_MODE_STALE_TIME_MS,
    refetchInterval: SYSTEM_MODE_POLL_FLOOR_MS,
  });
