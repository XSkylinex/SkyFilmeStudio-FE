import { queryOptions } from '@tanstack/react-query';
import { modelSetupReportSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { MODEL_SETUP_STALE_TIME_MS } from '@/lib/query/query.constants';

export const modelSetupQueryKey = (): string[] => ['model-setup'];

export const modelSetupQueryOptions = () =>
  queryOptions({
    queryKey: modelSetupQueryKey(),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.modelSetup(), modelSetupReportSchema, { signal }),
    staleTime: MODEL_SETUP_STALE_TIME_MS,
  });
