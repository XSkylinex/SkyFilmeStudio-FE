import { formatShortcutKey } from '@/shell/keyboard/helpers/format-shortcut-key';

describe('formatShortcutKey', () => {
  it('renders the space key as the word "Space", not a blank string', () => {
    expect(formatShortcutKey(' ')).toBe('Space');
  });

  it('renders arrow keys as arrow glyphs', () => {
    expect(formatShortcutKey('ArrowLeft')).toBe('←');
    expect(formatShortcutKey('ArrowRight')).toBe('→');
  });

  it('passes an already-readable key straight through', () => {
    expect(formatShortcutKey('a')).toBe('a');
    expect(formatShortcutKey('?')).toBe('?');
  });
});
