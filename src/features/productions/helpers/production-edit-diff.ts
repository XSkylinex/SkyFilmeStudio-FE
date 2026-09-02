import type { z } from 'zod';
import type {
  Production,
  updateProductionRequestSchema,
} from 'sky-filme-studio-be/contracts';
import type {
  ProductionClearableField,
  ProductionEditValues,
} from '@/features/productions/interfaces/production-edit-values';

export type ProductionEditPatch = z.input<typeof updateProductionRequestSchema>;

const SECONDS_PER_MINUTE = 60;

const numberOrUndefined = (value: string): number | undefined =>
  value === '' ? undefined : Number(value);

const textOrUndefined = (value: string): string | undefined =>
  value === '' ? undefined : value;

export const targetRuntimeSecondsOf = (values: ProductionEditValues): number =>
  (values.minutes === '' ? 0 : Number(values.minutes)) * SECONDS_PER_MINUTE +
  (values.seconds === '' ? 0 : Number(values.seconds));

export const productionEditDiff = (
  original: Production,
  values: ProductionEditValues,
): ProductionEditPatch => {
  const patch: ProductionEditPatch = {};
  const target = targetRuntimeSecondsOf(values);
  const tolerance = numberOrUndefined(values.tolerance);
  const sequenceNumber = numberOrUndefined(values.sequenceNumber);
  const productionProfileId = textOrUndefined(values.productionProfileId);
  const logline = textOrUndefined(values.logline);
  const brief = textOrUndefined(values.brief);

  if (values.title !== original.title) {
    patch.title = values.title;
  }
  if (values.productionKind !== original.productionKind) {
    patch.productionKind = values.productionKind;
  }
  if (values.narrativeMode !== original.narrativeMode) {
    patch.narrativeMode = values.narrativeMode;
  }
  if (target !== original.targetRuntimeSeconds) {
    patch.targetRuntimeSeconds = target;
  }
  if (
    tolerance !== undefined &&
    tolerance !== original.runtimeToleranceSeconds
  ) {
    patch.runtimeToleranceSeconds = tolerance;
  }
  if (values.styleProfileId !== original.styleProfileId) {
    patch.styleProfileId = values.styleProfileId;
  }
  if (
    productionProfileId !== undefined &&
    productionProfileId !== original.productionProfileId
  ) {
    patch.productionProfileId = productionProfileId;
  }
  if (
    sequenceNumber !== undefined &&
    sequenceNumber !== original.sequenceNumber
  ) {
    patch.sequenceNumber = sequenceNumber;
  }
  if (logline !== undefined && logline !== original.logline) {
    patch.logline = logline;
  }
  if (brief !== undefined && brief !== original.brief) {
    patch.brief = brief;
  }

  return patch;
};

export const unclearableFields = (
  original: Production,
  values: ProductionEditValues,
): ProductionClearableField[] => {
  const emptied: ProductionClearableField[] = [];

  if (values.logline === '' && original.logline !== undefined) {
    emptied.push('logline');
  }
  if (values.brief === '' && original.brief !== undefined) {
    emptied.push('brief');
  }
  if (
    values.tolerance === '' &&
    original.runtimeToleranceSeconds !== undefined
  ) {
    emptied.push('tolerance');
  }
  if (
    values.productionProfileId === '' &&
    original.productionProfileId !== undefined
  ) {
    emptied.push('productionProfileId');
  }
  if (values.sequenceNumber === '' && original.sequenceNumber !== undefined) {
    emptied.push('sequenceNumber');
  }

  return emptied;
};
