import { QueryClient } from '@tanstack/react-query';
import { shouldRetryRequest } from '@/lib/query/helpers/should-retry-request';

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetryRequest,
      },
    },
  });
