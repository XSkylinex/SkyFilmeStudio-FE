import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { sceneCueSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProductionId,
  SceneCue,
  ScoreProductionRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { productionScoreQueryKey } from '@/features/audio/api/production-score.query';

const sceneCueListSchema = sceneCueSchema.array();

const scoreProduction = (
  productionId: ProductionId,
  request: ScoreProductionRequest,
): Promise<readonly SceneCue[]> =>
  requestJson(API_PATH.productionScore(productionId), sceneCueListSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const scoreProductionMutationOptions = (
  productionId: ProductionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: ScoreProductionRequest) =>
      scoreProduction(productionId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productionScoreQueryKey(productionId),
      });
    },
  });
