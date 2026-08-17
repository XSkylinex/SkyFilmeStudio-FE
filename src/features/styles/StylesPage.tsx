import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const StylesPage: FC = () => (
  <EmptyState
    title="Styles"
    description="The visual styles available to this project. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
