import { isCharacterKey } from '@/shell/keyboard/helpers/is-character-key';

describe('isCharacterKey', () => {
  it('counts the keys WCAG 2.1.4 is about — letters, punctuation and space', () => {
    expect(isCharacterKey('a')).toBe(true);
    expect(isCharacterKey('r')).toBe(true);
    expect(isCharacterKey('?')).toBe(true);
    expect(isCharacterKey(' ')).toBe(true);
  });

  it('leaves navigation keys out, which the criterion exempts', () => {
    expect(isCharacterKey('ArrowLeft')).toBe(false);
    expect(isCharacterKey('ArrowRight')).toBe(false);
    expect(isCharacterKey('Escape')).toBe(false);
  });
});
