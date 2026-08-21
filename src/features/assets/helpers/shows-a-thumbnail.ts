import type { SourceAssetType } from 'sky-filme-studio-be/contracts';

const VISUAL_ASSET_TYPES: readonly SourceAssetType[] = [
  'IMAGE',
  'VIDEO',
  'DRAWING',
  'RENDER_3D',
];

export const showsAThumbnail = (type: SourceAssetType): boolean =>
  VISUAL_ASSET_TYPES.includes(type);
