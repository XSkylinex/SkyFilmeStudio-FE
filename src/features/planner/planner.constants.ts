import {
  PLANNING_STAGE,
  PRODUCTION_STATE,
} from 'sky-filme-studio-be/contracts';
import type {
  PlanningStage,
  RuntimeVerdict,
} from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { BudgetFigure } from '@/features/planner/interfaces/budget-figure';

export const PLAN_APPROVAL_STATE = PRODUCTION_STATE.PLANNING;

export const COMPUTED_PLANNING_STAGE = PLANNING_STAGE.RUNTIME_ESTIMATE;

export const PLANNING_STAGE_LABEL = {
  LOGLINE: 'planner.stage.LOGLINE',
  BEAT_SHEET: 'planner.stage.BEAT_SHEET',
  MUSIC_SECTIONS: 'planner.stage.MUSIC_SECTIONS',
  VISUAL_BEATS: 'planner.stage.VISUAL_BEATS',
  SCENE_OUTLINE: 'planner.stage.SCENE_OUTLINE',
  SCREENPLAY: 'planner.stage.SCREENPLAY',
  CONTINUITY_REVIEW: 'planner.stage.CONTINUITY_REVIEW',
  TONE_REVIEW: 'planner.stage.TONE_REVIEW',
  RUNTIME_ESTIMATE: 'planner.stage.RUNTIME_ESTIMATE',
} satisfies Record<PlanningStage, TranslationKey>;

export const RUNTIME_VERDICT_LABEL = {
  WITHIN_TOLERANCE: 'planner.budget.verdict.WITHIN_TOLERANCE',
  SHORT: 'planner.budget.verdict.SHORT',
  LONG: 'planner.budget.verdict.LONG',
} satisfies Record<RuntimeVerdict, TranslationKey>;

export const BUDGET_FIGURES = [
  {
    labelKey: 'planner.budget.target',
    read: (report) => report.targetRuntimeSeconds,
  },
  {
    labelKey: 'planner.budget.planned',
    read: (report) => report.plannedSeconds,
  },
  { labelKey: 'planner.budget.reused', read: (report) => report.reusedSeconds },
  { labelKey: 'planner.budget.total', read: (report) => report.totalSeconds },
  {
    labelKey: 'planner.budget.toleranceLabel',
    read: (report) => report.toleranceSeconds,
  },
] satisfies readonly BudgetFigure[];

export const PERCENT_SCALE = 100;
export const PROGRESS_BAR_CEILING = 100;

export const PLANNER_GAP_KEYS = [
  'planner.gaps.stages',
  'planner.gaps.scenes',
  'planner.gaps.dialogue',
  'planner.gaps.continuity',
] satisfies readonly TranslationKey[];
