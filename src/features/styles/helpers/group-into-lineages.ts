import type {
  StyleProfile,
  StyleProfileId,
} from 'sky-filme-studio-be/contracts';
import type { StyleLineage } from '@/features/styles/interfaces/style-lineage';

export const groupIntoLineages = (
  profiles: readonly StyleProfile[],
): readonly StyleLineage[] => {
  const byLineage = new Map<StyleProfileId, StyleProfile[]>();

  for (const profile of profiles) {
    const existing = byLineage.get(profile.lineageId);

    if (existing === undefined) {
      byLineage.set(profile.lineageId, [profile]);
    } else {
      existing.push(profile);
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
        newestFirst,
        approved: newestFirst.find((version) => version.approved),
      },
    ];
  });
};
