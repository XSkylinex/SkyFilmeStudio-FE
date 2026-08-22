import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { productionSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreateProductionRequest,
  Production,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { productionsQueryKey } from '@/features/productions/api/productions.query';

const createProduction = (
  projectId: ProjectId,
  request: CreateProductionRequest,
): Promise<Production> =>
  requestJson(API_PATH.productions(projectId), productionSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createProductionMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateProductionRequest) =>
      createProduction(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productionsQueryKey(projectId),
      });
    },
  });
