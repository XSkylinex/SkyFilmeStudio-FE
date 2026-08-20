import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '@/shell/store';

type RenderInStoreResult = ReturnType<typeof render>;

export const renderInStore = (ui: ReactElement): RenderInStoreResult => {
  const store = createStore();
  const result = render(<Provider store={store}>{ui}</Provider>);

  return {
    ...result,
    rerender: (next: ReactNode) =>
      result.rerender(<Provider store={store}>{next}</Provider>),
  };
};
