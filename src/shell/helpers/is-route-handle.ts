import type { RouteHandle } from '../interfaces/route-handle';

export const isRouteHandle = (handle: unknown): handle is RouteHandle =>
  typeof handle === 'object' &&
  handle !== null &&
  typeof (handle as Partial<RouteHandle>).titleKey === 'string';
