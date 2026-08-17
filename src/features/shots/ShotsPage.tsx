import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const ShotsPage: FC = () => (
  <EmptyState
    title="Shots"
    description="Every shot in this production and its current review state. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
