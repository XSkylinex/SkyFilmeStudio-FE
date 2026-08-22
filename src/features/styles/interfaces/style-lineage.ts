import type {
  StyleProfile,
  StyleProfileId,
} from 'sky-filme-studio-be/contracts';

export interface StyleLineage {
  readonly lineageId: StyleProfileId;
  readonly name: string;
  readonly newestFirst: readonly StyleProfile[];
  readonly approved: StyleProfile | undefined;
}
