import {
  locationPlateSchema,
  locationSchema,
} from 'sky-filme-studio-be/contracts';
import type { Location, LocationPlate } from 'sky-filme-studio-be/contracts';

export const buildLocation = (overrides: Partial<Location> = {}): Location =>
  locationSchema.parse({
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    name: 'The lighthouse',
    canonicalDescription: 'A stone lighthouse on a basalt shelf.',
    sourceAssetIds: [],
    immutableFeatures: ['spiral stair', 'cracked lantern glass'],
    variants: [],
    referenceImages: [],
    layoutNotes: '',
    colorPalette: [],
    approved: false,
    ...overrides,
  });

export const buildLocationPlate = (
  overrides: Partial<LocationPlate> = {},
): LocationPlate =>
  locationPlateSchema.parse({
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    locationId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    kind: 'WIDE_ESTABLISHING',
    sourceAssetId: '55555555-5555-4555-8555-555555555555',
    approved: false,
    ...overrides,
  });
