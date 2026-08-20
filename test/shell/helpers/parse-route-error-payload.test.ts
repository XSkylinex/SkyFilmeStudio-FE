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

  it('reads the message off a payload with no code, the shape NestJS sends by default', () => {
    const payload = parseRouteErrorPayload({
      statusCode: 503,
      message: 'The orchestrator is restarting',
      error: 'Service Unavailable',
    });

    expect(payload).toEqual({ message: 'The orchestrator is restarting' });
  });

  it('returns null for a payload with neither a code nor a message', () => {
    expect(parseRouteErrorPayload({ statusCode: 500 })).toBeNull();
  });

  it('returns null for a plain Error instance, which is not a backend payload even though it has a message', () => {
    expect(parseRouteErrorPayload(new Error('boom'))).toBeNull();
  });

  it('returns null when the code is not a string', () => {
    expect(parseRouteErrorPayload({ code: 507 })).toBeNull();
  });

  it('returns null for a non-object payload, such as a plain string body', () => {
    expect(parseRouteErrorPayload('Internal Server Error')).toBeNull();
    expect(parseRouteErrorPayload(null)).toBeNull();
    expect(parseRouteErrorPayload(undefined)).toBeNull();
  });

  it('parses a JSON-shaped string body, which is what a Response gets when no content-type header was set', () => {
    const payload = parseRouteErrorPayload(
      JSON.stringify({ code: 'DISK_SPACE_LOW', message: 'out of space' }),
    );

    expect(payload).toEqual({
      code: 'DISK_SPACE_LOW',
      message: 'out of space',
    });
  });

  it('returns null for a string body that is not valid JSON, rather than throwing', () => {
    expect(parseRouteErrorPayload('disk full')).toBeNull();
  });
});
