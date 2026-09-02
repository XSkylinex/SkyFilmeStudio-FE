import type { OpeningEndingAsset } from 'sky-filme-studio-be/contracts';

export interface OpeningEndingLineage {
  readonly lineageId: OpeningEndingAsset['lineageId'];
  readonly name: string;
  readonly kind: OpeningEndingAsset['kind'];
  readonly newestFirst: readonly OpeningEndingAsset[];
  readonly approved: OpeningEndingAsset | undefined;
}
