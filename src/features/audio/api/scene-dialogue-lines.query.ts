import { queryOptions } from '@tanstack/react-query';
import { dialogueLineSchema, pageSchema } from 'sky-filme-studio-be/contracts';
import type { SceneId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SCENE_DIALOGUE_LINES_STALE_TIME_MS } from '@/lib/query/query.constants';

const dialogueLinePageSchema = pageSchema(dialogueLineSchema);

export const sceneDialogueLinesQueryKey = (sceneId: SceneId): string[] => [
  'scene-dialogue-lines',
  sceneId,
];

export const sceneDialogueLinesQueryOptions = (sceneId: SceneId) =>
  queryOptions({
    queryKey: sceneDialogueLinesQueryKey(sceneId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.sceneDialogueLines(sceneId),
        dialogueLinePageSchema,
        { signal },
      ),
    staleTime: SCENE_DIALOGUE_LINES_STALE_TIME_MS,
  });
