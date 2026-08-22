import type { RuntimeSegmentShare } from 'sky-filme-studio-be/contracts';

export interface RuntimeBudgetSummary {
  plannedSegments: readonly RuntimeSegmentShare[];
  reusedSegments: readonly RuntimeSegmentShare[];
  meanPlannedSeconds: number;
  offMeanSegments: readonly RuntimeSegmentShare[];
  perSegmentVarianceSeconds: number;
}
