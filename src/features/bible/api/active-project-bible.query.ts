import { queryOptions } from '@tanstack/react-query';
import { projectBibleSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectBible, ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { StudioError } from '@/lib/api/studio-error';
import { ACTIVE_PROJECT_BIBLE_STALE_TIME_MS } from '@/lib/query/query.constants';

const NOT_FOUND = 404;

export const activeProjectBibleQueryKey = (projectId: ProjectId): string[] => [
  'active-project-bible',
  projectId,
];

const fetchActiveProjectBible = async (
  projectId: ProjectId,
  signal: AbortSignal,
): Promise<ProjectBible | null> => {
  try {
    return await requestJson(
      API_PATH.activeProjectBible(projectId),
      projectBibleSchema,
      { signal },
    );
  } catch (error) {
    if (error instanceof StudioError && error.status === NOT_FOUND) {
      return null;
    }
    throw error;
  }
};

export const activeProjectBibleQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: activeProjectBibleQueryKey(projectId),
    queryFn: ({ signal }) => fetchActiveProjectBible(projectId, signal),
    staleTime: ACTIVE_PROJECT_BIBLE_STALE_TIME_MS,
  });
