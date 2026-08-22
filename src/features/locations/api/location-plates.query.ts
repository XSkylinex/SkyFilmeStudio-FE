import { queryOptions } from '@tanstack/react-query';
import { locationPlateSchema, pageSchema } from 'sky-filme-studio-be/contracts';
import type { LocationId, ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { LOCATION_PLATES_STALE_TIME_MS } from '@/lib/query/query.constants';

const locationPlatePageSchema = pageSchema(locationPlateSchema);

export const locationPlatesQueryKey = (
  projectId: ProjectId,
  locationId: LocationId,
): string[] => ['location-plates', projectId, locationId];

export const locationPlatesQueryOptions = (
  projectId: ProjectId,
  locationId: LocationId,
) =>
  queryOptions({
    queryKey: locationPlatesQueryKey(projectId, locationId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.locationPlates(projectId, locationId),
        locationPlatePageSchema,
        { signal },
      ),
    staleTime: LOCATION_PLATES_STALE_TIME_MS,
  });
