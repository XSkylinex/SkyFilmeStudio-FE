import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const NotFoundPage: FC = () => (
  <EmptyState
    title="Page not found"
    description="Nothing in Local AI Studio matches this address."
    headingLevel={1}
  />
);
