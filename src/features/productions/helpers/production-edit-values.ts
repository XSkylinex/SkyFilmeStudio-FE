import type { Production } from 'sky-filme-studio-be/contracts';
import type { ProductionEditValues } from '@/features/productions/interfaces/production-edit-values';

const SECONDS_PER_MINUTE = 60;

const optionalNumber = (value: number | undefined): string =>
  value === undefined ? '' : String(value);

export const productionEditValuesFrom = (
  production: Production,
): ProductionEditValues => ({
  title: production.title,
  productionKind: production.productionKind,
  narrativeMode: production.narrativeMode,
  minutes: String(
    Math.floor(production.targetRuntimeSeconds / SECONDS_PER_MINUTE),
  ),
  seconds: String(production.targetRuntimeSeconds % SECONDS_PER_MINUTE),
  tolerance: optionalNumber(production.runtimeToleranceSeconds),
  styleProfileId: production.styleProfileId,
  productionProfileId: production.productionProfileId ?? '',
  sequenceNumber: optionalNumber(production.sequenceNumber),
  logline: production.logline ?? '',
  brief: production.brief ?? '',
});
