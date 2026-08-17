import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const StoryboardPage: FC = () => (
  <EmptyState
    title="Storyboard"
    description="Review this production's keyframes scene by scene before they render. Not connected to the orchestrator yet."
  />
);
