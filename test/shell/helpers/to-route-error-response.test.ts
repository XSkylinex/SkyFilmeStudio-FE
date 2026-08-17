import { toRouteErrorResponse } from '@/shell/helpers/to-route-error-response';

describe('toRouteErrorResponse', () => {
  it('keeps the status and code of a Response thrown during render', () => {
    const thrown = new Response('disk is full', {
      status: 507,
      statusText: 'DISK_SPACE_LOW',
    });

    expect(toRouteErrorResponse(thrown)).toStrictEqual({
      status: 507,
      statusText: 'DISK_SPACE_LOW',
      data: undefined,
    });
  });

  it('reads a router error response, which is what a thrown loader Response becomes', () => {
    const routerError = {
      status: 507,
      statusText: 'Insufficient Storage',
      data: { code: 'DISK_SPACE_LOW' },
      internal: false,
    };

    expect(toRouteErrorResponse(routerError)).toStrictEqual({
      status: 507,
      statusText: 'Insufficient Storage',
      data: { code: 'DISK_SPACE_LOW' },
    });
  });

  it('returns null for a plain Error, so the caller renders its message instead', () => {
    expect(toRouteErrorResponse(new Error('boom'))).toBeNull();
  });

  it('returns null for a thrown string, rather than inventing a status', () => {
    expect(toRouteErrorResponse('boom')).toBeNull();
  });
});
