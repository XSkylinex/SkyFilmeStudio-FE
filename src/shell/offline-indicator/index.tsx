import type { FC } from 'react';
import { Badge } from '@/lib/components/badge';
import { resolveOfflineIndicatorMode } from './helpers/resolve-offline-indicator-mode';
import {
  OFFLINE_INDICATOR_MODE_DESCRIPTION,
  OFFLINE_INDICATOR_MODE_LABEL,
  OFFLINE_INDICATOR_MODE_TONE,
} from './offline-indicator.constants';
import type { OfflineIndicatorProps } from './offline-indicator.interface';
import './offline-indicator.css';

export const OfflineIndicator: FC<OfflineIndicatorProps> = ({
  offlineMode,
}) => {
  const mode = resolveOfflineIndicatorMode(offlineMode);

  return (
    <div className="offline-indicator" data-mode={mode}>
      <Badge
        tone={OFFLINE_INDICATOR_MODE_TONE[mode]}
        label={OFFLINE_INDICATOR_MODE_LABEL[mode]}
      />
      <p>{OFFLINE_INDICATOR_MODE_DESCRIPTION[mode]}</p>
    </div>
  );
};
