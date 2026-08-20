import { resolveApiBaseUrl } from '@/lib/api/helpers/resolve-api-base-url';

let resolved: string | undefined;

export const getApiBaseUrl = (): string => {
  resolved ??= resolveApiBaseUrl({
    configured: import.meta.env.VITE_ORCHESTRATOR_URL,
    pageOrigin: globalThis.location?.origin ?? '',
  });

  return resolved;
};
