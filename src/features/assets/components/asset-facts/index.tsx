import type { FC } from 'react';
import { Badge } from '@/lib/components/badge';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { formatDateTime } from '@/lib/format/format-date-time';
import { useTranslate } from '@/lib/i18n/use-translate';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import {
  ASSET_ORIGIN_LABEL_KEY,
  ASSET_PRIVACY_LABEL_KEY,
  ASSET_TYPE_LABEL_KEY,
} from '@/features/assets/assets.constants';
import type { AssetFactsProps } from './asset-facts.interface';
import './asset-facts.css';

export const AssetFacts: FC<AssetFactsProps> = ({ asset }) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);

  return (
    <section className="asset-facts">
      <h2 className="asset-facts__title">
        {translate('assetDetail.identity.title')}
      </h2>

      <div className="asset-facts__badges">
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(ASSET_TYPE_LABEL_KEY[asset.type])}
        />
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(ASSET_ORIGIN_LABEL_KEY[asset.origin])}
        />
        <Badge
          tone={
            asset.privacyClass === 'EXPORTABLE'
              ? STATUS_TONE.ATTENTION
              : STATUS_TONE.NEUTRAL
          }
          label={translate(ASSET_PRIVACY_LABEL_KEY[asset.privacyClass])}
        />
      </div>

      {asset.privacyClass === 'EXPORTABLE' ? (
        <p className="asset-facts__exportable">
          {translate('assetDetail.exportable')}
        </p>
      ) : null}

      <dl className="asset-facts__fields">
        <div className="asset-facts__field">
          <dt>{translate('assetDetail.field.path')}</dt>
          <dd>
            <span className="asset-facts__notation" dir="ltr">
              {asset.path}
            </span>
          </dd>
        </div>
        <div className="asset-facts__field">
          <dt>{translate('assetDetail.field.mimeType')}</dt>
          <dd>
            <span className="asset-facts__notation" dir="ltr">
              {asset.mimeType}
            </span>
          </dd>
        </div>
        <div className="asset-facts__field">
          <dt>{translate('assetDetail.field.sha256')}</dt>
          <dd>
            <span className="asset-facts__checksum" dir="ltr">
              {asset.sha256}
            </span>
          </dd>
        </div>
        {asset.capturedAt ? (
          <div className="asset-facts__field">
            <dt>{translate('assetDetail.field.captured')}</dt>
            <dd>{formatDateTime(asset.capturedAt, interfaceLanguage)}</dd>
          </div>
        ) : null}
        <div className="asset-facts__field">
          <dt>{translate('assetDetail.field.added')}</dt>
          <dd>{formatDateTime(asset.createdAt, interfaceLanguage)}</dd>
        </div>
      </dl>

      {asset.immutable ? (
        <p className="asset-facts__immutable">
          {translate('assets.immutable')}
        </p>
      ) : null}
    </section>
  );
};
