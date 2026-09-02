import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { locationPlateSchema } from 'sky-filme-studio-be/contracts';
import type {
  LocationId,
  LocationPlate,
  LocationPlateId,
  ProjectId,
  UpdateLocationPlateRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { locationPlatesQueryKey } from '@/features/locations/api/location-plates.query';

export interface UpdateLocationPlateVariables {
  readonly plateId: LocationPlateId;
  readonly request: UpdateLocationPlateRequest;
}

const updatePlate = (
  projectId: ProjectId,
  locationId: LocationId,
  { plateId, request }: UpdateLocationPlateVariables,
): Promise<LocationPlate> =>
  requestJson(
    API_PATH.locationPlate(projectId, locationId, plateId),
    locationPlateSchema,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );

export const updateLocationPlateMutationOptions = (
  projectId: ProjectId,
  locationId: LocationId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (variables: UpdateLocationPlateVariables) =>
      updatePlate(projectId, locationId, variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: locationPlatesQueryKey(projectId, locationId),
      });
    },
  });
