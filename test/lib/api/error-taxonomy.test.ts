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

  it.each([
    ERROR_CODE.VOICE_PROFILE_IMMUTABLE,
    ERROR_CODE.VOICE_ALREADY_APPROVED_FOR_SUBJECT,
    ERROR_CODE.PRONUNCIATION_DICTIONARY_EXISTS,
    ERROR_CODE.PRONUNCIATION_ENTRY_EXISTS,
  ])(
    '%s never suggests a retry, because none of them clears itself',
    (code) => {
      expect(ERROR_CODE_GUIDANCE[code].presentation).toBe('PERSISTENT');
      expect(EN_CATALOGUE[ERROR_CODE_GUIDANCE[code].messageKey]).not.toMatch(
        /try again|send it again|retry/i,
      );
    },
  );

  it('sends a blocked voice approval to deletion, and says why the obvious route fails', () => {
    const sentence = EN_CATALOGUE['error.VOICE_ALREADY_APPROVED_FOR_SUBJECT'];

    expect(sentence).toMatch(/delet/i);
    expect(sentence).toMatch(/refused/i);
  });

  it('classifies the version-allocation race as the one conflict that clears itself', () => {
    expect(ERROR_CODE_GUIDANCE.STYLE_VERSION_CONFLICT.presentation).toBe(
      'TRANSIENT',
    );
    expect(ERROR_CODE_GUIDANCE.STYLE_PROFILE_IMMUTABLE.presentation).toBe(
      'PERSISTENT',
    );
  });
});
