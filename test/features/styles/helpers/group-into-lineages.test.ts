import { styleProfileIdSchema } from 'sky-filme-studio-be/contracts';
import { groupIntoLineages } from '@/features/styles/helpers/group-into-lineages';
import { buildStyleProfile } from '../../../fixtures/style-profile.fixture';

const styleId = (value: string) => styleProfileIdSchema.parse(value);

const LINEAGE_A = styleId('11111111-1111-4111-8111-111111111111');
const LINEAGE_B = styleId('22222222-2222-4222-8222-222222222222');

describe('groupIntoLineages', () => {
  it('puts every version of one lineage under a single entry', () => {
    const lineages = groupIntoLineages([
      buildStyleProfile({ id: LINEAGE_A, lineageId: LINEAGE_A, version: 1 }),
      buildStyleProfile({
        id: styleId('33333333-3333-4333-8333-333333333333'),
        lineageId: LINEAGE_A,
        version: 2,
      }),
      buildStyleProfile({
        id: LINEAGE_B,
        lineageId: LINEAGE_B,
        name: 'Daybreak',
        version: 1,
      }),
    ]);

    expect(lineages).toHaveLength(2);
    expect(lineages[0]?.newestFirst).toHaveLength(2);
    expect(lineages[1]?.name).toBe('Daybreak');
  });

  it('orders versions newest first, whatever order the server sent', () => {
    const lineages = groupIntoLineages([
      buildStyleProfile({ lineageId: LINEAGE_A, version: 1 }),
      buildStyleProfile({
        id: styleId('44444444-4444-4444-8444-444444444444'),
        lineageId: LINEAGE_A,
        version: 3,
      }),
      buildStyleProfile({
        id: styleId('55555555-5555-4555-8555-555555555555'),
        lineageId: LINEAGE_A,
        version: 2,
      }),
    ]);

    expect(lineages[0]?.newestFirst.map((version) => version.version)).toEqual([
      3, 2, 1,
    ]);
  });

  it('names the approved version, and leaves it undefined when none is', () => {
    const withNone = groupIntoLineages([
      buildStyleProfile({ lineageId: LINEAGE_A, version: 1 }),
    ]);

    expect(withNone[0]?.approved).toBeUndefined();

    const withOne = groupIntoLineages([
      buildStyleProfile({ lineageId: LINEAGE_A, version: 1, approved: true }),
      buildStyleProfile({
        id: styleId('66666666-6666-4666-8666-666666666666'),
        lineageId: LINEAGE_A,
        version: 2,
      }),
    ]);

    expect(withOne[0]?.approved?.version).toBe(1);
  });

  it('takes the lineage name from its newest version, not its oldest', () => {
    const lineages = groupIntoLineages([
      buildStyleProfile({ lineageId: LINEAGE_A, version: 1, name: 'Old name' }),
      buildStyleProfile({
        id: styleId('77777777-7777-4777-8777-777777777777'),
        lineageId: LINEAGE_A,
        version: 2,
        name: 'Renamed',
      }),
    ]);

    expect(lineages[0]?.name).toBe('Renamed');
  });
});
