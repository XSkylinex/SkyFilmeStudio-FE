import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { projectBibleSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectBible,
  ProjectBibleVersionId,
  ProjectId,
  UpdateProjectBibleRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { activeProjectBibleQueryKey } from '@/features/bible/api/active-project-bible.query';
import { projectBibleMarkdownQueryKey } from '@/features/bible/api/project-bible-markdown.query';
import { projectBiblesQueryKey } from '@/features/bible/api/project-bibles.query';

const updateProjectBible = (
  projectId: ProjectId,
  bibleId: ProjectBibleVersionId,
  request: UpdateProjectBibleRequest,
): Promise<ProjectBible> =>
  requestJson(API_PATH.projectBible(projectId, bibleId), projectBibleSchema, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const updateProjectBibleMutationOptions = (
  projectId: ProjectId,
  bibleId: ProjectBibleVersionId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: UpdateProjectBibleRequest) =>
      updateProjectBible(projectId, bibleId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectBiblesQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: activeProjectBibleQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: projectBibleMarkdownQueryKey(projectId, bibleId),
        }),
      ]);
    },
  });
