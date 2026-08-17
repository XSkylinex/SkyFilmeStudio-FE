import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const SystemPage: FC = () => (
  <EmptyState
    title="System"
    description="Hardware, installed models, disk space and offline mode for this installation. Not connected to the orchestrator yet."
  />
);
