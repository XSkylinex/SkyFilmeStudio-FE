import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { pronunciationDictionaryEntrySchema } from 'sky-filme-studio-be/contracts';
import type {
  AddPronunciationDictionaryEntryRequest,
  ProjectId,
  PronunciationDictionaryEntry,
  PronunciationDictionaryId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { pronunciationEntriesQueryKey } from '@/features/voices/api/pronunciation-entries.query';

const addEntry = (
  projectId: ProjectId,
  dictionaryId: PronunciationDictionaryId,
  request: AddPronunciationDictionaryEntryRequest,
): Promise<PronunciationDictionaryEntry> =>
  requestJson(
    API_PATH.pronunciationDictionaryEntries(projectId, dictionaryId),
    pronunciationDictionaryEntrySchema,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );

export const addPronunciationEntryMutationOptions = (
  projectId: ProjectId,
  dictionaryId: PronunciationDictionaryId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: AddPronunciationDictionaryEntryRequest) =>
      addEntry(projectId, dictionaryId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: pronunciationEntriesQueryKey(projectId, dictionaryId),
      });
    },
  });
