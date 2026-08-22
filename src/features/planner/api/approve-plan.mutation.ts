import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { productionSchema } from 'sky-filme-studio-be/contracts';
import type {
  Production,
  ProductionId,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { planningBudgetQueryKey } from '@/features/planner/api/planning-budget.query';
import { productionQueryKey } from '@/features/productions/api/production.query';
import { productionsQueryKey } from '@/features/productions/api/productions.query';

const approvePlan = (productionId: ProductionId): Promise<Production> =>
  requestJson(API_PATH.planningApproval(productionId), productionSchema, {
    method: 'POST',
  });

export const approvePlanMutationOptions = (
  projectId: ProjectId,
  productionId: ProductionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: () => approvePlan(productionId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: productionQueryKey(projectId, productionId),
        }),
        queryClient.invalidateQueries({
          queryKey: productionsQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: planningBudgetQueryKey(productionId),
        }),
      ]);
    },
  });
