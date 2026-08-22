import { queryOptions } from '@tanstack/react-query';
import { pageSchema, voiceProfileSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { VOICE_PROFILES_STALE_TIME_MS } from '@/lib/query/query.constants';

const voiceProfilePageSchema = pageSchema(voiceProfileSchema);

export const voiceProfilesQueryKey = (projectId: ProjectId): string[] => [
  'voice-profiles',
  projectId,
];

export const voiceProfilesQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: voiceProfilesQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.voiceProfiles(projectId), voiceProfilePageSchema, {
        signal,
      }),
    staleTime: VOICE_PROFILES_STALE_TIME_MS,
  });
