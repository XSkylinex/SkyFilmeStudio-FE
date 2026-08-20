import {
  idempotencyKeySchema,
  productionIdSchema,
  projectIdSchema,
  renderJobIdSchema,
  renderJobSchema,
} from 'sky-filme-studio-be/contracts';
import type { RenderJob } from 'sky-filme-studio-be/contracts';

export const FIXTURE_RENDER_JOB_ID = renderJobIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

export const FIXTURE_PROJECT_ID = projectIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

export const FIXTURE_PRODUCTION_ID = productionIdSchema.parse(
  '22222222-2222-4222-8222-222222222222',
);

const FIXTURE_IDEMPOTENCY_KEY = idempotencyKeySchema.parse('a'.repeat(64));

export const buildRenderJob = (overrides: Partial<RenderJob> = {}): RenderJob =>
  renderJobSchema.parse({
    id: FIXTURE_RENDER_JOB_ID,
    projectId: FIXTURE_PROJECT_ID,
    productionId: FIXTURE_PRODUCTION_ID,
    jobType: 'SHOT_VIDEO',
    resourceClass: 'GPU_HEAVY',
    priority: 0,
    state: 'PENDING',
    attempt: 0,
    maxAttempts: 3,
    inputManifestPath: 'renders/fixture/input-manifest.json',
    outputManifestPath: 'renders/fixture/output-manifest.json',
    createdAt: '2026-08-15T00:00:00.000Z',
    idempotencyKey: FIXTURE_IDEMPOTENCY_KEY,
    ...overrides,
  });
