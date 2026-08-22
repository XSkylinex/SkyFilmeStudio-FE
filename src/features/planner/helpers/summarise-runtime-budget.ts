import {
  RUNTIME_VERDICT,
  type RuntimeBudgetReport,
  type RuntimeSegmentShare,
} from 'sky-filme-studio-be/contracts';
import type { RuntimeBudgetSummary } from '@/features/planner/interfaces/runtime-budget-summary';

const isBelowMean =
  (mean: number) =>
  (segment: RuntimeSegmentShare): boolean =>
    segment.targetDurationSeconds < mean;

const isAboveMean =
  (mean: number) =>
  (segment: RuntimeSegmentShare): boolean =>
    segment.targetDurationSeconds > mean;

export const summariseRuntimeBudget = (
  report: RuntimeBudgetReport,
): RuntimeBudgetSummary => {
  const plannedSegments = report.segments.filter((segment) => !segment.reused);
  const reusedSegments = report.segments.filter((segment) => segment.reused);
  const meanPlannedSeconds =
    plannedSegments.length === 0
      ? 0
      : report.plannedSeconds / plannedSegments.length;

  const offMean =
    report.verdict === RUNTIME_VERDICT.SHORT
      ? plannedSegments.filter(isBelowMean(meanPlannedSeconds))
      : report.verdict === RUNTIME_VERDICT.LONG
        ? plannedSegments.filter(isAboveMean(meanPlannedSeconds))
        : [];

  return {
    plannedSegments,
    reusedSegments,
    meanPlannedSeconds,
    offMeanSegments: offMean,
    perSegmentVarianceSeconds:
      plannedSegments.length === 0
        ? 0
        : Math.abs(report.varianceSeconds) / plannedSegments.length,
  };
};
