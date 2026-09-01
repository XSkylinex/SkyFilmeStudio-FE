import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { projectBibleSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectBible,
  ProjectBibleVersionId,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { activeProjectBibleQueryKey } from '@/features/bible/api/active-project-bible.query';
import { projectBiblesQueryKey } from '@/features/bible/api/project-bibles.query';

const publishProjectBible = (
  projectId: ProjectId,
  bibleId: ProjectBibleVersionId,
): Promise<ProjectBible> =>
  requestJson(
    API_PATH.publishProjectBible(projectId, bibleId),
    projectBibleSchema,
    { method: 'POST' },
  );

export const publishProjectBibleMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (bibleId: ProjectBibleVersionId) =>
      publishProjectBible(projectId, bibleId),
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
