import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const SubjectsPage: FC = () => (
  <EmptyState
    title="Subjects"
    description="The recurring people, characters and objects this project has identified for review. Not connected to the orchestrator yet."
    headingLevel={1}
  />
);
