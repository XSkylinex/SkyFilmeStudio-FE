import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const PropsPage: FC = () => (
  <EmptyState
    title="Props"
    description="The props available to this project. Not connected to the orchestrator yet."
  />
);
