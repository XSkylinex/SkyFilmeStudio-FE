import type { FC } from 'react';
import { Skeleton } from '@/lib/components/skeleton';

export const RouteHydrateFallback: FC = () => (
  <div aria-hidden="true">
    <Skeleton shape="rect" />
    <Skeleton shape="text" />
    <Skeleton shape="text" />
  </div>
);
