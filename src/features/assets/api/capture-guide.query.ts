import { queryOptions } from '@tanstack/react-query';
import { captureGuideSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { CAPTURE_GUIDE_STALE_TIME_MS } from '@/lib/query/query.constants';

export const captureGuideQueryKey = (): string[] => ['capture-guide'];

export const captureGuideQueryOptions = () =>
  queryOptions({
    queryKey: captureGuideQueryKey(),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.captureGuide(), captureGuideSchema, { signal }),
    staleTime: CAPTURE_GUIDE_STALE_TIME_MS,
  });
