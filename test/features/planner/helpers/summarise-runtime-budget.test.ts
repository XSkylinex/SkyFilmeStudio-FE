import { summariseRuntimeBudget } from '@/features/planner/helpers/summarise-runtime-budget';
import { buildRuntimeBudgetReport } from '../../../fixtures/runtime-budget.fixture';

const labels = (segments: readonly { label: string }[]): string[] =>
  segments.map((segment) => segment.label);

describe('summariseRuntimeBudget', () => {
  it('separates reused material from newly planned scenes', () => {
    const summary = summariseRuntimeBudget(
      buildRuntimeBudgetReport({
        segments: [
          { label: 'Cold open', targetDurationSeconds: 300 },
          { label: 'Recap', targetDurationSeconds: 60, reused: true },
        ],
      }),
    );

    expect(labels(summary.plannedSegments)).toEqual(['Cold open']);
    expect(labels(summary.reusedSegments)).toEqual(['Recap']);
  });

  it('takes the mean over planned scenes only, so a reused intro cannot move it', () => {
    const summary = summariseRuntimeBudget(
      buildRuntimeBudgetReport({
        segments: [
          { label: 'Act one', targetDurationSeconds: 400 },
          { label: 'Act two', targetDurationSeconds: 200 },
          { label: 'Titles', targetDurationSeconds: 6_000, reused: true },
        ],
      }),
    );

    expect(summary.meanPlannedSeconds).toBe(300);
  });

  it('names the scenes below this plan own mean when the plan is short', () => {
    const summary = summariseRuntimeBudget(
      buildRuntimeBudgetReport({
        targetRuntimeSeconds: 1_200,
        segments: [
          { label: 'Act one', targetDurationSeconds: 400 },
          { label: 'Act two', targetDurationSeconds: 100 },
          { label: 'Act three', targetDurationSeconds: 160 },
        ],
      }),
    );

    expect(summary.plannedSegments).toHaveLength(3);
    expect(labels(summary.offMeanSegments)).toEqual(['Act two', 'Act three']);
  });

  it('names the scenes above the mean when the plan runs long instead', () => {
    const summary = summariseRuntimeBudget(
      buildRuntimeBudgetReport({
        targetRuntimeSeconds: 600,
        segments: [
          { label: 'Act one', targetDurationSeconds: 600 },
          { label: 'Act two', targetDurationSeconds: 100 },
        ],
      }),
    );

    expect(labels(summary.offMeanSegments)).toEqual(['Act one']);
  });

  it('names nothing when the plan adds up', () => {
    const summary = summariseRuntimeBudget(
      buildRuntimeBudgetReport({
        targetRuntimeSeconds: 600,
        segments: [
          { label: 'Act one', targetDurationSeconds: 400 },
          { label: 'Act two', targetDurationSeconds: 200 },
        ],
      }),
    );

    expect(summary.offMeanSegments).toEqual([]);
  });

  it('names nothing when every scene sits exactly on the mean, short though the plan is', () => {
    const summary = summariseRuntimeBudget(
      buildRuntimeBudgetReport({
        targetRuntimeSeconds: 1_200,
        segments: [
          { label: 'Act one', targetDurationSeconds: 100 },
          { label: 'Act two', targetDurationSeconds: 100 },
        ],
      }),
    );

    expect(summary.offMeanSegments).toEqual([]);
  });

  it('spreads the shortfall over the planned scenes, never over the reused ones', () => {
    const summary = summariseRuntimeBudget(
      buildRuntimeBudgetReport({
        targetRuntimeSeconds: 1_000,
        segments: [
          { label: 'Act one', targetDurationSeconds: 300 },
          { label: 'Act two', targetDurationSeconds: 300 },
          { label: 'Recap', targetDurationSeconds: 200, reused: true },
        ],
      }),
    );

    expect(summary.perSegmentVarianceSeconds).toBe(100);
  });

  it('reports no shortfall per scene when there are no scenes to spread it over', () => {
    const summary = summariseRuntimeBudget(
      buildRuntimeBudgetReport({
        targetRuntimeSeconds: 600,
        segments: [{ label: 'Recap', targetDurationSeconds: 60, reused: true }],
      }),
    );

    expect(summary.meanPlannedSeconds).toBe(0);
    expect(summary.perSegmentVarianceSeconds).toBe(0);
  });
});
