import type { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FatalBoundary } from '@/shell/fatal-boundary';
import { routeTree } from '@/shell/routes/route-tree';

const router = createBrowserRouter(routeTree);

export const App: FC = () => (
  <FatalBoundary>
    <RouterProvider router={router} />
  </FatalBoundary>
);
