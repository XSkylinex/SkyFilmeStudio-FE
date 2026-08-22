import { queryOptions } from '@tanstack/react-query';
import { runtimeBudgetReportSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PLANNING_BUDGET_STALE_TIME_MS } from '@/lib/query/query.constants';

export const planningBudgetQueryKey = (
  productionId: ProductionId,
): string[] => ['planning-budget', productionId];

export const planningBudgetQueryOptions = (productionId: ProductionId) =>
  queryOptions({
    queryKey: planningBudgetQueryKey(productionId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.planningBudget(productionId),
        runtimeBudgetReportSchema,
        { signal },
      ),
    staleTime: PLANNING_BUDGET_STALE_TIME_MS,
  });
