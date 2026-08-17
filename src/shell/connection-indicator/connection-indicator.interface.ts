export type ConnectionState = 'connecting' | 'open' | 'closed' | 'reconnecting';

export interface ConnectionStateContextValue {
  readonly connectionState: ConnectionState;
  readonly setConnectionState: (connectionState: ConnectionState) => void;
}
