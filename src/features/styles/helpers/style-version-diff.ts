import type { StyleProfile } from 'sky-filme-studio-be/contracts';

export type StyleDiffField =
  | 'name'
  | 'mode'
  | 'description'
  | 'realismLevel'
  | 'referenceAssetIds'
  | 'paletteRules'
  | 'lightingRules'
  | 'cameraRules'
  | 'textureRules'
  | 'motionRules'
  | 'prohibitedStyleDrift'
  | 'imageGenerationDefaults'
  | 'videoGenerationDefaults';

export interface StyleVersionChange {
  readonly field: StyleDiffField;
  readonly removed: readonly string[];
  readonly added: readonly string[];
}

export const STYLE_DIFF_FIELDS: readonly StyleDiffField[] = [
  'name',
  'mode',
  'description',
  'realismLevel',
  'referenceAssetIds',
  'paletteRules',
  'lightingRules',
  'cameraRules',
  'textureRules',
  'motionRules',
  'prohibitedStyleDrift',
  'imageGenerationDefaults',
  'videoGenerationDefaults',
];

const linesOf = (
  profile: StyleProfile,
  field: StyleDiffField,
): readonly string[] => {
  const value = profile[field];

  if (value === undefined) {
    return [];
  }
  if (typeof value === 'string') {
    return value === '' ? [] : [value];
  }
  if (Array.isArray(value)) {
    return value;
  }

  return Object.entries(value).map(
    ([key, item]) => `${key}: ${JSON.stringify(item)}`,
  );
};

export const styleVersionDiff = (
  previous: StyleProfile,
  current: StyleProfile,
): StyleVersionChange[] =>
  STYLE_DIFF_FIELDS.flatMap((field) => {
    const before = linesOf(previous, field);
    const after = linesOf(current, field);
    const removed = before.filter((line) => !after.includes(line));
    const added = after.filter((line) => !before.includes(line));

    return removed.length === 0 && added.length === 0
      ? []
      : [{ field, removed, added }];
  });
