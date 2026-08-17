import { parseRouteErrorPayload } from '@/shell/helpers/parse-route-error-payload';

describe('parseRouteErrorPayload', () => {
  it('reads the code and message off a well-formed payload', () => {
    const payload = parseRouteErrorPayload({
      code: 'DISK_SPACE_LOW',
      message: 'out of space',
    });

    expect(payload).toEqual({
      code: 'DISK_SPACE_LOW',
      message: 'out of space',
    });
  });

  it('reads the code when no message is present', () => {
    const payload = parseRouteErrorPayload({ code: 'DISK_SPACE_LOW' });

    expect(payload).toEqual({ code: 'DISK_SPACE_LOW', message: undefined });
  });

  it('returns null for a payload with no code', () => {
    expect(parseRouteErrorPayload({ message: 'no code here' })).toBeNull();
  });

  it('returns null when the code is not a string', () => {
    expect(parseRouteErrorPayload({ code: 507 })).toBeNull();
  });

  it('returns null for a non-object payload, such as a plain string body', () => {
    expect(parseRouteErrorPayload('Internal Server Error')).toBeNull();
    expect(parseRouteErrorPayload(null)).toBeNull();
    expect(parseRouteErrorPayload(undefined)).toBeNull();
  });
});
