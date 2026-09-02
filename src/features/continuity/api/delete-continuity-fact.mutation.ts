import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type {
  ContinuityFactId,
  ProductionId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestNoContent } from '@/lib/api/request-no-content';
import { continuityFactsQueryPrefix } from '@/features/continuity/api/continuity-facts.query';

const deleteContinuityFact = (
  productionId: ProductionId,
  factId: ContinuityFactId,
): Promise<void> =>
  requestNoContent(API_PATH.continuityFact(productionId, factId), {
    method: 'DELETE',
  });

export const deleteContinuityFactMutationOptions = (
  productionId: ProductionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (factId: ContinuityFactId) =>
      deleteContinuityFact(productionId, factId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: continuityFactsQueryPrefix(productionId),
      });
    },
  });
