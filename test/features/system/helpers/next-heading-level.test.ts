import { nextHeadingLevel } from '@/features/system/helpers/next-heading-level';

describe('nextHeadingLevel', () => {
  it('goes one deeper, so content inside a panel does not become a sibling of its title', () => {
    expect(nextHeadingLevel(2)).toBe(3);
    expect(nextHeadingLevel(3)).toBe(4);
  });

  it('assumes the panel default when the caller did not choose one', () => {
    expect(nextHeadingLevel(undefined)).toBe(3);
  });

  it('stops at six rather than emitting a heading tag that does not exist', () => {
    expect(nextHeadingLevel(6)).toBe(6);
  });
});
