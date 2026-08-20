import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const RenderQueuePage: FC = () => (
  <EmptyState
    title="Render queue"
    description="Every render job for this production and how far each one has progressed. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
