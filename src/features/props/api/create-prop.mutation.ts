import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { propSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreatePropRequest,
  ProjectId,
  Prop,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { projectPropsQueryKey } from '@/features/props/api/project-props.query';

const createProp = (
  projectId: ProjectId,
  request: CreatePropRequest,
): Promise<Prop> =>
  requestJson(API_PATH.projectProps(projectId), propSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createPropMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreatePropRequest) => createProp(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectPropsQueryKey(projectId),
      });
    },
  });
