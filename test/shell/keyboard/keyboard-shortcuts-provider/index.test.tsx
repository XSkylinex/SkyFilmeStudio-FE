import type { FC } from 'react';
import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '@/shell/store';
import { characterShortcutsEnabledSet } from '@/shell/shell.slice';
import { KeyboardShortcutsProvider } from '@/shell/keyboard/keyboard-shortcuts-provider';
import { useKeyboardShortcut } from '@/shell/keyboard/use-keyboard-shortcut';

const ApproveProbe: FC<{ onApprove: () => void }> = ({ onApprove }) => {
  useKeyboardShortcut('approve', onApprove);
  return <p>approve probe mounted</p>;
};

describe('KeyboardShortcutsProvider + useKeyboardShortcut', () => {
  it('calls the registered handler when its key is pressed', async () => {
    const handleApprove = vi.fn<() => void>();
    const user = userEvent.setup();
    renderInStore(
      <KeyboardShortcutsProvider>
        <ApproveProbe onApprove={handleApprove} />
      </KeyboardShortcutsProvider>,
    );

    await user.keyboard('a');

    expect(handleApprove).toHaveBeenCalledTimes(1);
  });

  it('does not fire while focus is inside a text input', async () => {
    const handleApprove = vi.fn<() => void>();
    const user = userEvent.setup();
    renderInStore(
      <KeyboardShortcutsProvider>
        <input aria-label="Prompt" />
        <ApproveProbe onApprove={handleApprove} />
      </KeyboardShortcutsProvider>,
    );

    await user.click(screen.getByLabelText('Prompt'));
    await user.keyboard('a');

    expect(handleApprove).not.toHaveBeenCalled();
  });

  it('does not fire while focus is inside a textarea', async () => {
    const handleApprove = vi.fn<() => void>();
    const user = userEvent.setup();
    renderInStore(
      <KeyboardShortcutsProvider>
        <textarea aria-label="Notes" />
        <ApproveProbe onApprove={handleApprove} />
      </KeyboardShortcutsProvider>,
    );

    await user.click(screen.getByLabelText('Notes'));
    await user.keyboard('a');

    expect(handleApprove).not.toHaveBeenCalled();
  });

  it('does not fire when a modifier key is held, so it never hijacks a browser shortcut', () => {
    const handleApprove = vi.fn<() => void>();
    renderInStore(
      <KeyboardShortcutsProvider>
        <ApproveProbe onApprove={handleApprove} />
      </KeyboardShortcutsProvider>,
    );

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }),
    );

    expect(handleApprove).not.toHaveBeenCalled();
  });

  it('does not replay the last keypress to a shortcut consumer that mounts afterwards', async () => {
    const handleApproveFirst = vi.fn<() => void>();
    const handleApproveSecond = vi.fn<() => void>();
    const user = userEvent.setup();

    const { rerender } = renderInStore(
      <KeyboardShortcutsProvider>
        <ApproveProbe onApprove={handleApproveFirst} />
      </KeyboardShortcutsProvider>,
    );

    await user.keyboard('a');

    expect(handleApproveFirst).toHaveBeenCalledTimes(1);

    rerender(
      <KeyboardShortcutsProvider>
        <ApproveProbe onApprove={handleApproveFirst} />
        <ApproveProbe onApprove={handleApproveSecond} />
      </KeyboardShortcutsProvider>,
    );

    expect(handleApproveSecond).not.toHaveBeenCalled();
  });

  it('opens a keyboard-shortcuts help dialog listing every registered shortcut on "?"', async () => {
    const user = userEvent.setup();
    renderInStore(
      <KeyboardShortcutsProvider>
        <p>page content</p>
      </KeyboardShortcutsProvider>,
    );

    expect(
      screen.queryByRole('dialog', { name: 'Keyboard shortcuts' }),
    ).not.toBeInTheDocument();

    await user.keyboard('?');

    expect(
      screen.getByRole('dialog', { name: 'Keyboard shortcuts' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/approve the item in review/i)).toBeInTheDocument();
  });

  it('prevents the browser default for a key it recognises, so Space cannot also scroll or click a focused button', () => {
    renderInStore(
      <KeyboardShortcutsProvider>
        <ApproveProbe onApprove={vi.fn<() => void>()} />
      </KeyboardShortcutsProvider>,
    );

    const event = new KeyboardEvent('keydown', {
      key: 'a',
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('does not let a/r reach the page behind the open shortcuts-help dialog', async () => {
    const handleApprove = vi.fn<() => void>();
    const user = userEvent.setup();
    renderInStore(
      <KeyboardShortcutsProvider>
        <ApproveProbe onApprove={handleApprove} />
      </KeyboardShortcutsProvider>,
    );

    await user.keyboard('?');
    expect(
      screen.getByRole('dialog', { name: 'Keyboard shortcuts' }),
    ).toBeInTheDocument();

    await user.keyboard('a');

    expect(handleApprove).not.toHaveBeenCalled();
  });

  it('does not prevent Space when nothing subscribes to toggle-playback, so the page can still scroll', () => {
    renderInStore(
      <KeyboardShortcutsProvider>
        <p>page content</p>
      </KeyboardShortcutsProvider>,
    );

    const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('does not prevent ArrowRight or "a" when nothing subscribes to either', () => {
    renderInStore(
      <KeyboardShortcutsProvider>
        <p>page content</p>
      </KeyboardShortcutsProvider>,
    );

    const arrowEvent = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      cancelable: true,
    });
    const letterEvent = new KeyboardEvent('keydown', {
      key: 'a',
      cancelable: true,
    });
    window.dispatchEvent(arrowEvent);
    window.dispatchEvent(letterEvent);

    expect(arrowEvent.defaultPrevented).toBe(false);
    expect(letterEvent.defaultPrevented).toBe(false);
  });

  it('does not hijack Space for toggle-playback when a focused button would natively handle it', () => {
    const handleTogglePlayback = vi.fn<() => void>();
    const TogglePlaybackProbe: FC = () => {
      useKeyboardShortcut('toggle-playback', handleTogglePlayback);
      return <button type="button">Play</button>;
    };

    renderInStore(
      <KeyboardShortcutsProvider>
        <TogglePlaybackProbe />
      </KeyboardShortcutsProvider>,
    );

    const button = screen.getByRole('button', { name: 'Play' });
    button.focus();
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      cancelable: true,
      bubbles: true,
    });
    button.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(handleTogglePlayback).not.toHaveBeenCalled();
  });

  it('swaps ArrowRight/ArrowLeft under dir="rtl" so the key still moves in reading order', async () => {
    document.documentElement.dir = 'rtl';
    const handleNext = vi.fn<() => void>();
    const handlePrevious = vi.fn<() => void>();
    const NextPreviousProbe: FC = () => {
      useKeyboardShortcut('next-shot', handleNext);
      useKeyboardShortcut('previous-shot', handlePrevious);
      return null;
    };
    const user = userEvent.setup();

    renderInStore(
      <KeyboardShortcutsProvider>
        <NextPreviousProbe />
      </KeyboardShortcutsProvider>,
    );

    await user.keyboard('{ArrowRight}');

    expect(handlePrevious).toHaveBeenCalledTimes(1);
    expect(handleNext).not.toHaveBeenCalled();

    document.documentElement.dir = 'ltr';
  });

  it('documents the arrow keys in reading order under dir="rtl", matching what they actually dispatch', async () => {
    document.documentElement.dir = 'rtl';
    const user = userEvent.setup();
    renderInStore(
      <KeyboardShortcutsProvider>
        <p>page content</p>
      </KeyboardShortcutsProvider>,
    );

    await user.keyboard('?');

    const rightArrowRow = screen.getByText('→').closest('li');
    const leftArrowRow = screen.getByText('←').closest('li');

    expect(rightArrowRow).toHaveTextContent('Go to the previous shot');
    expect(leftArrowRow).toHaveTextContent('Go to the next shot');

    document.documentElement.dir = 'ltr';
  });
  it('stops answering single-key shortcuts once the reader turns them off', async () => {
    const handleApprove = vi.fn<() => void>();
    const user = userEvent.setup();
    const store = createStore();
    store.dispatch(characterShortcutsEnabledSet(false));

    render(
      <Provider store={store}>
        <KeyboardShortcutsProvider>
          <ApproveProbe onApprove={handleApprove} />
        </KeyboardShortcutsProvider>
      </Provider>,
    );

    await user.keyboard('a');

    expect(handleApprove).not.toHaveBeenCalled();
  });

  it('keeps arrow shortcuts working when single keys are off, since the criterion exempts them', async () => {
    const handleNext = vi.fn<() => void>();
    const user = userEvent.setup();
    const store = createStore();
    store.dispatch(characterShortcutsEnabledSet(false));

    const NextProbe: FC = () => {
      useKeyboardShortcut('next-shot', handleNext);
      return <p>next probe mounted</p>;
    };

    render(
      <Provider store={store}>
        <KeyboardShortcutsProvider>
          <NextProbe />
        </KeyboardShortcutsProvider>
      </Provider>,
    );

    await user.keyboard('{ArrowRight}');

    expect(handleNext).toHaveBeenCalledOnce();
  });
});
