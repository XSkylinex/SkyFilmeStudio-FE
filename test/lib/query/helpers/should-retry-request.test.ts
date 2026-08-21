import { ERROR_CODE } from 'sky-filme-studio-be/contracts';
import type { ErrorCode } from 'sky-filme-studio-be/contracts';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
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

const buildCodedError = (code: ErrorCode, status: number): StudioError =>
  new StudioError({
    kind: 'HTTP',
    messageKey: ERROR_CODE_GUIDANCE[code].messageKey,
    code,
    status,
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

  it.each(Object.values(ERROR_CODE))(
    '%s is not retried, because the orchestrator already classified it',
    (code) => {
      expect(shouldRetryRequest(0, buildCodedError(code, 500))).toBe(false);
    },
  );

  it('does not retry a 503 that names why no provider could run the job', () => {
    expect(
      shouldRetryRequest(
        0,
        buildCodedError(ERROR_CODE.NO_ELIGIBLE_PROVIDER, 503),
      ),
    ).toBe(false);
  });

  it('falls back to the status band when the failure carries no code', () => {
    expect(shouldRetryRequest(0, buildHttpError(503))).toBe(true);
  });
});
