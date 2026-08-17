import { isRouteErrorResponse } from 'react-router-dom';
import type { RouteErrorResponse } from '../interfaces/route-error-response';

export const toRouteErrorResponse = (
  error: unknown,
): RouteErrorResponse | null => {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      statusText: error.statusText,
      data: error.data,
    };
  }

  if (error instanceof Response) {
    return {
      status: error.status,
      statusText: error.statusText,
      data: undefined,
    };
  }

  return null;
};
