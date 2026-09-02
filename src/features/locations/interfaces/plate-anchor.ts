import type {
  ArtifactId,
  LocationPlate,
  SourceAssetId,
} from 'sky-filme-studio-be/contracts';

export type PlateAnchorKind = 'SOURCE_ASSET' | 'ARTIFACT';

export interface PlateAnchor {
  readonly anchorKind: PlateAnchorKind;
  readonly sourceAssetId: SourceAssetId | undefined;
  readonly artifactId: ArtifactId | undefined;
}

export interface PlateEditValues {
  readonly kind: string;
  readonly anchorKind: PlateAnchorKind;
  readonly sourceAssetId: string;
  readonly artifactId: string;
}

export type PlateOf = LocationPlate;
