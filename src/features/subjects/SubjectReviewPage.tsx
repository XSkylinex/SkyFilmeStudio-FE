import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const SubjectReviewPage: FC = () => (
  <EmptyState
    title="Subject review"
    description="Compare a subject's candidate reference images and approve the ones that define it. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
