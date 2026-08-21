import type { HeadingLevel } from '@/lib/interfaces/heading-level';
import { SYSTEM_PANEL_DEFAULT_HEADING_LEVEL } from '@/features/system/system.constants';

const NEXT_HEADING_LEVEL: Record<HeadingLevel, HeadingLevel> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 6,
};

export const nextHeadingLevel = (
  level: HeadingLevel | undefined,
): HeadingLevel =>
  NEXT_HEADING_LEVEL[level ?? SYSTEM_PANEL_DEFAULT_HEADING_LEVEL];
