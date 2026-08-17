import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type { ShellSliceRootState } from '@/shell/interfaces/shell-state';

export type RootState = ShellSliceRootState;

export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;
