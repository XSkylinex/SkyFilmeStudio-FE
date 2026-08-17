import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const ProjectListPage: FC = () => (
  <EmptyState
    title="Projects"
    description="Every Local AI Studio project on this machine. Not connected to the orchestrator yet."
  />
);
