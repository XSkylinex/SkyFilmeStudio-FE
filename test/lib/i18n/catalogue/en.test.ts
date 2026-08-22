import { ERROR_CODE } from 'sky-filme-studio-be/contracts';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';

describe('EN_CATALOGUE', () => {
  it.each(Object.values(ERROR_CODE))(
    '%s carries a sentence a person can act on',
    (code) => {
      expect(EN_CATALOGUE[`error.${code}`]).toBeTruthy();
    },
  );

  it('never falls back to a sentence that tells the reader nothing', () => {
    const useless = Object.entries(EN_CATALOGUE)
      .filter(
        ([, value]) => value === '' || /something went wrong/i.test(value),
      )
      .map(([key]) => key);

    expect(useless).toEqual([]);
  });

  it.each([ERROR_CODE.MPS_OUT_OF_MEMORY, ERROR_CODE.CUDA_OUT_OF_MEMORY])(
    '%s tells the reader to lower the profile, never to try again',
    (code) => {
      expect(EN_CATALOGUE[`error.${code}`]).not.toMatch(/try again/i);
      expect(EN_CATALOGUE[`error.${code}`]).toMatch(/lower render profile/i);
    },
  );

  it('does not let the two present-but-unproven file statuses read alike', () => {
    expect(
      EN_CATALOGUE['system.models.fileStatus.PRESENT_UNVERIFIED'],
    ).not.toBe(EN_CATALOGUE['system.models.fileStatus.PRESENT_UNVERIFIABLE']);
  });

  it('does not send the reader to a screen or an action this build does not have', () => {
    const dangling = Object.entries(EN_CATALOGUE)
      .filter(([, value]) =>
        /model setup screen|run the benchmark/i.test(value),
      )
      .map(([key]) => key);

    expect(dangling).toEqual([]);
  });
});
