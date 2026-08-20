import type { FC } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FatalBoundary } from '@/shell/fatal-boundary';
import { createQueryClient } from '@/lib/query/query-client';
import { routeTree } from '@/shell/routes/route-tree';
import { store } from '@/shell/store';

const router = createBrowserRouter(routeTree);
const queryClient = createQueryClient();

export const App: FC = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <FatalBoundary>
        <RouterProvider router={router} />
      </FatalBoundary>
    </QueryClientProvider>
  </Provider>
);
