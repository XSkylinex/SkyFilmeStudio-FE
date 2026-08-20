import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { ConnectionState } from './connection-indicator.interface';

export const CONNECTION_STATE = {
  UNKNOWN: 'unknown',
  CONNECTING: 'connecting',
  OPEN: 'open',
  CLOSED: 'closed',
  RECONNECTING: 'reconnecting',
} satisfies Record<string, ConnectionState>;

export const DEFAULT_CONNECTION_STATE: ConnectionState =
  CONNECTION_STATE.UNKNOWN;

export const CONNECTION_STATE_TONE = {
  unknown: STATUS_TONE.CHECKING,
  connecting: STATUS_TONE.CHECKING,
  open: STATUS_TONE.SUCCESS,
  closed: STATUS_TONE.DANGER,
  reconnecting: STATUS_TONE.WARNING,
} satisfies Record<ConnectionState, StatusTone>;

export const CONNECTION_STATE_LABEL_KEY = {
  unknown: 'connection.unknown.label',
  connecting: 'connection.connecting.label',
  open: 'connection.open.label',
  closed: 'connection.closed.label',
  reconnecting: 'connection.reconnecting.label',
} satisfies Record<ConnectionState, TranslationKey>;

export const CONNECTION_STATE_DESCRIPTION_KEY = {
  unknown: 'connection.unknown.description',
  connecting: 'connection.connecting.description',
  open: 'connection.open.description',
  closed: 'connection.closed.description',
  reconnecting: 'connection.reconnecting.description',
} satisfies Record<ConnectionState, TranslationKey>;
