import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import type { ConnectionState } from './connection-indicator.interface';

export const CONNECTION_STATE = {
  CONNECTING: 'connecting',
  OPEN: 'open',
  CLOSED: 'closed',
  RECONNECTING: 'reconnecting',
} satisfies Record<string, ConnectionState>;

export const DEFAULT_CONNECTION_STATE: ConnectionState =
  CONNECTION_STATE.CONNECTING;

export const CONNECTION_STATE_TONE = {
  connecting: STATUS_TONE.CHECKING,
  open: STATUS_TONE.SUCCESS,
  closed: STATUS_TONE.DANGER,
  reconnecting: STATUS_TONE.WARNING,
} satisfies Record<ConnectionState, StatusTone>;

export const CONNECTION_STATE_LABEL = {
  connecting: 'Connecting',
  open: 'Connected',
  closed: 'Disconnected',
  reconnecting: 'Reconnecting',
} satisfies Record<ConnectionState, string>;

export const CONNECTION_STATE_DESCRIPTION = {
  connecting: 'Connecting to the orchestrator.',
  open: 'Connected to the orchestrator. Render progress updates live.',
  closed:
    'The live connection to the orchestrator is down. On this machine that usually means the orchestrator process stopped, and any render in progress stopped with it.',
  reconnecting:
    'Reconnecting to the orchestrator. Render progress may be behind until this recovers.',
} satisfies Record<ConnectionState, string>;
