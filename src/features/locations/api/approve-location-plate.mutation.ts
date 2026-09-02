import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { locationPlateSchema } from 'sky-filme-studio-be/contracts';
import type {
  LocationId,
  LocationPlate,
  LocationPlateId,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { locationPlatesQueryKey } from '@/features/locations/api/location-plates.query';

const approvePlate = (
  projectId: ProjectId,
  locationId: LocationId,
  plateId: LocationPlateId,
): Promise<LocationPlate> =>
  requestJson(
    API_PATH.approveLocationPlate(projectId, locationId, plateId),
    locationPlateSchema,
    { method: 'POST' },
  );

export const approveLocationPlateMutationOptions = (
  projectId: ProjectId,
  locationId: LocationId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (plateId: LocationPlateId) =>
      approvePlate(projectId, locationId, plateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: locationPlatesQueryKey(projectId, locationId),
      });
    },
  });
