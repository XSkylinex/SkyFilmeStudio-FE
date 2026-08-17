import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const ShotReviewPage: FC = () => (
  <EmptyState
    title="Shot review"
    description="Compare a rendered shot against its reference and decide whether it stands. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
