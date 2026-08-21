import { configureStore } from '@reduxjs/toolkit';
import {
  shellSlice,
  navCollapsedToggled,
  interfaceLanguageSet,
  characterShortcutsEnabledSet,
} from '@/shell/shell.slice';
import { writeStoredNavCollapsed } from '@/shell/helpers/write-stored-nav-collapsed';
import { writeStoredInterfaceLanguage } from '@/lib/i18n/helpers/write-stored-interface-language';
import { writeStoredCharacterShortcutsEnabled } from '@/shell/helpers/write-stored-character-shortcuts-enabled';
import { createShellPersistenceListener } from './shell-persistence.listener';

export const createStore = () => {
  const persistence = createShellPersistenceListener();

  persistence.startListening({
    actionCreator: navCollapsedToggled,
    effect: (_action, listenerApi) => {
      writeStoredNavCollapsed(listenerApi.getState().shell.navCollapsed);
    },
  });

  persistence.startListening({
    actionCreator: interfaceLanguageSet,
    effect: (_action, listenerApi) => {
      writeStoredInterfaceLanguage(
        listenerApi.getState().shell.interfaceLanguage,
      );
    },
  });

  persistence.startListening({
    actionCreator: characterShortcutsEnabledSet,
    effect: (_action, listenerApi) => {
      writeStoredCharacterShortcutsEnabled(
        listenerApi.getState().shell.characterShortcutsEnabled,
      );
    },
  });

  return configureStore({
    reducer: { shell: shellSlice.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(persistence.middleware),
  });
};

export const store = createStore();
