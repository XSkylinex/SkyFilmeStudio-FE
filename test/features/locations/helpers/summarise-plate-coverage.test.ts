import {
  locationPlateIdSchema,
  plateKindSchema,
} from 'sky-filme-studio-be/contracts';
import { summarisePlateCoverage } from '@/features/locations/helpers/summarise-plate-coverage';
import { suggestedKindsWithoutAPlate } from '@/features/locations/helpers/suggested-kinds-without-a-plate';
import { buildLocationPlate } from '../../../fixtures/location.fixture';

const plateId = (value: string) => locationPlateIdSchema.parse(value);
const kindOf = (value: string) => plateKindSchema.parse(value);

describe('summarisePlateCoverage', () => {
  it('reports one entry per kind, not one per plate', () => {
    const coverage = summarisePlateCoverage([
      buildLocationPlate({ kind: kindOf('MEDIUM_LEFT') }),
      buildLocationPlate({
        id: plateId('11111111-1111-4111-8111-111111111111'),
        kind: kindOf('MEDIUM_LEFT'),
      }),
    ]);

    expect(coverage).toHaveLength(1);
    expect(coverage[0]?.draftCount).toBe(2);
  });

  it('counts a kind as covered only when one of its plates is approved', () => {
    const unapproved = summarisePlateCoverage([
      buildLocationPlate({ kind: kindOf('CLOSE_DETAIL') }),
    ]);

    expect(unapproved[0]?.hasApproved).toBe(false);

    const approved = summarisePlateCoverage([
      buildLocationPlate({ kind: kindOf('CLOSE_DETAIL') }),
      buildLocationPlate({
        id: plateId('22222222-2222-4222-8222-222222222222'),
        kind: kindOf('CLOSE_DETAIL'),
        approved: true,
      }),
    ]);

    expect(approved[0]?.hasApproved).toBe(true);
    expect(approved[0]?.draftCount).toBe(1);
  });

  it('reports kinds the wire carries, including ones outside the suggestions', () => {
    const coverage = summarisePlateCoverage([
      buildLocationPlate({ kind: kindOf('UNDER_THE_STAIR') }),
    ]);

    expect(coverage[0]?.kind).toBe('UNDER_THE_STAIR');
  });
});

describe('suggestedKindsWithoutAPlate', () => {
  it('subtracts what is present from what is suggested', () => {
    const missing = suggestedKindsWithoutAPlate(
      [buildLocationPlate({ kind: kindOf('WIDE_ESTABLISHING') })],
      ['WIDE_ESTABLISHING', 'CLOSE_DETAIL'],
    );

    expect(missing).toEqual(['CLOSE_DETAIL']);
  });

  it('never reports a kind the location already has, approved or not', () => {
    const missing = suggestedKindsWithoutAPlate(
      [buildLocationPlate({ kind: kindOf('CLOSE_DETAIL'), approved: false })],
      ['CLOSE_DETAIL'],
    );

    expect(missing).toEqual([]);
  });
});
