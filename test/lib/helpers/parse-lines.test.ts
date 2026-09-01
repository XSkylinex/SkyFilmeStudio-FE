import { parseLines } from '@/lib/helpers/parse-lines';

describe('parseLines', () => {
  it('splits on newline and drops empty lines', () => {
    expect(parseLines('spiral stair\n\ncracked lantern glass\n')).toEqual([
      'spiral stair',
      'cracked lantern glass',
    ]);
  });

  it('trims stray whitespace from each line', () => {
    expect(parseLines('  spiral stair  \n  cracked lantern glass')).toEqual([
      'spiral stair',
      'cracked lantern glass',
    ]);
  });

  it('returns an empty array for blank input', () => {
    expect(parseLines('   \n  ')).toEqual([]);
  });
});
