import type { FC } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyboardShortcutsProvider } from '@/shell/keyboard/keyboard-shortcuts-provider';
import { useKeyboardShortcut } from '@/shell/keyboard/use-keyboard-shortcut';

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

const ApproveProbe: FC<{ onApprove: () => void }> = ({ onApprove }) => {
  useKeyboardShortcut('approve', onApprove);
  return <p>approve probe mounted</p>;
};

describe('KeyboardShortcutsProvider + useKeyboardShortcut', () => {
  it('calls the registered handler when its key is pressed', async () => {
    const handleApprove = vi.fn<() => void>();
    const user = userEvent.setup();
    render(
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
    render(
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
    render(
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
    render(
      <KeyboardShortcutsProvider>
        <ApproveProbe onApprove={handleApprove} />
      </KeyboardShortcutsProvider>,
    );

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }),
    );

    expect(handleApprove).not.toHaveBeenCalled();
  });

  it('opens a keyboard-shortcuts help dialog listing every registered shortcut on "?"', async () => {
    const user = userEvent.setup();
    render(
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
});
