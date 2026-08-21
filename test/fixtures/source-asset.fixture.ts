import { sourceAssetSchema } from 'sky-filme-studio-be/contracts';
import type { SourceAsset } from 'sky-filme-studio-be/contracts';

export const buildSourceAsset = (
  overrides: Partial<SourceAsset> = {},
): SourceAsset =>
  sourceAssetSchema.parse({
    id: '11111111-1111-4111-8111-111111111111',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    type: 'IMAGE',
    origin: 'CAMERA_CAPTURE',
    path: 'sources/11111111-1111-4111-8111-111111111111/original/IMG_1042.jpg',
    mimeType: 'image/jpeg',
    sha256: 'a'.repeat(64),
    metadataJson: {},
    privacyClass: 'PROJECT_PRIVATE',
    immutable: true,
    createdAt: '2026-08-16T10:00:00.000Z',
    ...overrides,
  });
