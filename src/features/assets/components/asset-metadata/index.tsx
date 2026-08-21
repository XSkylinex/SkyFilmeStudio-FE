import type { FC } from 'react';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { describeMetadataValue } from '@/features/assets/helpers/describe-metadata-value';
import type { AssetMetadataProps } from './asset-metadata.interface';
import './asset-metadata.css';

export const AssetMetadata: FC<AssetMetadataProps> = ({ metadata }) => {
  const translate = useTranslate();
  const entries = Object.entries(metadata)
    .map(([key, value]) => ({ key, described: describeMetadataValue(value) }))
    .filter(
      (entry): entry is { key: string; described: string } =>
        entry.described !== undefined,
    );

  return (
    <section className="asset-metadata">
      <h2 className="asset-metadata__title">
        {translate('assetDetail.probe.title')}
      </h2>

      {entries.length === 0 ? (
        <p className="asset-metadata__empty">
          {translate('assetDetail.probe.empty')}
        </p>
      ) : (
        <>
          <p className="asset-metadata__caveat">
            {translate('assetDetail.probe.unpublished')}
          </p>
          <dl className="asset-metadata__entries">
            {entries.map((entry) => (
              <div className="asset-metadata__entry" key={entry.key}>
                <dt className="asset-metadata__key">
                  <span dir="ltr">{entry.key}</span>
                </dt>
                <dd className="asset-metadata__value">
                  <ContentText>{entry.described}</ContentText>
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
};
