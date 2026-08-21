import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import userEvent from '@testing-library/user-event';
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
    renderInStore(<DesignSystemPreview />);

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
    expect(screen.getByRole('heading', { name: 'Button' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Icon button' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Field' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Select' })).toBeInTheDocument();
  });

  it('shows every one of the ten presentational tones as its own badge', () => {
    renderInStore(<DesignSystemPreview />);

    TONE_LABELS.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('names all twelve job states from the authority, not a paraphrase', () => {
    renderInStore(<DesignSystemPreview />);

    JOB_STATE_NAMES.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('names all fifteen shot states from the authority', () => {
    renderInStore(<DesignSystemPreview />);

    SHOT_STATE_NAMES.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('never lets an advisory AUTO_QC pass borrow the human-approved tone', () => {
    renderInStore(<DesignSystemPreview />);

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
    const { container } = renderInStore(<DesignSystemPreview />);

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
    const { container } = renderInStore(<DesignSystemPreview />);

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

  it('shows every button variant at both sizes, in full unabbreviated words', () => {
    renderInStore(<DesignSystemPreview />);

    ['Primary', 'Secondary', 'Ghost', 'Danger'].forEach((variant) => {
      ['small', 'medium'].forEach((size) => {
        expect(
          screen.getByRole('button', { name: `${variant} ${size}` }),
        ).toBeInTheDocument();
      });
    });
  });

  it('gives every icon button an accessible name, since the icon itself is decorative', () => {
    const { container } = renderInStore(<DesignSystemPreview />);
    const iconButtons = container.querySelectorAll('[data-shape="icon"]');

    expect(iconButtons.length).toBeGreaterThan(0);
    iconButtons.forEach((iconButton) => {
      expect(iconButton).toHaveAccessibleName();
    });
  });

  it('links the errored field to its error text through aria-describedby', () => {
    renderInStore(<DesignSystemPreview />);

    const seedControl = screen.getByLabelText('Seed');
    expect(seedControl).toHaveAttribute('aria-invalid', 'true');
    const describedBy = seedControl.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Must be a whole number',
    );
  });

  it('links the hinted field to its hint text, not its error, since it has none', () => {
    renderInStore(<DesignSystemPreview />);

    const durationControl = screen.getByLabelText('Duration');
    expect(durationControl).not.toHaveAttribute('aria-invalid');
    const describedBy = durationControl.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Fixture values for this preview, not measured on any hardware profile',
    );
  });

  it('never claims the fixture duration options were measured on real hardware', () => {
    renderInStore(<DesignSystemPreview />);

    expect(screen.queryByText(/^measured/i)).not.toBeInTheDocument();
  });

  it('changes the standalone select value when the user picks a different option', async () => {
    const user = userEvent.setup();
    renderInStore(<DesignSystemPreview />);

    const selects = screen.getAllByRole('combobox');
    const standaloneSelect = selects[selects.length - 1];
    if (!standaloneSelect) {
      throw new Error('expected the standalone select to render');
    }

    await user.selectOptions(standaloneSelect, '8 seconds');
    expect(standaloneSelect).toHaveValue('8');
  });
  it('adds no main landmark of its own, since the app shell owns the only one', () => {
    const { container } = renderInStore(<DesignSystemPreview />);

    expect(container.querySelector('main')).toBeNull();
  });
});
