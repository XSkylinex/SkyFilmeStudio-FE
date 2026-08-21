import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '@/shell/store';
import { interfaceLanguageSet } from '@/shell/shell.slice';
import { renderInStore } from '../../../render-in-store';
import userEvent from '@testing-library/user-event';
import { ApprovalControls } from '@/lib/components/approval-controls';
import type { RegenerationModeOption } from '@/lib/components/approval-controls/approval-controls.interface';

const REGENERATION_MODES: RegenerationModeOption[] = [
  {
    id: 'EXACT_REPLAY',
    label: 'Exact replay',
    description: 'Same seed, same prompt, byte-identical render.',
  },
  {
    id: 'SAME_PROMPT_NEW_SEED',
    label: 'Same prompt, new seed',
    description: 'Keeps the prompt and draws a new seed.',
  },
  {
    id: 'CONTROLLED_PROMPT_REVISION',
    label: 'Controlled prompt revision',
    description: 'Edits the prompt while keeping the locked subject.',
  },
  {
    id: 'NEW_KEYFRAME',
    label: 'New keyframe',
    description: 'Starts over from a fresh keyframe.',
  },
  {
    id: 'RETAKE_REGION',
    label: 'Retake region',
    description: 'Re-renders only the masked area.',
  },
];

const noop = (): void => {};

describe('ApprovalControls', () => {
  it('calls onApprove, and only onApprove, when Approve is clicked', async () => {
    const user = userEvent.setup();
    const handleApprove = vi.fn<() => void>();
    const handleReject = vi.fn<() => void>();
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={handleApprove}
        onReject={handleReject}
        regenerationModes={[]}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Approve Shot 12 of scene 3' }),
    );

    expect(handleApprove).toHaveBeenCalledOnce();
    expect(handleReject).not.toHaveBeenCalled();
  });

  it('calls onReject, and only onReject, when Reject is clicked', async () => {
    const user = userEvent.setup();
    const handleApprove = vi.fn<() => void>();
    const handleReject = vi.fn<() => void>();
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={handleApprove}
        onReject={handleReject}
        regenerationModes={[]}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Reject Shot 12 of scene 3' }),
    );

    expect(handleReject).toHaveBeenCalledOnce();
    expect(handleApprove).not.toHaveBeenCalled();
  });

  it('leaves every control exactly as disabled as it was before the click, since only the server may change that', async () => {
    const user = userEvent.setup();
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );
    const before = screen
      .getAllByRole('button')
      .map((button) => button.hasAttribute('disabled'));

    await user.click(
      screen.getByRole('button', { name: 'Approve Shot 12 of scene 3' }),
    );

    const after = screen
      .getAllByRole('button')
      .map((button) => button.hasAttribute('disabled'));
    expect(after).toEqual(before);
    expect(after.every((disabled) => !disabled)).toBe(true);
  });

  it('disables every control, decision and regeneration alike, while pending', () => {
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={noop}
        pending
        decided={false}
      />,
    );

    screen.getAllByRole('button').forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('disables only the decision once the shot is decided, leaving regeneration open', () => {
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={noop}
        pending={false}
        decided
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Approve Shot 12 of scene 3' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Reject Shot 12 of scene 3' }),
    ).toBeDisabled();
    REGENERATION_MODES.forEach((mode) => {
      expect(
        screen.getByRole('button', {
          name: `${mode.label} for Shot 12 of scene 3`,
        }),
      ).not.toBeDisabled();
    });
  });

  it('renders one control per regeneration mode, each with its own accessible name', () => {
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );

    const names = new Set(
      REGENERATION_MODES.map(
        (mode) =>
          screen.getByRole('button', {
            name: `${mode.label} for Shot 12 of scene 3`,
          }).textContent,
      ),
    );
    expect(names.size).toBe(REGENERATION_MODES.length);
  });

  it('names exactly which mode ran when a regeneration control is clicked', async () => {
    const user = userEvent.setup();
    const handleRegenerate = vi.fn<(modeId: string) => void>();
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={handleRegenerate}
        pending={false}
        decided={false}
      />,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Retake region for Shot 12 of scene 3',
      }),
    );

    expect(handleRegenerate).toHaveBeenCalledExactlyOnceWith('RETAKE_REGION');
  });

  it('renders no regeneration control at all when there are no modes, never a fallback Retry', () => {
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={noop}
        onReject={noop}
        regenerationModes={[]}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.queryByText(/retry/i)).not.toBeInTheDocument();
  });

  it('exposes each mode description as the accessible description, kept apart from the name', () => {
    renderInStore(
      <ApprovalControls
        contextLabel="Shot 12 of scene 3"
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );

    const control = screen.getByRole('button', {
      name: 'Retake region for Shot 12 of scene 3',
    });
    const describedBy = control.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Re-renders only the masked area',
    );
  });
  it('takes its own verbs from the catalogue, so a Hebrew UI does not keep English buttons', () => {
    const store = createStore();
    store.dispatch(interfaceLanguageSet('he'));

    render(
      <Provider store={store}>
        <ApprovalControls
          contextLabel="Shot 12 of scene 3"
          onApprove={noop}
          onReject={noop}
          regenerationModes={[]}
          onRegenerate={noop}
          pending={false}
          decided={false}
        />
      </Provider>,
    );

    expect(
      screen.getByRole('button', { name: 'אשר Shot 12 of scene 3' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'דחה Shot 12 of scene 3' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Approve Shot 12 of scene 3' }),
    ).not.toBeInTheDocument();
  });
  it('keeps two controls on one page apart, which is the whole point of the context', () => {
    renderInStore(
      <>
        <ApprovalControls
          contextLabel="Shot 12 of scene 3"
          onApprove={noop}
          onReject={noop}
          regenerationModes={[]}
          onRegenerate={noop}
          pending={false}
          decided={false}
        />
        <ApprovalControls
          contextLabel="Shot 13 of scene 3"
          onApprove={noop}
          onReject={noop}
          regenerationModes={[]}
          onRegenerate={noop}
          pending={false}
          decided={false}
        />
      </>,
    );

    expect(
      screen.getByRole('button', { name: 'Approve Shot 12 of scene 3' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Approve Shot 13 of scene 3' }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'Approve' })).toHaveLength(
      0,
    );
  });
});
