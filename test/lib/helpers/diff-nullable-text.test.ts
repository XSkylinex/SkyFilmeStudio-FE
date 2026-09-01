import { diffNullableText } from '@/lib/helpers/diff-nullable-text';

describe('diffNullableText', () => {
  it('omits the key when the field was never touched', () => {
    expect(diffNullableText('PHOTOREAL', 'PHOTOREAL')).toBeUndefined();
  });

  it('omits the key when an unset field stays empty', () => {
    expect(diffNullableText('', undefined)).toBeUndefined();
  });

  it('sends null when a set field is cleared, never an empty string', () => {
    expect(diffNullableText('', 'PHOTOREAL')).toBeNull();
  });

  it('sends the new value when it was changed to something else', () => {
    expect(diffNullableText('STYLISED', 'PHOTOREAL')).toBe('STYLISED');
  });

  it('sends the new value when an unset field is set for the first time', () => {
    expect(diffNullableText('PHOTOREAL', undefined)).toBe('PHOTOREAL');
  });
});
