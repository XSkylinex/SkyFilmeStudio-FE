import type {
  QcCheckId,
  QcCheckOutcome,
  QcOutcome,
  QcRunKind,
  ShotState,
} from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const QC_RUN_KIND_LABEL: Record<QcRunKind, TranslationKey> = {
  TECHNICAL: 'shots.qc.kind.technical',
  SUBJECT_CONSISTENCY: 'shots.qc.kind.subjectConsistency',
  STYLE: 'shots.qc.kind.style',
  AUDIO: 'shots.qc.kind.audio',
  PRODUCTION: 'shots.qc.kind.production',
};

export const QC_OUTCOME_LABEL: Record<QcOutcome, TranslationKey> = {
  PASS: 'shots.qc.outcome.pass',
  WARN: 'shots.qc.outcome.warn',
  FAIL: 'shots.qc.outcome.fail',
  SKIPPED: 'shots.qc.outcome.skipped',
};

export const QC_CHECK_OUTCOME_LABEL: Record<QcCheckOutcome, TranslationKey> = {
  PASS: 'shots.qc.outcome.pass',
  FAIL: 'shots.qc.outcome.fail',
  SKIPPED: 'shots.qc.outcome.skipped',
};

export const QC_CHECK_ID_LABEL: Record<QcCheckId, TranslationKey> = {
  FILE_EXISTS: 'shots.qc.check.fileExists',
  CONTAINER_DECODES: 'shots.qc.check.containerDecodes',
  EXPECTED_VIDEO_STREAM_EXISTS: 'shots.qc.check.videoStream',
  DIMENSIONS_MATCH_PROFILE: 'shots.qc.check.dimensions',
  FPS_VALID: 'shots.qc.check.fpsValid',
  DURATION_WITHIN_TOLERANCE: 'shots.qc.check.duration',
  NO_ZERO_BYTE_STREAM: 'shots.qc.check.noZeroByteStream',
  AUDIO_STREAM_PRESENT_WHEN_REQUIRED: 'shots.qc.check.audioWhenRequired',
  FINAL_RUNTIME_WITHIN_TOLERANCE: 'shots.qc.check.finalRuntime',
  RESOLUTION_1920X1080: 'shots.qc.check.resolution1080',
  FPS_24: 'shots.qc.check.fps24',
  AUDIO_PRESENT: 'shots.qc.check.audioPresent',
  AUDIO_48KHZ_STEREO: 'shots.qc.check.audio48kStereo',
  SUBTITLES_PRESENT_IF_ENABLED: 'shots.qc.check.subtitles',
  NO_MISSING_TIMELINE_ASSET: 'shots.qc.check.noMissingAsset',
  NO_BLACK_OR_MISSING_SEGMENT: 'shots.qc.check.noBlackSegment',
};

export const REVIEWABLE_SHOT_STATES: readonly ShotState[] = [
  'VIDEO_READY',
  'AUTO_QC',
];

export const AWAITING_REVIEW_STATES: readonly ShotState[] = [
  'VIDEO_READY',
  'AUTO_QC',
  'MANUAL_REVIEW',
];
