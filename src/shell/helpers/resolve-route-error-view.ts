import { parseRouteErrorPayload } from './parse-route-error-payload';
import { toRouteErrorResponse } from './to-route-error-response';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
import { StudioError } from '@/lib/api/studio-error';
import type { ErrorCodeGuidance } from '@/lib/api/api.interface';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { RouteErrorPayload } from '../interfaces/route-error-payload';
import type { RouteErrorResponse } from '../interfaces/route-error-response';
import type { RouteErrorView } from '../interfaces/route-error-view';

const GUIDANCE_BY_CODE: Record<string, ErrorCodeGuidance> = ERROR_CODE_GUIDANCE;

const CIRCULAR_REFERENCE_MARKER = '[Circular]';

const createCircularSafeReplacer = (): ((
  key: string,
  value: unknown,
) => unknown) => {
  const seen = new WeakSet<object>();

  return (_key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return CIRCULAR_REFERENCE_MARKER;
      }
      seen.add(value);
    }
    return value;
  };
};

const describeUnknownError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error, createCircularSafeReplacer());
  } catch {
    if (error !== null && typeof error === 'object') {
      const keys = Object.keys(error);
      return `An error object that could not be serialised (keys: ${
        keys.length > 0 ? keys.join(', ') : 'none'
      }).`;
    }
    return String(error);
  }
};

interface PayloadDescription {
  descriptionKey?: TranslationKey | undefined;
  descriptionDetail?: string | undefined;
}

const describeRouteErrorPayload = (
  payload: RouteErrorPayload,
): PayloadDescription => {
  if (!payload.code) {
    return payload.message
      ? { descriptionDetail: payload.message }
      : { descriptionKey: 'error.unrecognisedCode' };
  }

  return {
    descriptionKey:
      GUIDANCE_BY_CODE[payload.code]?.messageKey ?? 'error.unrecognisedCode',
    descriptionDetail: payload.message,
  };
};

const resolveRouteErrorResponseView = (
  errorResponse: RouteErrorResponse,
): RouteErrorView => {
  const payload = parseRouteErrorPayload(errorResponse.data);
  const statusText = errorResponse.statusText || undefined;

  if (payload) {
    return {
      detail: payload.code ?? statusText ?? `HTTP_${errorResponse.status}`,
      ...describeRouteErrorPayload(payload),
      isUnknownError: false,
    };
  }

  const rawBody =
    typeof errorResponse.data === 'string' ? errorResponse.data.trim() : '';

  return {
    detail: statusText ?? `HTTP_${errorResponse.status}`,
    descriptionKey: 'error.status',
    descriptionValues: { status: errorResponse.status },
    descriptionDetail: rawBody || statusText,
    isUnknownError: false,
  };
};

const resolveStudioErrorView = (error: StudioError): RouteErrorView => ({
  detail: error.code ?? error.status?.toString() ?? error.kind,
  descriptionKey: error.messageKey,
  descriptionValues: error.messageValues,
  descriptionDetail: error.detail,
  isUnknownError: false,
});

export const resolveRouteErrorView = (error: unknown): RouteErrorView => {
  if (error instanceof StudioError) {
    return resolveStudioErrorView(error);
  }

  const errorResponse = toRouteErrorResponse(error);
  if (errorResponse) {
    return resolveRouteErrorResponseView(errorResponse);
  }

  const payload = parseRouteErrorPayload(error);
  if (payload) {
    return {
      detail: payload.code ?? describeUnknownError(error),
      ...describeRouteErrorPayload(payload),
      isUnknownError: false,
    };
  }

  return {
    detail: describeUnknownError(error),
    descriptionKey: 'error.routeGeneric',
    isUnknownError: true,
  };
};
