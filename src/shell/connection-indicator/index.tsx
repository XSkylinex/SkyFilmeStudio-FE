import type { FC } from 'react';
import { Badge } from '@/lib/components/badge';
import { useConnectionState } from './use-connection-state';
import {
  CONNECTION_STATE_DESCRIPTION,
  CONNECTION_STATE_LABEL,
  CONNECTION_STATE_TONE,
} from './connection-indicator.constants';
import './connection-indicator.css';

export const ConnectionIndicator: FC = () => {
  const { connectionState } = useConnectionState();

  return (
    <div className="connection-indicator" data-state={connectionState}>
      <Badge
        tone={CONNECTION_STATE_TONE[connectionState]}
        label={CONNECTION_STATE_LABEL[connectionState]}
      />
      <p>{CONNECTION_STATE_DESCRIPTION[connectionState]}</p>
    </div>
  );
};
