import { queryOptions } from '@tanstack/react-query';
import {
  pageSchema,
  pronunciationDictionarySchema,
} from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRONUNCIATION_DICTIONARIES_STALE_TIME_MS } from '@/lib/query/query.constants';

const dictionaryPageSchema = pageSchema(pronunciationDictionarySchema);

export const pronunciationDictionariesQueryKey = (
  projectId: ProjectId,
): string[] => ['pronunciation-dictionaries', projectId];

export const pronunciationDictionariesQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: pronunciationDictionariesQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.pronunciationDictionaries(projectId),
        dictionaryPageSchema,
        { signal },
      ),
    staleTime: PRONUNCIATION_DICTIONARIES_STALE_TIME_MS,
  });
