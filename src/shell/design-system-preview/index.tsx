import type { FC } from 'react';
import { useState } from 'react';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import type { ButtonSize } from '@/lib/interfaces/button-size';
import type { ButtonVariant } from '@/lib/interfaces/button-variant';
import type { MediaRatio } from '@/lib/components/media-tile/media-tile.interface';
import type { RegenerationModeOption } from '@/lib/components/approval-controls/approval-controls.interface';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { Badge } from '@/lib/components/badge';
import { ProgressBar } from '@/lib/components/progress-bar';
import { Skeleton } from '@/lib/components/skeleton';
import { Button } from '@/lib/components/button';
import { IconButton } from '@/lib/components/icon-button';
import { Field } from '@/lib/components/field';
import { Select } from '@/lib/components/select';
import { Input } from '@/lib/components/input';
import { Icon } from '@/lib/components/icon';
import { Dialog } from '@/lib/components/dialog';
import { Tooltip } from '@/lib/components/tooltip';
import { Toast } from '@/lib/components/toast';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { MediaTile } from '@/lib/components/media-tile';
import { ApprovalControls } from '@/lib/components/approval-controls';
import './design-system-preview.css';

interface StatePreviewEntry {
  readonly label: string;
  readonly tone: StatusTone;
}

interface ButtonShowcaseEntry {
  readonly variant: ButtonVariant;
  readonly size: ButtonSize;
  readonly label: string;
}

interface IconButtonShowcaseEntry {
  readonly variant: ButtonVariant;
  readonly label: string;
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

const BUTTON_SHOWCASE: readonly ButtonShowcaseEntry[] = [
  { variant: 'primary', size: 'sm', label: 'Primary small' },
  { variant: 'primary', size: 'md', label: 'Primary medium' },
  { variant: 'secondary', size: 'sm', label: 'Secondary small' },
  { variant: 'secondary', size: 'md', label: 'Secondary medium' },
  { variant: 'ghost', size: 'sm', label: 'Ghost small' },
  { variant: 'ghost', size: 'md', label: 'Ghost medium' },
  { variant: 'danger', size: 'sm', label: 'Danger small' },
  { variant: 'danger', size: 'md', label: 'Danger medium' },
];

const ICON_BUTTON_SHOWCASE: readonly IconButtonShowcaseEntry[] = [
  { variant: 'primary', label: 'Approve' },
  { variant: 'secondary', label: 'Retake' },
  { variant: 'ghost', label: 'Cancel' },
  { variant: 'danger', label: 'Reject' },
];

const FIXTURE_DURATION_DEFAULT_VALUE = '4';

const FIXTURE_DURATION_OPTIONS = [
  { value: FIXTURE_DURATION_DEFAULT_VALUE, label: '4 seconds' },
  { value: '8', label: '8 seconds' },
];

interface MediaTileShowcaseEntry {
  readonly ratio: MediaRatio;
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
}

const MEDIA_TILE_RATIO_SHOWCASE: readonly MediaTileShowcaseEntry[] = [
  {
    ratio: '16:9',
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOwSpgHAAIQATlADQkMAAAAAElFTkSuQmCC',
    alt: 'Wide keyframe candidate',
    caption: '16:9 keyframe',
  },
  {
    ratio: '9:16',
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOo8psHAAKsAWcjeUVtAAAAAElFTkSuQmCC',
    alt: 'Tall keyframe candidate',
    caption: '9:16 keyframe',
  },
  {
    ratio: '1:1',
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNw66kAAAJmAUtjS3f6AAAAAElFTkSuQmCC',
    alt: 'Square keyframe candidate',
    caption: '1:1 keyframe',
  },
];

const REGENERATION_MODE_SHOWCASE: RegenerationModeOption[] = [
  {
    id: 'EXACT_REPLAY',
    label: 'Exact replay',
    description:
      'Same seed, same prompt: reproduces the previous render exactly.',
  },
  {
    id: 'SAME_PROMPT_NEW_SEED',
    label: 'Same prompt, new seed',
    description: 'Keeps the prompt and draws a new seed for a fresh variation.',
  },
  {
    id: 'CONTROLLED_PROMPT_REVISION',
    label: 'Controlled prompt revision',
    description: 'Edits the prompt while keeping the locked subject reference.',
  },
  {
    id: 'NEW_KEYFRAME',
    label: 'New keyframe',
    description: 'Starts over from a freshly generated keyframe.',
  },
  {
    id: 'RETAKE_REGION',
    label: 'Retake region',
    description: 'Re-renders only the masked region of the shot.',
  },
];

const handleToastDismiss = (): void => {};
const handleApprovalControlsAction = (): void => {};

export const DesignSystemPreview: FC = () => {
  const [durationValue, setDurationValue] = useState(
    FIXTURE_DURATION_DEFAULT_VALUE,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="design-system-preview">
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
              label={`Fixture render progress, ${value}%`}
              tone={STATUS_TONE.ACTIVE}
              indeterminate={false}
              value={value}
            />
          ))}
          <ProgressBar
            label="Fixture render progress, still preparing"
            tone={STATUS_TONE.ACTIVE}
            indeterminate
          />
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

      <section className="design-system-preview__section">
        <h2>Button</h2>
        <div className="design-system-preview__grid">
          {BUTTON_SHOWCASE.map((entry) => (
            <Button key={entry.label} variant={entry.variant} size={entry.size}>
              {entry.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Icon</h2>
        <div className="design-system-preview__grid">
          <Icon name="close" />
          <Icon name="circle" />
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Icon button</h2>
        <div className="design-system-preview__grid">
          {ICON_BUTTON_SHOWCASE.map((entry) => (
            <IconButton
              key={entry.label}
              variant={entry.variant}
              size="md"
              label={entry.label}
            >
              <Icon name="circle" />
            </IconButton>
          ))}
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Field</h2>
        <div className="design-system-preview__grid">
          <Field
            label="Duration"
            hint="Fixture values for this preview, not measured on any hardware profile"
          >
            <Select
              options={FIXTURE_DURATION_OPTIONS}
              value={durationValue}
              onChange={setDurationValue}
            />
          </Field>
          <Field label="Seed" error="Must be a whole number">
            <Input defaultValue="not a number" />
          </Field>
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Select</h2>
        <div className="design-system-preview__grid">
          <Select
            options={FIXTURE_DURATION_OPTIONS}
            value={durationValue}
            onChange={setDurationValue}
          />
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Dialog</h2>
        <div className="design-system-preview__grid">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setDialogOpen(true)}
          >
            Open dialog
          </Button>
        </div>
        <Dialog
          open={dialogOpen}
          title="Approve this keyframe?"
          onClose={() => setDialogOpen(false)}
          footer={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setDialogOpen(false)}
              >
                Approve
              </Button>
            </>
          }
        >
          <p>
            This keyframe becomes the reference for every later shot in this
            scene.
          </p>
        </Dialog>
      </section>

      <section className="design-system-preview__section">
        <h2>Tooltip</h2>
        <div className="design-system-preview__grid">
          <Tooltip label="Fixture value for this preview, not a measured capability">
            <Button variant="secondary" size="sm">
              Duration: 8s
            </Button>
          </Tooltip>
          <Tooltip label="Re-renders only the masked area">
            <IconButton variant="ghost" size="sm" label="Retake region">
              <Icon name="circle" />
            </IconButton>
          </Tooltip>
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Toast</h2>
        <div className="design-system-preview__grid">
          <Toast tone={STATUS_TONE.NEUTRAL} title="Queued for rendering" />
          <Toast
            tone={STATUS_TONE.SUCCESS}
            title="Shot approved"
            description="Queued for the next scene"
            onDismiss={handleToastDismiss}
          />
          <Toast
            tone={STATUS_TONE.DANGER}
            title="Render failed"
            description="CUDA_OUT_OF_MEMORY"
            onDismiss={handleToastDismiss}
          />
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Empty state</h2>
        <div className="design-system-preview__grid">
          <EmptyState
            title="No shots yet"
            description="Plan a scene to see its shots here."
            action={
              <Button variant="primary" size="sm">
                Plan a scene
              </Button>
            }
          />
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Error state</h2>
        <div className="design-system-preview__grid">
          <ErrorState
            title="Render failed"
            description="The GPU ran out of memory partway through this shot."
            detail="CUDA_OUT_OF_MEMORY"
            action={
              <Button variant="secondary" size="sm">
                Retry with the same seed
              </Button>
            }
          />
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Media tile</h2>
        <div className="design-system-preview__grid">
          {MEDIA_TILE_RATIO_SHOWCASE.map((entry) => (
            <MediaTile
              key={entry.ratio}
              ratio={entry.ratio}
              src={entry.src}
              alt={entry.alt}
              caption={entry.caption}
            />
          ))}
          <MediaTile alt="Shot with no proxy yet" caption="Awaiting render" />
          <MediaTile
            src="data:image/png;base64,broken"
            alt="Shot proxy that failed to decode"
            caption="Decode failed"
          />
        </div>
      </section>

      <section className="design-system-preview__section">
        <h2>Approval controls</h2>
        <div className="design-system-preview__grid">
          <ApprovalControls
            contextLabel="Shot 12 of scene 3"
            onApprove={handleApprovalControlsAction}
            onReject={handleApprovalControlsAction}
            regenerationModes={REGENERATION_MODE_SHOWCASE}
            onRegenerate={handleApprovalControlsAction}
            pending={false}
            decided={false}
          />
          <ApprovalControls
            contextLabel="Shot 13 of scene 3"
            onApprove={handleApprovalControlsAction}
            onReject={handleApprovalControlsAction}
            regenerationModes={REGENERATION_MODE_SHOWCASE}
            onRegenerate={handleApprovalControlsAction}
            pending
            decided={false}
          />
          <ApprovalControls
            contextLabel="Shot 14 of scene 3"
            onApprove={handleApprovalControlsAction}
            onReject={handleApprovalControlsAction}
            regenerationModes={REGENERATION_MODE_SHOWCASE}
            onRegenerate={handleApprovalControlsAction}
            pending={false}
            decided
          />
          <ApprovalControls
            contextLabel="the canonical set for Rivka"
            onApprove={handleApprovalControlsAction}
            regenerationModes={[]}
            onRegenerate={handleApprovalControlsAction}
            pending={false}
            decided={false}
          />
        </div>
      </section>
    </div>
  );
};
