import { getApiBaseUrl } from '@/lib/api/api-base-url';

export const mediaUrl = (path: string): string => `${getApiBaseUrl()}${path}`;
