import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { propSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId, Prop, PropId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { projectPropsQueryKey } from '@/features/props/api/project-props.query';

const approveProp = (projectId: ProjectId, propId: PropId): Promise<Prop> =>
  requestJson(API_PATH.approveProp(projectId, propId), propSchema, {
    method: 'POST',
  });

export const approvePropMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (propId: PropId) => approveProp(projectId, propId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectPropsQueryKey(projectId),
      });
    },
  });
