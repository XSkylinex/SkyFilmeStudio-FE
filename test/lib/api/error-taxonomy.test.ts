import { ERROR_CODE } from 'sky-filme-studio-be/contracts';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';

describe('ERROR_CODE_GUIDANCE', () => {
  it('covers every error code the contract defines, so a new one cannot render nothing', () => {
    expect(Object.keys(ERROR_CODE_GUIDANCE).sort()).toEqual(
      Object.values(ERROR_CODE).sort(),
    );
  });

  it.each(Object.values(ERROR_CODE))(
    '%s points at a catalogue key named after it',
    (code) => {
      expect(ERROR_CODE_GUIDANCE[code].messageKey).toBe(`error.${code}`);
    },
  );

  it.each(Object.values(ERROR_CODE))(
    '%s has a sentence in the catalogue it points at',
    (code) => {
      expect(EN_CATALOGUE[ERROR_CODE_GUIDANCE[code].messageKey]).toBeTruthy();
    },
  );

  it('keeps the message that nearly broke the local-only promise on screen', () => {
    expect(ERROR_CODE_GUIDANCE.OFFLINE_POLICY_VIOLATION.presentation).toBe(
      'PERSISTENT',
    );
  });

  it.each([ERROR_CODE.MPS_OUT_OF_MEMORY, ERROR_CODE.CUDA_OUT_OF_MEMORY])(
    '%s never auto-dismisses, because its only remedy is in the message',
    (code) => {
      expect(ERROR_CODE_GUIDANCE[code].presentation).toBe('PERSISTENT');
    },
  );
});
