import type { LocationPlate } from 'sky-filme-studio-be/contracts';

export const suggestedKindsWithoutAPlate = (
  plates: readonly LocationPlate[],
  suggested: readonly string[],
): readonly string[] => {
  const present = new Set<string>(plates.map((plate) => plate.kind));

  return suggested.filter((kind) => !present.has(kind));
};
