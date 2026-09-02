import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { submitRenderResponseSchema } from 'sky-filme-studio-be/contracts';
import type {
  SceneId,
  SubmitRenderResponse,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sceneMixesQueryKey } from '@/features/audio/api/scene-mixes.query';

const submitSceneMix = (sceneId: SceneId): Promise<SubmitRenderResponse> =>
  requestJson(API_PATH.sceneMixes(sceneId), submitRenderResponseSchema, {
    method: 'POST',
  });

export const submitSceneMixMutationOptions = (
  sceneId: SceneId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: () => submitSceneMix(sceneId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sceneMixesQueryKey(sceneId),
      });
    },
  });
