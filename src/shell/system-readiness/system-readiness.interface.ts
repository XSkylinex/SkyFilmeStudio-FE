import type { HeadingLevel } from '@/lib/interfaces/heading-level';

export type SystemReadinessState = 'unknown' | 'ready' | 'blocked';

export interface SystemReadinessView {
  readonly state: SystemReadinessState;
  readonly failed: number;
  readonly total: number;
}

export interface SystemReadinessProps {
  headingLevel?: HeadingLevel | undefined;
}
