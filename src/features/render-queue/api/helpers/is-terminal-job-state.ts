import { TERMINAL_JOB_STATES } from 'sky-filme-studio-be/contracts';
import type { JobState } from 'sky-filme-studio-be/contracts';

const TERMINAL_STATES: readonly JobState[] = TERMINAL_JOB_STATES;

export const isTerminalJobState = (state: JobState | undefined): boolean =>
  state !== undefined && TERMINAL_STATES.includes(state);
