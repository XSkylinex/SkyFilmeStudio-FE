import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { propSchema } from 'sky-filme-studio-be/contracts';
import type {
  ProjectId,
  Prop,
  PropId,
  UpdatePropRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { projectPropsQueryKey } from '@/features/props/api/project-props.query';

const updateProp = (
  projectId: ProjectId,
  propId: PropId,
  request: UpdatePropRequest,
): Promise<Prop> =>
  requestJson(API_PATH.projectProp(projectId, propId), propSchema, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const updatePropMutationOptions = (
  projectId: ProjectId,
  propId: PropId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: UpdatePropRequest) =>
      updateProp(projectId, propId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectPropsQueryKey(projectId),
      });
    },
  });
