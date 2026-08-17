import { isRouteHandle } from '@/shell/helpers/is-route-handle';

describe('isRouteHandle', () => {
  it('accepts a handle carrying a string title', () => {
    expect(isRouteHandle({ title: 'Plan' })).toBe(true);
  });

  it('rejects a handle with no title', () => {
    expect(isRouteHandle({ notATitle: 1 })).toBe(false);
  });

  it('rejects a handle whose title is not a string', () => {
    expect(isRouteHandle({ title: 1 })).toBe(false);
  });

  it('rejects undefined and null', () => {
    expect(isRouteHandle(undefined)).toBe(false);
    expect(isRouteHandle(null)).toBe(false);
  });
});
