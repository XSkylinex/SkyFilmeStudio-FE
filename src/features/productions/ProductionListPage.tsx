import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const ProductionListPage: FC = () => (
  <EmptyState
    title="Productions"
    description="Every production in this project, from screenplay to final cut. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
