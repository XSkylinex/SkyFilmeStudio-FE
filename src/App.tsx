import type { FC } from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FatalBoundary } from '@/shell/fatal-boundary';
import { routeTree } from '@/shell/routes/route-tree';
import { store } from '@/shell/store';

const router = createBrowserRouter(routeTree);

export const App: FC = () => (
  <Provider store={store}>
    <FatalBoundary>
      <RouterProvider router={router} />
    </FatalBoundary>
  </Provider>
);
