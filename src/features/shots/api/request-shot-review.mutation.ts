import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import type { SceneId, ShotId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sceneShotsQueryKey } from '@/features/storyboard/api/scene-shots.query';
import { shotQcQueryKey } from '@/features/shots/helpers/shot-qc-query-key';

const handedOverSchema = z.unknown();

const requestShotReview = (shotId: ShotId): Promise<unknown> =>
  requestJson(API_PATH.shotQcRequestReview(shotId), handedOverSchema, {
    method: 'POST',
  });

export const requestShotReviewMutationOptions = (
  shotId: ShotId,
  sceneId: SceneId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: () => requestShotReview(shotId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: shotQcQueryKey(shotId) }),
        queryClient.invalidateQueries({
          queryKey: sceneShotsQueryKey(sceneId),
        }),
      ]);
    },
  });
