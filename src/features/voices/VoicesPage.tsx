import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const VoicesPage: FC = () => (
  <EmptyState
    title="Voices"
    description="The voices available for narration and dialogue in this project. Not connected to the orchestrator yet."
  />
);
