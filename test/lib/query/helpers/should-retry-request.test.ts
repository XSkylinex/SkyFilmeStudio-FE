import { StudioError } from '@/lib/api/studio-error';
import { shouldRetryRequest } from '@/lib/query/helpers/should-retry-request';
import { DEFAULT_RETRY_COUNT } from '@/lib/query/query.constants';

const buildHttpError = (status: number): StudioError =>
  new StudioError({
    kind: 'HTTP',
    messageKey: 'error.network',
    status,
  });

const buildContractError = (): StudioError =>
  new StudioError({
    kind: 'CONTRACT',
    messageKey: 'error.network',
  });

const buildNetworkError = (): StudioError =>
  new StudioError({
    kind: 'NETWORK',
    messageKey: 'error.network',
  });

describe('shouldRetryRequest', () => {
  it('never retries a CONTRACT error, since retrying a shape mismatch just spends time', () => {
    expect(shouldRetryRequest(0, buildContractError())).toBe(false);
  });

  it('never retries a 4xx response, since the identical request fails the identical way', () => {
    expect(shouldRetryRequest(0, buildHttpError(404))).toBe(false);
  });

  it('retries a 5xx response', () => {
    expect(shouldRetryRequest(0, buildHttpError(500))).toBe(true);
  });

  it('retries a NETWORK error, since the orchestrator may just be starting up', () => {
    expect(shouldRetryRequest(0, buildNetworkError())).toBe(true);
  });

  it('retries an error it does not recognise as a StudioError, rather than assuming it is permanent', () => {
    expect(shouldRetryRequest(0, new Error('boom'))).toBe(true);
  });

  it('stops retrying once the failure count reaches DEFAULT_RETRY_COUNT, regardless of the error', () => {
    expect(shouldRetryRequest(DEFAULT_RETRY_COUNT, buildNetworkError())).toBe(
      false,
    );
  });

  it('never retries a reply that was not JSON, since the same path will answer the same way', () => {
    const malformed = new StudioError({
      kind: 'MALFORMED',
      messageKey: 'error.network',
      status: 200,
    });

    expect(shouldRetryRequest(0, malformed)).toBe(false);
  });

  it('never retries a cancelled request', () => {
    const aborted = new DOMException(
      'The operation was aborted.',
      'AbortError',
    );

    expect(shouldRetryRequest(0, aborted)).toBe(false);
  });
});
