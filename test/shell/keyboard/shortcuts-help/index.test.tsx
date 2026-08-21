import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { createStore } from '@/shell/store';
import { interfaceLanguageSet } from '@/shell/shell.slice';
import { KeyboardShortcutsProvider } from '@/shell/keyboard/keyboard-shortcuts-provider';

beforeAll(() => {
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function (
      this: HTMLDialogElement,
    ): void {
      this.open = true;
    };
  }
  if (typeof HTMLDialogElement.prototype.close !== 'function') {
    HTMLDialogElement.prototype.close = function (
      this: HTMLDialogElement,
    ): void {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  }
});

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
});
