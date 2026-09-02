import {
  artifactIdSchema,
  sourceAssetIdSchema,
  updateLocationPlateRequestSchema,
} from 'sky-filme-studio-be/contracts';
import {
  ANCHOR_KIND,
  plateEditValuesFrom,
  plateUpdateFrom,
} from '@/features/locations/helpers/plate-anchor';
import { buildLocationPlate } from '../../../fixtures/location.fixture';

const ASSET_ID = sourceAssetIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);
const OTHER_ASSET_ID = sourceAssetIdSchema.parse(
  '44444444-4444-4444-8444-444444444444',
);
const ARTIFACT_ID = artifactIdSchema.parse(
  '55555555-5555-4555-8555-555555555555',
);

describe('plateUpdateFrom', () => {
  it('sends nothing when nothing changed, which the update refuses as a body', () => {
    const plate = buildLocationPlate({ sourceAssetId: ASSET_ID });

    const patch = plateUpdateFrom(plate, plateEditValuesFrom(plate));

    expect(patch).toStrictEqual({});
    expect(updateLocationPlateRequestSchema.safeParse(patch).success).toBe(
      false,
    );
  });

  it('sends the kind alone when only the kind changed', () => {
    const plate = buildLocationPlate({ sourceAssetId: ASSET_ID });

    const patch = plateUpdateFrom(plate, {
      ...plateEditValuesFrom(plate),
      kind: 'CLOSE_DETAIL',
    });

    expect(patch).toStrictEqual({ kind: 'CLOSE_DETAIL' });
    expect(updateLocationPlateRequestSchema.safeParse(patch).success).toBe(
      true,
    );
  });

  it('switches the anchor in one request, setting the new and clearing the old', () => {
    const plate = buildLocationPlate({ sourceAssetId: ASSET_ID });

    const patch = plateUpdateFrom(plate, {
      ...plateEditValuesFrom(plate),
      anchorKind: ANCHOR_KIND.ARTIFACT,
      artifactId: ARTIFACT_ID,
    });

    expect(patch).toStrictEqual({
      artifactId: ARTIFACT_ID,
      sourceAssetId: null,
    });
    expect(updateLocationPlateRequestSchema.safeParse(patch).success).toBe(
      true,
    );
  });

  it('refuses the two-step flow the orchestrator would refuse: clearing an anchor and setting nothing', () => {
    expect(
      updateLocationPlateRequestSchema.safeParse({ sourceAssetId: null })
        .success,
    ).toBe(true);
    expect(
      updateLocationPlateRequestSchema.safeParse({
        sourceAssetId: null,
        artifactId: null,
      }).success,
    ).toBe(false);
  });

  it('keeps the anchor kind and changes only the id when the same kind is re-pointed', () => {
    const plate = buildLocationPlate({ sourceAssetId: ASSET_ID });

    const patch = plateUpdateFrom(plate, {
      ...plateEditValuesFrom(plate),
      sourceAssetId: OTHER_ASSET_ID,
    });

    expect(patch).toStrictEqual({
      sourceAssetId: OTHER_ASSET_ID,
      artifactId: null,
    });
  });

  it('reads an artifact-anchored plate as anchored by artifact', () => {
    const plate = buildLocationPlate({
      sourceAssetId: undefined,
      artifactId: ARTIFACT_ID,
    });

    expect(plateEditValuesFrom(plate).anchorKind).toBe(ANCHOR_KIND.ARTIFACT);
    expect(plateEditValuesFrom(plate).artifactId).toBe(ARTIFACT_ID);
  });
});
