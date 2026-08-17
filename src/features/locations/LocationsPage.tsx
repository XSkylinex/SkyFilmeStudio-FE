import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const LocationsPage: FC = () => (
  <EmptyState
    title="Locations"
    description="The locations available to this project. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
