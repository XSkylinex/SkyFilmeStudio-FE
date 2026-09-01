import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { projectBibleSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreateProjectBibleRequest,
  ProjectBible,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { activeProjectBibleQueryKey } from '@/features/bible/api/active-project-bible.query';
import { projectBiblesQueryKey } from '@/features/bible/api/project-bibles.query';

const createProjectBible = (
  projectId: ProjectId,
  request: CreateProjectBibleRequest,
): Promise<ProjectBible> =>
  requestJson(API_PATH.projectBibles(projectId), projectBibleSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createProjectBibleMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateProjectBibleRequest) =>
      createProjectBible(projectId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectBiblesQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: activeProjectBibleQueryKey(projectId),
        }),
      ]);
    },
  });
