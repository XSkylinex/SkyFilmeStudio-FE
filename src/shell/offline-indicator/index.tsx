import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { Badge } from '@/lib/components/badge';
import { resolveOfflineIndicatorView } from './helpers/resolve-offline-indicator-view';
import {
  OFFLINE_INDICATOR_FACT_DESCRIPTION_KEY,
  OFFLINE_INDICATOR_HEADLINE_LABEL_KEY,
  OFFLINE_INDICATOR_HEADLINE_TONE,
} from './offline-indicator.constants';
import type { OfflineIndicatorProps } from './offline-indicator.interface';
import './offline-indicator.css';

export const OfflineIndicator: FC<OfflineIndicatorProps> = ({
  offlineMode,
}) => {
  const translate = useTranslate();
  const { headline, facts } = resolveOfflineIndicatorView(offlineMode);
  const description = facts
    .map((fact) => translate(OFFLINE_INDICATOR_FACT_DESCRIPTION_KEY[fact]))
    .join(' ');

  return (
    <div
      className="offline-indicator"
      data-mode={headline}
      data-lan-workers={facts.includes('lan-workers')}
    >
      <Badge
        tone={OFFLINE_INDICATOR_HEADLINE_TONE[headline]}
        label={translate(OFFLINE_INDICATOR_HEADLINE_LABEL_KEY[headline])}
      />
      <p>{description}</p>
    </div>
  );
};
