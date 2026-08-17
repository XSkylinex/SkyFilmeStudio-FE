import { useContext } from 'react';
import { ConnectionStateContext } from './connection-state.context';
import type { ConnectionStateContextValue } from './connection-indicator.interface';

export const useConnectionState = (): ConnectionStateContextValue => {
  const value = useContext(ConnectionStateContext);

  if (!value) {
    throw new Error(
      'useConnectionState must be used within a ConnectionStateProvider.',
    );
  }

  return value;
};
