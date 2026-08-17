import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { ShellSliceRootState } from '@/shell/interfaces/shell-state';

export const shellPersistenceListener =
  createListenerMiddleware<ShellSliceRootState>();
