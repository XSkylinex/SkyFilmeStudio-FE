import { ERROR_CODE } from 'sky-filme-studio-be/contracts';
import { readErrorBody } from '@/lib/api/helpers/read-error-body';

const SERVER_FAULT_MESSAGE =
  'The Studio failed to complete the request. The server log carries the detail.';

describe('readErrorBody', () => {
  it('reads the envelope StudioErrorFilter sends', () => {
    expect(
      readErrorBody({
        statusCode: 507,
        code: ERROR_CODE.DISK_SPACE_LOW,
        message: 'Only 2 GB free on the project volume.',
      }),
    ).toEqual({
      code: ERROR_CODE.DISK_SPACE_LOW,
      detail: 'Only 2 GB free on the project volume.',
    });
  });

  it('keeps the code when a server fault has replaced the message', () => {
    expect(
      readErrorBody({
        statusCode: 500,
        code: ERROR_CODE.MPS_OUT_OF_MEMORY,
        message: SERVER_FAULT_MESSAGE,
      }),
    ).toEqual({
      code: ERROR_CODE.MPS_OUT_OF_MEMORY,
      detail: SERVER_FAULT_MESSAGE,
    });
  });

  it("reads Nest's built-in exception envelope, which carries no code", () => {
    expect(
      readErrorBody({
        statusCode: 404,
        message: 'No project 5e4c1f0a-1f2b-4a3c-9d8e-7f6a5b4c3d2e',
        error: 'Not Found',
      }),
    ).toEqual({
      code: undefined,
      detail: 'No project 5e4c1f0a-1f2b-4a3c-9d8e-7f6a5b4c3d2e',
    });
  });

  it('describes the issues a validation failure carries, not its constant message', () => {
    expect(
      readErrorBody({
        statusCode: 400,
        message: 'Validation failed',
        errors: [
          {
            path: ['title'],
            message: 'Too small: expected string to have >=1 characters',
          },
          { path: ['primaryLanguage'], message: 'Invalid input' },
        ],
      }),
    ).toEqual({
      code: undefined,
      detail:
        'title: Too small: expected string to have >=1 characters; primaryLanguage: Invalid input',
    });
  });

  it('names a root-level issue rather than leaving it unlabelled', () => {
    expect(
      readErrorBody({
        statusCode: 400,
        message: 'Validation failed',
        errors: [{ path: [], message: 'Invalid input' }],
      }),
    ).toEqual({ code: undefined, detail: '(root): Invalid input' });
  });

  it('ignores a code the contract does not recognise', () => {
    expect(
      readErrorBody({ code: 'NOT_A_REAL_CODE', message: 'fallback message' }),
    ).toEqual({ code: undefined, detail: 'fallback message' });
  });

  it('ignores the field name this repo guessed before the filter existed', () => {
    expect(
      readErrorBody({
        errorCode: ERROR_CODE.DISK_SPACE_LOW,
        message: 'fallback message',
      }),
    ).toEqual({ code: undefined, detail: 'fallback message' });
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

  it('survives an errors field that is not an array of issues', () => {
    expect(
      readErrorBody({ message: 'Validation failed', errors: 'nonsense' }),
    ).toEqual({ code: undefined, detail: 'Validation failed' });
  });
});
