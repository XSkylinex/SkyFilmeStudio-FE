import type { PageCursor } from 'sky-filme-studio-be/contracts';

export interface ContinuityFactFilter {
  entityId?: string | undefined;
  property?: string | undefined;
  cursor?: PageCursor | undefined;
}
