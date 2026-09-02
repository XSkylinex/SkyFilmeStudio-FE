import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { submitRenderResponseSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProductionId,
  SubmitRenderResponse,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { productionMixesQueryKey } from '@/features/audio/api/production-mixes.query';

const submitProductionMix = (
  productionId: ProductionId,
): Promise<SubmitRenderResponse> =>
  requestJson(
    API_PATH.productionMixes(productionId),
    submitRenderResponseSchema,
    { method: 'POST' },
  );

export const submitProductionMixMutationOptions = (
  productionId: ProductionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: () => submitProductionMix(productionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productionMixesQueryKey(productionId),
      });
    },
  });
