import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { pronunciationDictionarySchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  PronunciationDictionary,
  PronunciationDictionaryId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { pronunciationDictionariesQueryKey } from '@/features/voices/api/pronunciation-dictionaries.query';

const deleteDictionary = (
  projectId: ProjectId,
  dictionaryId: PronunciationDictionaryId,
): Promise<PronunciationDictionary> =>
  requestJson(
    API_PATH.pronunciationDictionary(projectId, dictionaryId),
    pronunciationDictionarySchema,
    { method: 'DELETE' },
  );

export const deletePronunciationDictionaryMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (dictionaryId: PronunciationDictionaryId) =>
      deleteDictionary(projectId, dictionaryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: pronunciationDictionariesQueryKey(projectId),
      });
    },
  });
