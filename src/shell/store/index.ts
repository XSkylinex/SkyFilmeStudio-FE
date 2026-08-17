import { configureStore } from '@reduxjs/toolkit';
import { shellSlice, navCollapsedToggled } from '@/shell/shell.slice';
import { writeStoredNavCollapsed } from '@/shell/helpers/write-stored-nav-collapsed';
import { createShellPersistenceListener } from './shell-persistence.listener';

export const createStore = () => {
  const persistence = createShellPersistenceListener();

  persistence.startListening({
    actionCreator: navCollapsedToggled,
    effect: (_action, listenerApi) => {
      writeStoredNavCollapsed(listenerApi.getState().shell.navCollapsed);
    },
  });

  return configureStore({
    reducer: { shell: shellSlice.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(persistence.middleware),
  });
};

export const store = createStore();
