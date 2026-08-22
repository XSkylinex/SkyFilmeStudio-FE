import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { locationSchema } from 'sky-filme-studio-be/contracts';
import type {
  Location,
  LocationId,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { projectLocationsQueryKey } from '@/features/locations/api/project-locations.query';

const approveLocation = (
  projectId: ProjectId,
  locationId: LocationId,
): Promise<Location> =>
  requestJson(API_PATH.approveLocation(projectId, locationId), locationSchema, {
    method: 'POST',
  });

export const approveLocationMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (locationId: LocationId) =>
      approveLocation(projectId, locationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectLocationsQueryKey(projectId),
      });
    },
  });
