import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { productionSchema } from 'sky-filme-studio-be/contracts';
import type {
  Production,
  ProductionId,
  ProjectId,
  UpdateProductionRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { planningBudgetQueryKey } from '@/features/planner/api/planning-budget.query';
import { productionQueryKey } from '@/features/productions/api/production.query';
import { productionsQueryKey } from '@/features/productions/api/productions.query';

const updateProduction = (
  projectId: ProjectId,
  productionId: ProductionId,
  request: UpdateProductionRequest,
): Promise<Production> =>
  requestJson(API_PATH.production(projectId, productionId), productionSchema, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const updateProductionMutationOptions = (
  projectId: ProjectId,
  productionId: ProductionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: UpdateProductionRequest) =>
      updateProduction(projectId, productionId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: productionsQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: productionQueryKey(projectId, productionId),
        }),
        queryClient.invalidateQueries({
          queryKey: planningBudgetQueryKey(productionId),
        }),
      ]);
    },
  });
