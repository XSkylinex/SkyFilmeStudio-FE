import type { FC } from 'react';
import { useState } from 'react';
import { ConnectionStateContext } from '../connection-state.context';
import { DEFAULT_CONNECTION_STATE } from '../connection-indicator.constants';
import type {
  ConnectionState,
  ConnectionStateContextValue,
} from '../connection-indicator.interface';
import type { ConnectionStateProviderProps } from './connection-state-provider.interface';

export const ConnectionStateProvider: FC<ConnectionStateProviderProps> = ({
  children,
}) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    DEFAULT_CONNECTION_STATE,
  );

  const value: ConnectionStateContextValue = {
    connectionState,
    setConnectionState,
  };

  return (
    <ConnectionStateContext.Provider value={value}>
      {children}
    </ConnectionStateContext.Provider>
  );
};
