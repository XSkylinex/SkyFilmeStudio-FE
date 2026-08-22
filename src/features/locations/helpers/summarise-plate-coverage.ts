import type { LocationPlate } from 'sky-filme-studio-be/contracts';
import type { PlateCoverage } from '@/features/locations/interfaces/plate-coverage';

export const summarisePlateCoverage = (
  plates: readonly LocationPlate[],
): readonly PlateCoverage[] => {
  const byKind = new Map<string, LocationPlate[]>();

  for (const plate of plates) {
    const existing = byKind.get(plate.kind);

    if (existing === undefined) {
      byKind.set(plate.kind, [plate]);
    } else {
      existing.push(plate);
    }
  }

  return [...byKind.entries()].map(([kind, ofKind]) => ({
    kind,
    hasApproved: ofKind.some((plate) => plate.approved),
    draftCount: ofKind.filter((plate) => !plate.approved).length,
  }));
};
