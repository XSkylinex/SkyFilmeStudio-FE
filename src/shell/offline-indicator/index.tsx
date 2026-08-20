import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { Badge } from '@/lib/components/badge';
import { resolveOfflineIndicatorFacts } from './helpers/resolve-offline-indicator-facts';
import {
  OFFLINE_INDICATOR_MODE_DESCRIPTION_KEY,
  OFFLINE_INDICATOR_MODE_LABEL_KEY,
  OFFLINE_INDICATOR_MODE_TONE,
} from './offline-indicator.constants';
import type { OfflineIndicatorProps } from './offline-indicator.interface';
import './offline-indicator.css';

export const OfflineIndicator: FC<OfflineIndicatorProps> = ({
  offlineMode,
}) => {
  const translate = useTranslate();
  const facts = resolveOfflineIndicatorFacts(offlineMode);
  const [headline] = facts;
  const mode = headline ?? 'unknown';
  const description = facts
    .map((fact) => translate(OFFLINE_INDICATOR_MODE_DESCRIPTION_KEY[fact]))
    .join(' ');

  return (
    <div className="offline-indicator" data-mode={mode}>
      <Badge
        tone={OFFLINE_INDICATOR_MODE_TONE[mode]}
        label={translate(OFFLINE_INDICATOR_MODE_LABEL_KEY[mode])}
      />
      <p>{description}</p>
    </div>
  );
};
