import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { Badge } from '@/lib/components/badge';
import { useConnectionState } from './use-connection-state';
import {
  CONNECTION_STATE_DESCRIPTION_KEY,
  CONNECTION_STATE_LABEL_KEY,
  CONNECTION_STATE_TONE,
} from './connection-indicator.constants';
import './connection-indicator.css';

export const ConnectionIndicator: FC = () => {
  const translate = useTranslate();
  const { connectionState } = useConnectionState();

  return (
    <div className="connection-indicator" data-state={connectionState}>
      <Badge
        tone={CONNECTION_STATE_TONE[connectionState]}
        label={translate(CONNECTION_STATE_LABEL_KEY[connectionState])}
      />
      <p>{translate(CONNECTION_STATE_DESCRIPTION_KEY[connectionState])}</p>
    </div>
  );
};
