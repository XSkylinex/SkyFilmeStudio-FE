import { ERROR_CODE } from 'sky-filme-studio-be/contracts';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';

describe('ERROR_CODE_GUIDANCE', () => {
  it('covers every error code the contract defines, so a new backend code fails this suite instead of rendering nothing', () => {
    expect(Object.keys(ERROR_CODE_GUIDANCE).sort()).toEqual(
      Object.values(ERROR_CODE).sort(),
    );
  });

  it('marks OFFLINE_POLICY_VIOLATION persistent, since the offline promise must never disappear as a toast', () => {
    expect(
      ERROR_CODE_GUIDANCE[ERROR_CODE.OFFLINE_POLICY_VIOLATION].presentation,
    ).toBe('PERSISTENT');
  });

  it.each(Object.values(ERROR_CODE))(
    'gives %s a non-empty sentence',
    (code) => {
      expect(ERROR_CODE_GUIDANCE[code].sentence.length).toBeGreaterThan(0);
    },
  );

  it.each(Object.values(ERROR_CODE))(
    'never falls back to "Something went wrong" for %s',
    (code) => {
      expect(ERROR_CODE_GUIDANCE[code].sentence).not.toContain(
        'Something went wrong',
      );
    },
  );

  it.each([ERROR_CODE.MPS_OUT_OF_MEMORY, ERROR_CODE.CUDA_OUT_OF_MEMORY])(
    'tells the user to lower the render profile for %s, never to just try again',
    (code) => {
      const { sentence } = ERROR_CODE_GUIDANCE[code];

      expect(sentence.toLowerCase()).toContain('lower');
      expect(sentence.toLowerCase()).not.toContain('try again');
    },
  );
});

describe('ERROR_CODE_GUIDANCE presentation', () => {
  it('never lets a message auto-dismiss when its only remedy is in that message', () => {
    expect(ERROR_CODE_GUIDANCE.MPS_OUT_OF_MEMORY.presentation).toBe(
      'PERSISTENT',
    );
    expect(ERROR_CODE_GUIDANCE.CUDA_OUT_OF_MEMORY.presentation).toBe(
      'PERSISTENT',
    );
  });

  it('does not send the reader to a screen or an action this build does not have', () => {
    const forbidden = [
      /model setup screen/i,
      /run the benchmark/i,
      /system screen/i,
    ];

    for (const [code, guidance] of Object.entries(ERROR_CODE_GUIDANCE)) {
      for (const pattern of forbidden) {
        expect(`${code}: ${guidance.sentence}`.match(pattern)).toBeNull();
      }
    }
  });
});
