import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const DashboardPage: FC = () => (
  <EmptyState
    title="Dashboard"
    description="This project's status at a glance: assets, subjects, creative library and productions. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
