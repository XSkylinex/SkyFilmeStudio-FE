import type { SfxAsset } from 'sky-filme-studio-be/contracts';

export interface SfxAssetCardProps {
  readonly asset: SfxAsset;
  readonly onRemoved: (name: string) => void;
}
