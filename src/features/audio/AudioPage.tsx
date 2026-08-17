import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const AudioPage: FC = () => (
  <EmptyState
    title="Audio"
    description="Music, dialogue and the mix for this production. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
