import type { StyleProfile } from 'sky-filme-studio-be/contracts';

export interface StyleVersionDiffProps {
  readonly previous: StyleProfile;
  readonly current: StyleProfile;
}
