import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { pronunciationDictionarySchema } from 'sky-filme-studio-be/contracts';
import type {
  CreatePronunciationDictionaryRequest,
  ProjectId,
  PronunciationDictionary,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { pronunciationDictionariesQueryKey } from '@/features/voices/api/pronunciation-dictionaries.query';

const createDictionary = (
  projectId: ProjectId,
  request: CreatePronunciationDictionaryRequest,
): Promise<PronunciationDictionary> =>
  requestJson(
    API_PATH.pronunciationDictionaries(projectId),
    pronunciationDictionarySchema,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );

export const createPronunciationDictionaryMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreatePronunciationDictionaryRequest) =>
      createDictionary(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: pronunciationDictionariesQueryKey(projectId),
      });
    },
  });
