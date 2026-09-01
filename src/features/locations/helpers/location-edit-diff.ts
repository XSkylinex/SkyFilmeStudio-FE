import type {
  Location,
  UpdateLocationRequest,
} from 'sky-filme-studio-be/contracts';
import type { LocationEditValues } from '@/features/locations/interfaces/location-edit-values';

const stringArraysEqual = (
  a: readonly string[],
  b: readonly string[],
): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export const locationEditDiff = (
  original: Location,
  edited: LocationEditValues,
): UpdateLocationRequest => {
  const patch: UpdateLocationRequest = {};

  if (edited.name !== original.name) {
    patch.name = edited.name;
  }
  if (edited.canonicalDescription !== original.canonicalDescription) {
    patch.canonicalDescription = edited.canonicalDescription;
  }
  if (edited.layoutNotes !== original.layoutNotes) {
    patch.layoutNotes = edited.layoutNotes;
  }
  if (
    !stringArraysEqual(edited.immutableFeatures, original.immutableFeatures)
  ) {
    patch.immutableFeatures = [...edited.immutableFeatures];
  }

  return patch;
};
