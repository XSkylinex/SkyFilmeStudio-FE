import { formatShortcutKey } from '@/shell/keyboard/helpers/format-shortcut-key';

describe('formatShortcutKey', () => {
  it('renders arrow keys as arrow glyphs', () => {
    expect(formatShortcutKey('ArrowLeft')).toBe('\u2190');
    expect(formatShortcutKey('ArrowRight')).toBe('\u2192');
  });

  it('passes an already-readable key straight through', () => {
    expect(formatShortcutKey('a')).toBe('a');
    expect(formatShortcutKey('?')).toBe('?');
  });

  it('leaves the space key alone, because its name is a word to translate', () => {
    expect(formatShortcutKey(' ')).toBe(' ');
  });
});
