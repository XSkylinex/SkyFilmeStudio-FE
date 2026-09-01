import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { locationSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreateLocationRequest,
  Location,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { projectLocationsQueryKey } from '@/features/locations/api/project-locations.query';

const createLocation = (
  projectId: ProjectId,
  request: CreateLocationRequest,
): Promise<Location> =>
  requestJson(API_PATH.locations(projectId), locationSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createLocationMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateLocationRequest) =>
      createLocation(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectLocationsQueryKey(projectId),
      });
    },
  });
