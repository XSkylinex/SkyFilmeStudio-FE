import { queryOptions } from '@tanstack/react-query';
import { preflightReportSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PREFLIGHT_STALE_TIME_MS } from '@/lib/query/query.constants';

export const preflightQueryKey = (): string[] => ['preflight'];

export const preflightQueryOptions = () =>
  queryOptions({
    queryKey: preflightQueryKey(),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.preflight(), preflightReportSchema, { signal }),
    staleTime: PREFLIGHT_STALE_TIME_MS,
  });
