import type { FC } from 'react';
import { Skeleton } from '@/lib/components/skeleton';
import './route-hydrate-fallback.css';

const ROUTE_HYDRATE_FALLBACK_LABEL = 'Loading this page';

export const RouteHydrateFallback: FC = () => (
  <output
    className="route-hydrate-fallback"
    aria-label={ROUTE_HYDRATE_FALLBACK_LABEL}
  >
    <Skeleton shape="rect" />
    <Skeleton shape="text" />
    <Skeleton shape="text" />
  </output>
);
