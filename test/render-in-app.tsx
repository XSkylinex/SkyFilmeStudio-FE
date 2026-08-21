import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStore } from '@/shell/store';

type RenderInAppResult = ReturnType<typeof render>;

export const renderInApp = (ui: ReactElement): RenderInAppResult => {
  const store = createStore();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const withProviders = (node: ReactNode): ReactElement => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>
    </Provider>
  );

  const result = render(withProviders(ui));

  return {
    ...result,
    rerender: (next: ReactNode) => result.rerender(withProviders(next)),
  };
};
