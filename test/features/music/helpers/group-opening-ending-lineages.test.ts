import { openingEndingAssetIdSchema } from 'sky-filme-studio-be/contracts';
import { groupOpeningEndingLineages } from '@/features/music/helpers/group-opening-ending-lineages';
import { buildOpeningEndingAsset } from '../../../fixtures/opening-ending-asset.fixture';

const LINEAGE_A = openingEndingAssetIdSchema.parse(
  '99999999-9999-4999-8999-999999999999',
);
const LINEAGE_B = openingEndingAssetIdSchema.parse(
  '11111111-2222-4333-8444-555555555555',
);
const VERSION_TWO = openingEndingAssetIdSchema.parse(
  '22222222-2222-4222-8222-222222222222',
);

describe('groupOpeningEndingLineages', () => {
  it('folds every version onto its lineage, newest first', () => {
    const lineages = groupOpeningEndingLineages([
      buildOpeningEndingAsset({ version: 1 }),
      buildOpeningEndingAsset({
        id: VERSION_TWO,
        version: 2,
        name: 'Series opening, revised',
      }),
    ]);

    expect(lineages).toHaveLength(1);
    expect(lineages[0]?.newestFirst.map((asset) => asset.version)).toEqual([
      2, 1,
    ]);
  });

  it('names the lineage after its newest version, because that is what it is called now', () => {
    const lineages = groupOpeningEndingLineages([
      buildOpeningEndingAsset({ version: 1, name: 'Series opening' }),
      buildOpeningEndingAsset({
        id: VERSION_TWO,
        version: 2,
        name: 'Series opening, revised',
      }),
    ]);

    expect(lineages[0]?.name).toBe('Series opening, revised');
  });

  it('reports the approved version, whichever version it is', () => {
    const lineages = groupOpeningEndingLineages([
      buildOpeningEndingAsset({ version: 1, approved: true }),
      buildOpeningEndingAsset({ id: VERSION_TWO, version: 2 }),
    ]);

    expect(lineages[0]?.approved?.version).toBe(1);
  });

  it('reports no approved version when the lineage has none', () => {
    expect(
      groupOpeningEndingLineages([buildOpeningEndingAsset()])[0]?.approved,
    ).toBeUndefined();
  });

  it('keeps two lineages apart', () => {
    const lineages = groupOpeningEndingLineages([
      buildOpeningEndingAsset({ lineageId: LINEAGE_A }),
      buildOpeningEndingAsset({
        id: VERSION_TWO,
        lineageId: LINEAGE_B,
        name: 'Series ending',
      }),
    ]);

    expect(lineages).toHaveLength(2);
  });
});
