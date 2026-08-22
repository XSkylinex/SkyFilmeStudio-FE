import { runtimeBudgetReportSchema } from 'sky-filme-studio-be/contracts';
import type {
  RuntimeBudgetReport,
  RuntimeSegmentShare,
} from 'sky-filme-studio-be/contracts';

export interface SegmentSeed {
  label: string;
  targetDurationSeconds: number;
  reused?: boolean;
}

const share = (
  seed: SegmentSeed,
  order: number,
  targetRuntimeSeconds: number,
): RuntimeSegmentShare => ({
  order,
  label: seed.label,
  targetDurationSeconds: seed.targetDurationSeconds,
  reused: seed.reused ?? false,
  shareOfTarget:
    targetRuntimeSeconds === 0
      ? 0
      : seed.targetDurationSeconds / targetRuntimeSeconds,
});

export interface BudgetSeed {
  targetRuntimeSeconds?: number;
  toleranceSeconds?: number;
  segments: SegmentSeed[];
  detail?: string;
}

export const buildRuntimeBudgetReport = (
  seed: BudgetSeed,
): RuntimeBudgetReport => {
  const targetRuntimeSeconds = seed.targetRuntimeSeconds ?? 1_200;
  const toleranceSeconds = seed.toleranceSeconds ?? 30;
  const segments = seed.segments.map((entry, index) =>
    share(entry, index, targetRuntimeSeconds),
  );
  const total = (reused: boolean): number =>
    segments
      .filter((segment) => segment.reused === reused)
      .reduce((sum, segment) => sum + segment.targetDurationSeconds, 0);

  const plannedSeconds = total(false);
  const reusedSeconds = total(true);
  const totalSeconds = plannedSeconds + reusedSeconds;
  const varianceSeconds = totalSeconds - targetRuntimeSeconds;
  const withinTolerance = Math.abs(varianceSeconds) <= toleranceSeconds;

  return runtimeBudgetReportSchema.parse({
    targetRuntimeSeconds,
    toleranceSeconds,
    plannedSeconds,
    reusedSeconds,
    totalSeconds,
    varianceSeconds,
    withinTolerance,
    verdict: withinTolerance
      ? 'WITHIN_TOLERANCE'
      : varianceSeconds < 0
        ? 'SHORT'
        : 'LONG',
    segments,
    detail: seed.detail ?? 'A server-authored sentence about this plan.',
  });
};
