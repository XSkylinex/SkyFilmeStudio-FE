import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { submitRenderResponseSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  SubmitMusicCueRequest,
  SubmitRenderResponse,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { musicCueRendersQueryKey } from '@/features/music/api/music-cue-renders.query';

const submitRender = (
  projectId: ProjectId,
  request: SubmitMusicCueRequest,
): Promise<SubmitRenderResponse> =>
  requestJson(API_PATH.musicCueRenders(projectId), submitRenderResponseSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const submitMusicCueRenderMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: SubmitMusicCueRequest) =>
      submitRender(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: musicCueRendersQueryKey(projectId),
      });
    },
  });
