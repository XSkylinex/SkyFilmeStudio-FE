import type { Prop, UpdatePropRequest } from 'sky-filme-studio-be/contracts';
import type { PropEditValues } from '@/features/props/interfaces/prop-edit-values';

const stringArraysEqual = (
  a: readonly string[],
  b: readonly string[],
): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export const propEditDiff = (
  original: Prop,
  edited: PropEditValues,
): UpdatePropRequest => {
  const patch: UpdatePropRequest = {};

  if (edited.name !== original.name) {
    patch.name = edited.name;
  }
  if (edited.canonicalDescription !== original.canonicalDescription) {
    patch.canonicalDescription = edited.canonicalDescription;
  }
  if (!stringArraysEqual(edited.continuityRules, original.continuityRules)) {
    patch.continuityRules = [...edited.continuityRules];
  }

  return patch;
};
