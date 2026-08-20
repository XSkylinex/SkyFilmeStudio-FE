import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
import { ROUTE_ERROR_DEFAULT_MESSAGE } from '@/shell/route-error.constants';
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

  it('never renders [object Object] for a thrown circular object either', () => {
    const circular: Record<string, unknown> = { code: undefined };
    circular.self = circular;

    const view = resolveRouteErrorView(circular);

    expect(view.detail).not.toBe('[object Object]');
    expect(view.detail).not.toBe('');
  });

  it('renders the backend message when a Response body carries one but no typed code', () => {
    const view = resolveRouteErrorView({
      status: 503,
      statusText: '',
      data: { message: 'The orchestrator is restarting' },
      internal: false,
    });

    expect(view.description).toBe('The orchestrator is restarting');
  });

  it('flags a typed or messaged Response as not an unknown error', () => {
    const view = resolveRouteErrorView({
      status: 507,
      statusText: '',
      data: { code: 'DISK_SPACE_LOW' },
      internal: false,
    });

    expect(view.isUnknownError).toBe(false);
  });

  it('describes a known error code with the shared taxonomy, not a copy of its own', () => {
    const view = resolveRouteErrorView({
      status: 507,
      statusText: '',
      data: { code: 'DISK_SPACE_LOW' },
      internal: false,
    });

    expect(view.description).toBe(ERROR_CODE_GUIDANCE.DISK_SPACE_LOW.sentence);
  });

  it('falls back to the default message for a code this build has never heard of', () => {
    const view = resolveRouteErrorView({
      status: 500,
      statusText: '',
      data: { code: 'A_CODE_FROM_A_NEWER_BACKEND' },
      internal: false,
    });

    expect(view.description).toBe(ROUTE_ERROR_DEFAULT_MESSAGE);
    expect(view.detail).toBe('A_CODE_FROM_A_NEWER_BACKEND');
  });

  it('flags a completely untyped thrown value as an unknown error', () => {
    const view = resolveRouteErrorView(new Error('boom'));

    expect(view.isUnknownError).toBe(true);
  });
});
