import { locationEditDiff } from '@/features/locations/helpers/location-edit-diff';
import { buildLocation } from '../../../fixtures/location.fixture';

describe('locationEditDiff', () => {
  it('is empty when nothing changed', () => {
    const location = buildLocation();

    expect(
      locationEditDiff(location, {
        name: location.name,
        canonicalDescription: location.canonicalDescription,
        layoutNotes: location.layoutNotes,
        immutableFeatures: location.immutableFeatures,
      }),
    ).toEqual({});
  });

  it('carries only the field that changed', () => {
    const location = buildLocation();

    expect(
      locationEditDiff(location, {
        name: location.name,
        canonicalDescription: location.canonicalDescription,
        layoutNotes: 'Spiral stair rises clockwise now.',
        immutableFeatures: location.immutableFeatures,
      }),
    ).toEqual({ layoutNotes: 'Spiral stair rises clockwise now.' });
  });

  it('treats a reordered immutableFeatures array as a change', () => {
    const location = buildLocation({
      immutableFeatures: ['spiral stair', 'cracked lantern glass'],
    });

    expect(
      locationEditDiff(location, {
        name: location.name,
        canonicalDescription: location.canonicalDescription,
        layoutNotes: location.layoutNotes,
        immutableFeatures: ['cracked lantern glass', 'spiral stair'],
      }),
    ).toEqual({
      immutableFeatures: ['cracked lantern glass', 'spiral stair'],
    });
  });
});
