import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';

describe('invalidFieldCount', () => {
  it('counts a flat form field by field', () => {
    expect(
      invalidFieldCount({ title: 'form.invalid.required', kind: 'x' }),
    ).toBe(2);
  });

  it('counts a nested path once, not once per prefix', () => {
    expect(
      invalidFieldCount({
        audio: 'form.invalid.value',
        'audio.languages': 'form.invalid.value',
        'audio.languages.0': 'form.invalid.value',
      }),
    ).toBe(1);
  });

  it('counts two bad lines in one box as one field', () => {
    expect(
      invalidFieldCount({
        audio: 'x',
        'audio.languages': 'x',
        'audio.languages.0': 'x',
        'audio.languages.2': 'x',
      }),
    ).toBe(1);
  });

  it('counts the same field in two list entries as two', () => {
    expect(
      invalidFieldCount({
        subjectRules: 'x',
        'subjectRules.0': 'x',
        'subjectRules.0.subjectId': 'x',
        'subjectRules.1': 'x',
        'subjectRules.1.subjectId': 'x',
      }),
    ).toBe(2);
  });

  it('is zero for no errors', () => {
    expect(invalidFieldCount({})).toBe(0);
  });
});
