import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { createStore } from '@/shell/store';
import { interfaceLanguageSet } from '@/shell/shell.slice';
import { KeyboardShortcutsProvider } from '@/shell/keyboard/keyboard-shortcuts-provider';
import { ShortcutsHelpButton } from '@/shell/keyboard/shortcuts-help-button';
import { characterShortcutsEnabledSet } from '@/shell/shell.slice';

const openHelpIn = async (language: 'en' | 'he'): Promise<void> => {
  const store = createStore();
  store.dispatch(interfaceLanguageSet(language));
  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <KeyboardShortcutsProvider>
        <p>shell</p>
      </KeyboardShortcutsProvider>
    </Provider>,
  );

  await user.keyboard('?');
};

describe('ShortcutsHelp', () => {
  it('lists every shortcut in English', async () => {
    await openHelpIn('en');

    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
    expect(screen.getByText(/Go to the next shot/)).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
  });

  it('lists every shortcut in Hebrew, key names included', async () => {
    await openHelpIn('he');

    expect(screen.getByText('קיצורי מקלדת')).toBeInTheDocument();
    expect(screen.getByText(/מעבר לשוט הבא/)).toBeInTheDocument();
    expect(screen.getByText('רווח')).toBeInTheDocument();
    expect(screen.queryByText('Keyboard shortcuts')).not.toBeInTheDocument();
  });

  it('keeps a literal key glyph in its own direction, but not a translated key name', async () => {
    await openHelpIn('he');

    expect(screen.getByText('a').closest('strong')).toHaveAttribute(
      'dir',
      'ltr',
    );
    expect(screen.getByText('רווח').closest('strong')).not.toHaveAttribute(
      'dir',
    );
  });
  it('is still reachable by button once single-key shortcuts are off', async () => {
    const store = createStore();
    store.dispatch(characterShortcutsEnabledSet(false));
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <KeyboardShortcutsProvider>
          <ShortcutsHelpButton />
        </KeyboardShortcutsProvider>
      </Provider>,
    );

    await user.keyboard('?');
    expect(screen.queryByText('Go to the next shot')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Keyboard shortcuts' }),
    );

    expect(screen.getByText(/Go to the next shot/)).toBeInTheDocument();
  });
});
