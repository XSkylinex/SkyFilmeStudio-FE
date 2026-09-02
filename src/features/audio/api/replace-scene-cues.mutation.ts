import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { sceneCueSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProductionId,
  ReplaceSceneCuesRequest,
  SceneCue,
  SceneId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { productionScoreQueryKey } from '@/features/audio/api/production-score.query';
import { sceneCuesQueryKey } from '@/features/audio/api/scene-cues.query';

const sceneCueListSchema = sceneCueSchema.array();

const replaceSceneCues = (
  sceneId: SceneId,
  request: ReplaceSceneCuesRequest,
): Promise<readonly SceneCue[]> =>
  requestJson(API_PATH.sceneCues(sceneId), sceneCueListSchema, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const replaceSceneCuesMutationOptions = (
  sceneId: SceneId,
  productionId: ProductionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: ReplaceSceneCuesRequest) =>
      replaceSceneCues(sceneId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sceneCuesQueryKey(sceneId) }),
        queryClient.invalidateQueries({
          queryKey: productionScoreQueryKey(productionId),
        }),
      ]);
    },
  });
