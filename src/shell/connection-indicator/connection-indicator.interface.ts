export type ConnectionState =
  'unknown' | 'connecting' | 'open' | 'closed' | 'reconnecting';

export interface ConnectionStateContextValue {
  readonly connectionState: ConnectionState;
  readonly setConnectionState: (connectionState: ConnectionState) => void;
}
