import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const TimelinePage: FC = () => (
  <EmptyState
    title="Timeline"
    description="This production's assembled cut and final export. Not connected to the orchestrator yet."
  />
);
