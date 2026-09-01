import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { locationSchema } from 'sky-filme-studio-be/contracts';
import type {
  Location,
  LocationId,
  ProjectId,
  UpdateLocationRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { projectLocationsQueryKey } from '@/features/locations/api/project-locations.query';

const updateLocation = (
  projectId: ProjectId,
  locationId: LocationId,
  request: UpdateLocationRequest,
): Promise<Location> =>
  requestJson(API_PATH.location(projectId, locationId), locationSchema, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const updateLocationMutationOptions = (
  projectId: ProjectId,
  locationId: LocationId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: UpdateLocationRequest) =>
      updateLocation(projectId, locationId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectLocationsQueryKey(projectId),
      });
    },
  });
