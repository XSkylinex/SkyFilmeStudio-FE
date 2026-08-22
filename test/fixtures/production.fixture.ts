import { productionSchema } from 'sky-filme-studio-be/contracts';
import type { Production } from 'sky-filme-studio-be/contracts';

export const buildProduction = (
  overrides: Partial<Production> = {},
): Production =>
  productionSchema.parse({
    id: '33333333-3333-4333-8333-333333333333',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    productionKind: 'EPISODE',
    title: 'Pilot',
    narrativeMode: 'SCREENPLAY',
    targetRuntimeSeconds: 1_200,
    runtimeToleranceSeconds: 30,
    styleProfileId: '11111111-1111-4111-8111-111111111111',
    planVersion: 1,
    state: 'PLANNING',
    exportPaths: [],
    ...overrides,
  });
