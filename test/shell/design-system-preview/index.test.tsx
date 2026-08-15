import { render, screen } from '@testing-library/react';
import { DesignSystemPreview } from '@/shell/design-system-preview';

const TONE_LABELS = [
  'Neutral',
  'Ready',
  'Checking',
  'Active',
  'Processing',
  'Success',
  'Warning',
  'Danger',
  'Stale',
  'Attention',
];

const JOB_STATE_NAMES = [
  'PENDING',
  'CLAIMED',
  'PREPARING',
  'SUBMITTED',
  'RUNNING',
  'POST_PROCESSING',
  'VALIDATING',
  'SUCCEEDED',
  'FAILED_RETRYABLE',
  'FAILED_FINAL',
  'CANCELLED',
  'STALE',
];

const SHOT_STATE_NAMES = [
  'PLANNED',
  'STORYBOARD_PENDING',
  'STORYBOARD_READY',
  'STORYBOARD_APPROVED',
  'AUDIO_PENDING',
  'AUDIO_READY',
  'VIDEO_PENDING',
  'VIDEO_RENDERING',
  'VIDEO_READY',
  'AUTO_QC',
  'MANUAL_REVIEW',
  'APPROVED',
  'REJECTED',
  'RENDER_FAILED',
  'ASSEMBLED',
];

describe('DesignSystemPreview', () => {
  it('groups the gallery under readable headings', () => {
    render(<DesignSystemPreview />);

    expect(screen.getByRole('heading', { name: 'Tones' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Job states' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Shot states' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Progress bar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Skeleton' }),
    ).toBeInTheDocument();
  });

  it('shows every one of the ten presentational tones as its own badge', () => {
    render(<DesignSystemPreview />);

    TONE_LABELS.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('names all twelve job states from the authority, not a paraphrase', () => {
    render(<DesignSystemPreview />);

    JOB_STATE_NAMES.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('names all fifteen shot states from the authority', () => {
    render(<DesignSystemPreview />);

    SHOT_STATE_NAMES.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('never lets an advisory AUTO_QC pass borrow the human-approved tone', () => {
    render(<DesignSystemPreview />);

    const autoQcTone = screen
      .getByText('AUTO_QC')
      .closest('.badge')
      ?.getAttribute('data-tone');
    const approvedTone = screen
      .getByText('APPROVED')
      .closest('.badge')
      ?.getAttribute('data-tone');

    expect(autoQcTone).toBe('checking');
    expect(approvedTone).toBe('success');
    expect(autoQcTone).not.toBe(approvedTone);
  });

  it('renders determinate progress bars at several values and one indeterminate bar', () => {
    const { container } = render(<DesignSystemPreview />);

    const determinate = container.querySelectorAll(
      '.progress-bar[aria-valuenow]',
    );
    const indeterminate = container.querySelectorAll(
      '.progress-bar[data-indeterminate="true"]',
    );

    expect(determinate.length).toBeGreaterThan(1);
    expect(indeterminate).toHaveLength(1);
  });

  it('renders a skeleton in every shape', () => {
    const { container } = render(<DesignSystemPreview />);

    expect(
      container.querySelector('.skeleton[data-shape="text"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.skeleton[data-shape="circle"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.skeleton[data-shape="rect"]'),
    ).toBeInTheDocument();
  });
});
