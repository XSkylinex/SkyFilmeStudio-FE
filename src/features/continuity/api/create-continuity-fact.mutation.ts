import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { continuityFactSchema } from 'sky-filme-studio-be/contracts';
import type {
  ContinuityFact,
  CreateContinuityFactRequest,
  ProductionId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { continuityFactsQueryPrefix } from '@/features/continuity/api/continuity-facts.query';

const createContinuityFact = (
  productionId: ProductionId,
  request: CreateContinuityFactRequest,
): Promise<ContinuityFact> =>
  requestJson(API_PATH.continuityFacts(productionId), continuityFactSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createContinuityFactMutationOptions = (
  productionId: ProductionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateContinuityFactRequest) =>
      createContinuityFact(productionId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: continuityFactsQueryPrefix(productionId),
      });
    },
  });
