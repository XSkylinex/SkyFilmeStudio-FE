import { isAbortError } from '@/lib/api/helpers/is-abort-error';
import { isPermanentFailure } from '@/lib/api/helpers/is-permanent-failure';
import { DEFAULT_RETRY_COUNT } from '@/lib/query/query.constants';

export const shouldRetryRequest = (
  failureCount: number,
  error: unknown,
): boolean =>
  failureCount < DEFAULT_RETRY_COUNT &&
  !isAbortError(error) &&
  !isPermanentFailure(error);
