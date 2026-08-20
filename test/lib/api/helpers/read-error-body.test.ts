import { ERROR_CODE } from 'sky-filme-studio-be/contracts';
import { readErrorBody } from '@/lib/api/helpers/read-error-body';

describe('readErrorBody', () => {
  it('extracts a recognised errorCode alongside its detail', () => {
    expect(
      readErrorBody({
        errorCode: ERROR_CODE.DISK_SPACE_LOW,
        errorDetail: 'Only 2GB free on the project volume.',
      }),
    ).toEqual({
      code: ERROR_CODE.DISK_SPACE_LOW,
      detail: 'Only 2GB free on the project volume.',
    });
  });

  it('ignores an errorCode the contract does not recognise', () => {
    expect(
      readErrorBody({
        errorCode: 'NOT_A_REAL_CODE',
        message: 'fallback message',
      }),
    ).toEqual({ code: undefined, detail: 'fallback message' });
  });

  it('falls back to message when there is no errorDetail', () => {
    expect(readErrorBody({ message: 'plain message' })).toEqual({
      code: undefined,
      detail: 'plain message',
    });
  });

  it('survives a string body instead of the object it expects', () => {
    expect(readErrorBody('plain text error')).toEqual({
      code: undefined,
      detail: 'plain text error',
    });
  });

  it('survives a null body', () => {
    expect(readErrorBody(null)).toEqual({
      code: undefined,
      detail: undefined,
    });
  });

  it('survives a non-object body such as a bare number', () => {
    expect(readErrorBody(500)).toEqual({ code: undefined, detail: undefined });
  });
});
