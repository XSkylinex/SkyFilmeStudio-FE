import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { dialogueTimingReportSchema } from 'sky-filme-studio-be/contracts';
import type {
  DialogueTimingReport,
  ProductionId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { planningBudgetQueryKey } from '@/features/planner/api/planning-budget.query';
import { SCENE_SHOTS_QUERY_PREFIX } from '@/features/storyboard/api/scene-shots.query';

const runDialogueTiming = (
  productionId: ProductionId,
): Promise<DialogueTimingReport> =>
  requestJson(
    API_PATH.productionDialogueTiming(productionId),
    dialogueTimingReportSchema,
    { method: 'POST' },
  );

export const dialogueTimingMutationOptions = (
  productionId: ProductionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: () => runDialogueTiming(productionId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: SCENE_SHOTS_QUERY_PREFIX,
        }),
        queryClient.invalidateQueries({
          queryKey: planningBudgetQueryKey(productionId),
        }),
      ]);
    },
  });
