import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { planningStageSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PLANNING_STAGES_STALE_TIME_MS } from '@/lib/query/query.constants';

const planningStagesSchema = z.array(planningStageSchema);

export const planningStagesQueryKey = (
  productionId: ProductionId,
): string[] => ['planning-stages', productionId];

export const planningStagesQueryOptions = (productionId: ProductionId) =>
  queryOptions({
    queryKey: planningStagesQueryKey(productionId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.planningStages(productionId), planningStagesSchema, {
        signal,
      }),
    staleTime: PLANNING_STAGES_STALE_TIME_MS,
  });
