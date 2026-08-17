import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const PlannerPage: FC = () => (
  <EmptyState
    title="Plan"
    description="The screenplay or production plan driving this production. Not connected to the orchestrator yet."
  />
);
