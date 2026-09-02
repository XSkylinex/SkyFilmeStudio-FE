import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { locationPlateSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreateLocationPlateRequest,
  LocationId,
  LocationPlate,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { locationPlatesQueryKey } from '@/features/locations/api/location-plates.query';

const createPlate = (
  projectId: ProjectId,
  locationId: LocationId,
  request: CreateLocationPlateRequest,
): Promise<LocationPlate> =>
  requestJson(
    API_PATH.locationPlates(projectId, locationId),
    locationPlateSchema,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );

export const createLocationPlateMutationOptions = (
  projectId: ProjectId,
  locationId: LocationId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateLocationPlateRequest) =>
      createPlate(projectId, locationId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: locationPlatesQueryKey(projectId, locationId),
      });
    },
  });
