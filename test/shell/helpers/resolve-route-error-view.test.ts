import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';

describe('resolveRouteErrorView', () => {
  it('falls back to an HTTP_<status> detail when there is no code and no statusText', () => {
    const view = resolveRouteErrorView({
      status: 500,
      statusText: '',
      data: undefined,
      internal: false,
    });

    expect(view.detail).toBe('HTTP_500');
  });

  it('uses a non-empty statusText as the detail when there is no typed code', () => {
    const view = resolveRouteErrorView({
      status: 503,
      statusText: 'Service Unavailable',
      data: undefined,
      internal: false,
    });

    expect(view.detail).toBe('Service Unavailable');
  });

  it('folds a raw text body into the description instead of dropping it', () => {
    const view = resolveRouteErrorView({
      status: 507,
      statusText: '',
      data: 'disk full',
      internal: false,
    });

    expect(view.description).toBe(
      'The orchestrator responded with 507: disk full',
    );
  });

  it('never renders [object Object] for a thrown plain object with no code', () => {
    const view = resolveRouteErrorView({ some: 'thing' });

    expect(view.detail).not.toBe('[object Object]');
  });
});
