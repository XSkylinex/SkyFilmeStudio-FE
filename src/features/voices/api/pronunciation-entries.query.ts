import { queryOptions } from '@tanstack/react-query';
import {
  pageSchema,
  pronunciationDictionaryEntrySchema,
} from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  PronunciationDictionaryId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRONUNCIATION_ENTRIES_STALE_TIME_MS } from '@/lib/query/query.constants';

const entryPageSchema = pageSchema(pronunciationDictionaryEntrySchema);

export const pronunciationEntriesQueryKey = (
  projectId: ProjectId,
  dictionaryId: PronunciationDictionaryId,
): string[] => ['pronunciation-entries', projectId, dictionaryId];

export const pronunciationEntriesQueryOptions = (
  projectId: ProjectId,
  dictionaryId: PronunciationDictionaryId,
) =>
  queryOptions({
    queryKey: pronunciationEntriesQueryKey(projectId, dictionaryId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.pronunciationDictionaryEntries(projectId, dictionaryId),
        entryPageSchema,
        { signal },
      ),
    staleTime: PRONUNCIATION_ENTRIES_STALE_TIME_MS,
  });
