import type { FC } from 'react';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { Badge } from '@/lib/components/badge';
import { ProgressBar } from '@/lib/components/progress-bar';
import { Skeleton } from '@/lib/components/skeleton';
import './design-system-preview.css';

interface StatePreviewEntry {
  readonly label: string;
  readonly tone: StatusTone;
}

const TONE_SHOWCASE: readonly StatePreviewEntry[] = [
  { label: 'Neutral', tone: STATUS_TONE.NEUTRAL },
  { label: 'Ready', tone: STATUS_TONE.READY },
  { label: 'Checking', tone: STATUS_TONE.CHECKING },
  { label: 'Active', tone: STATUS_TONE.ACTIVE },
  { label: 'Processing', tone: STATUS_TONE.PROCESSING },
  { label: 'Success', tone: STATUS_TONE.SUCCESS },
  { label: 'Warning', tone: STATUS_TONE.WARNING },
  { label: 'Danger', tone: STATUS_TONE.DANGER },
  { label: 'Stale', tone: STATUS_TONE.STALE },
  { label: 'Attention', tone: STATUS_TONE.ATTENTION },
];

const JOB_STATE_PREVIEW: readonly StatePreviewEntry[] = [
  { label: 'PENDING', tone: STATUS_TONE.NEUTRAL },
  { label: 'CLAIMED', tone: STATUS_TONE.NEUTRAL },
  { label: 'PREPARING', tone: STATUS_TONE.NEUTRAL },
  { label: 'SUBMITTED', tone: STATUS_TONE.NEUTRAL },
  { label: 'RUNNING', tone: STATUS_TONE.ACTIVE },
  { label: 'POST_PROCESSING', tone: STATUS_TONE.PROCESSING },
  { label: 'VALIDATING', tone: STATUS_TONE.CHECKING },
  { label: 'SUCCEEDED', tone: STATUS_TONE.SUCCESS },
  { label: 'FAILED_RETRYABLE', tone: STATUS_TONE.WARNING },
  { label: 'FAILED_FINAL', tone: STATUS_TONE.DANGER },
  { label: 'CANCELLED', tone: STATUS_TONE.NEUTRAL },
  { label: 'STALE', tone: STATUS_TONE.STALE },
];

const SHOT_STATE_PREVIEW: readonly StatePreviewEntry[] = [
  { label: 'PLANNED', tone: STATUS_TONE.NEUTRAL },
  { label: 'STORYBOARD_PENDING', tone: STATUS_TONE.NEUTRAL },
  { label: 'STORYBOARD_READY', tone: STATUS_TONE.READY },
  { label: 'STORYBOARD_APPROVED', tone: STATUS_TONE.SUCCESS },
  { label: 'AUDIO_PENDING', tone: STATUS_TONE.NEUTRAL },
  { label: 'AUDIO_READY', tone: STATUS_TONE.READY },
  { label: 'VIDEO_PENDING', tone: STATUS_TONE.NEUTRAL },
  { label: 'VIDEO_RENDERING', tone: STATUS_TONE.ACTIVE },
  { label: 'VIDEO_READY', tone: STATUS_TONE.READY },
  { label: 'AUTO_QC', tone: STATUS_TONE.CHECKING },
  { label: 'MANUAL_REVIEW', tone: STATUS_TONE.ATTENTION },
  { label: 'APPROVED', tone: STATUS_TONE.SUCCESS },
  { label: 'REJECTED', tone: STATUS_TONE.WARNING },
  { label: 'RENDER_FAILED', tone: STATUS_TONE.DANGER },
  { label: 'ASSEMBLED', tone: STATUS_TONE.SUCCESS },
];

const PROGRESS_BAR_PREVIEW_VALUES = [0, 40, 100];

export const DesignSystemPreview: FC = () => (
  <main className="design-system-preview">
    <h1>Design system preview</h1>

    <section className="design-system-preview__section">
      <h2>Tones</h2>
      <div className="design-system-preview__grid">
        {TONE_SHOWCASE.map((entry) => (
          <Badge key={entry.label} tone={entry.tone} label={entry.label} />
        ))}
      </div>
    </section>

    <section className="design-system-preview__section">
      <h2>Job states</h2>
      <div className="design-system-preview__grid">
        {JOB_STATE_PREVIEW.map((entry) => (
          <Badge key={entry.label} tone={entry.tone} label={entry.label} />
        ))}
      </div>
    </section>

    <section className="design-system-preview__section">
      <h2>Shot states</h2>
      <div className="design-system-preview__grid">
        {SHOT_STATE_PREVIEW.map((entry) => (
          <Badge key={entry.label} tone={entry.tone} label={entry.label} />
        ))}
      </div>
    </section>

    <section className="design-system-preview__section">
      <h2>Progress bar</h2>
      <div className="design-system-preview__grid">
        {PROGRESS_BAR_PREVIEW_VALUES.map((value) => (
          <ProgressBar
            key={value}
            tone={STATUS_TONE.ACTIVE}
            indeterminate={false}
            value={value}
          />
        ))}
        <ProgressBar tone={STATUS_TONE.ACTIVE} indeterminate />
      </div>
    </section>

    <section className="design-system-preview__section">
      <h2>Skeleton</h2>
      <div className="design-system-preview__grid">
        <Skeleton shape="text" />
        <Skeleton shape="circle" />
        <Skeleton shape="rect" />
      </div>
    </section>
  </main>
);
