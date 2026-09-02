import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { productionProfileSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreateProductionProfileRequest,
  ProductionProfile,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { productionProfilesQueryKey } from '@/features/productions/api/production-profiles.query';

const createProductionProfile = (
  projectId: ProjectId,
  request: CreateProductionProfileRequest,
): Promise<ProductionProfile> =>
  requestJson(API_PATH.productionProfiles(projectId), productionProfileSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createProductionProfileMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateProductionProfileRequest) =>
      createProductionProfile(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productionProfilesQueryKey(projectId),
      });
    },
  });
