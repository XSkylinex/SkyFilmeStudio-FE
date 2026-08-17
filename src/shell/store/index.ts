import { configureStore } from '@reduxjs/toolkit';
import { shellSlice, navCollapsedToggled } from '@/shell/shell.slice';
import { writeStoredNavCollapsed } from '@/shell/helpers/write-stored-nav-collapsed';
import { shellPersistenceListener } from './shell-persistence.listener';

shellPersistenceListener.startListening({
  actionCreator: navCollapsedToggled,
  effect: (_action, listenerApi) => {
    const { shell } = listenerApi.getState();
    writeStoredNavCollapsed(shell.navCollapsed);
  },
});

export const createStore = (): ReturnType<typeof configureStore> =>
  configureStore({
    reducer: { shell: shellSlice.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(shellPersistenceListener.middleware),
  });

export const store = createStore();
