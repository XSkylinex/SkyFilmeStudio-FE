import { screen } from '@testing-library/react';
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
        onApprove={handleApprove}
        onReject={handleReject}
        regenerationModes={[]}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Approve' }));

    expect(handleApprove).toHaveBeenCalledOnce();
    expect(handleReject).not.toHaveBeenCalled();
  });

  it('calls onReject, and only onReject, when Reject is clicked', async () => {
    const user = userEvent.setup();
    const handleApprove = vi.fn<() => void>();
    const handleReject = vi.fn<() => void>();
    renderInStore(
      <ApprovalControls
        onApprove={handleApprove}
        onReject={handleReject}
        regenerationModes={[]}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Reject' }));

    expect(handleReject).toHaveBeenCalledOnce();
    expect(handleApprove).not.toHaveBeenCalled();
  });

  it('leaves every control exactly as disabled as it was before the click, since only the server may change that', async () => {
    const user = userEvent.setup();
    renderInStore(
      <ApprovalControls
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

    await user.click(screen.getByRole('button', { name: 'Approve' }));

    const after = screen
      .getAllByRole('button')
      .map((button) => button.hasAttribute('disabled'));
    expect(after).toEqual(before);
    expect(after.every((disabled) => !disabled)).toBe(true);
  });

  it('disables every control, decision and regeneration alike, while pending', () => {
    renderInStore(
      <ApprovalControls
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
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={noop}
        pending={false}
        decided
      />,
    );

    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeDisabled();
    REGENERATION_MODES.forEach((mode) => {
      expect(
        screen.getByRole('button', { name: mode.label }),
      ).not.toBeDisabled();
    });
  });

  it('renders one control per regeneration mode, each with its own accessible name', () => {
    renderInStore(
      <ApprovalControls
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
        (mode) => screen.getByRole('button', { name: mode.label }).textContent,
      ),
    );
    expect(names.size).toBe(REGENERATION_MODES.length);
  });

  it('names exactly which mode ran when a regeneration control is clicked', async () => {
    const user = userEvent.setup();
    const handleRegenerate = vi.fn<(modeId: string) => void>();
    renderInStore(
      <ApprovalControls
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={handleRegenerate}
        pending={false}
        decided={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Retake region' }));

    expect(handleRegenerate).toHaveBeenCalledExactlyOnceWith('RETAKE_REGION');
  });

  it('renders no regeneration control at all when there are no modes, never a fallback Retry', () => {
    renderInStore(
      <ApprovalControls
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
        onApprove={noop}
        onReject={noop}
        regenerationModes={REGENERATION_MODES}
        onRegenerate={noop}
        pending={false}
        decided={false}
      />,
    );

    const control = screen.getByRole('button', { name: 'Retake region' });
    const describedBy = control.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Re-renders only the masked area',
    );
  });
});
