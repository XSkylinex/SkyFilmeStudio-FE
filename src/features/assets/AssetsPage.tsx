import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';

export const AssetsPage: FC = () => (
  <EmptyState
    title="Assets"
    description="The source footage, images and audio brought into this project. Not connected to the orchestrator yet."
  />
);
