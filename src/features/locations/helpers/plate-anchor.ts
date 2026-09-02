import type { z } from 'zod';
import type {
  LocationPlate,
  updateLocationPlateRequestSchema,
} from 'sky-filme-studio-be/contracts';
import type {
  PlateAnchorKind,
  PlateEditValues,
} from '@/features/locations/interfaces/plate-anchor';

export type PlateUpdateCandidate = z.input<
  typeof updateLocationPlateRequestSchema
>;

export const ANCHOR_KIND = {
  SOURCE_ASSET: 'SOURCE_ASSET',
  ARTIFACT: 'ARTIFACT',
} satisfies Record<PlateAnchorKind, PlateAnchorKind>;

export const anchorKindOf = (plate: LocationPlate): PlateAnchorKind =>
  plate.sourceAssetId === undefined
    ? ANCHOR_KIND.ARTIFACT
    : ANCHOR_KIND.SOURCE_ASSET;

export const plateEditValuesFrom = (plate: LocationPlate): PlateEditValues => ({
  kind: plate.kind,
  anchorKind: anchorKindOf(plate),
  sourceAssetId: plate.sourceAssetId ?? '',
  artifactId: plate.artifactId ?? '',
});

/**
 * The anchor is switched in one request or not at all: the orchestrator merges a patch against the
 * stored row before counting anchors, so clearing one and setting the other in two calls is refused
 * on the first.
 */
export const plateUpdateFrom = (
  plate: LocationPlate,
  values: PlateEditValues,
): PlateUpdateCandidate => {
  const candidate: PlateUpdateCandidate = {};

  if (values.kind !== plate.kind) {
    candidate.kind = values.kind;
  }

  const chosen =
    values.anchorKind === ANCHOR_KIND.SOURCE_ASSET
      ? values.sourceAssetId
      : values.artifactId;
  const held =
    values.anchorKind === ANCHOR_KIND.SOURCE_ASSET
      ? plate.sourceAssetId
      : plate.artifactId;

  if (chosen !== (held ?? '')) {
    if (values.anchorKind === ANCHOR_KIND.SOURCE_ASSET) {
      candidate.sourceAssetId = chosen;
      candidate.artifactId = null;
    } else {
      candidate.artifactId = chosen;
      candidate.sourceAssetId = null;
    }
  } else if (anchorKindOf(plate) !== values.anchorKind) {
    if (values.anchorKind === ANCHOR_KIND.SOURCE_ASSET) {
      candidate.sourceAssetId = chosen;
      candidate.artifactId = null;
    } else {
      candidate.artifactId = chosen;
      candidate.sourceAssetId = null;
    }
  }

  return candidate;
};
