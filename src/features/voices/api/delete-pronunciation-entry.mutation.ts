import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { pronunciationDictionaryEntrySchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  PronunciationDictionaryEntry,
  PronunciationDictionaryEntryId,
  PronunciationDictionaryId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { pronunciationEntriesQueryKey } from '@/features/voices/api/pronunciation-entries.query';

const deleteEntry = (
  projectId: ProjectId,
  dictionaryId: PronunciationDictionaryId,
  entryId: PronunciationDictionaryEntryId,
): Promise<PronunciationDictionaryEntry> =>
  requestJson(
    API_PATH.pronunciationDictionaryEntry(projectId, dictionaryId, entryId),
    pronunciationDictionaryEntrySchema,
    { method: 'DELETE' },
  );

export const deletePronunciationEntryMutationOptions = (
  projectId: ProjectId,
  dictionaryId: PronunciationDictionaryId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (entryId: PronunciationDictionaryEntryId) =>
      deleteEntry(projectId, dictionaryId, entryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: pronunciationEntriesQueryKey(projectId, dictionaryId),
      });
    },
  });
