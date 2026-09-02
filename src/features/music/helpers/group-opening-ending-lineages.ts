import type {
  OpeningEndingAsset,
  OpeningEndingAssetId,
} from 'sky-filme-studio-be/contracts';
import type { OpeningEndingLineage } from '@/features/music/interfaces/opening-ending-lineage';

export const groupOpeningEndingLineages = (
  assets: readonly OpeningEndingAsset[],
): readonly OpeningEndingLineage[] => {
  const byLineage = new Map<OpeningEndingAssetId, OpeningEndingAsset[]>();

  for (const asset of assets) {
    const existing = byLineage.get(asset.lineageId);

    if (existing === undefined) {
      byLineage.set(asset.lineageId, [asset]);
    } else {
      existing.push(asset);
    }
  }

  return [...byLineage.values()].flatMap((versions) => {
    const newestFirst = [...versions].sort((a, b) => b.version - a.version);
    const head = newestFirst[0];

    if (head === undefined) {
      return [];
    }

    return [
      {
        lineageId: head.lineageId,
        name: head.name,
        kind: head.kind,
        newestFirst,
        approved: newestFirst.find((version) => version.approved),
      },
    ];
  });
};
