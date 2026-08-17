import type { HeadingLevel } from '@/lib/interfaces/heading-level';

export const HEADING_TAG = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} satisfies Record<HeadingLevel, `h${HeadingLevel}`>;
