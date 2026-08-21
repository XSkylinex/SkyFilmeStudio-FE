import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { assetDetailQueryOptions } from '@/features/assets/api/asset-detail.query';
import { AssetFacts } from '@/features/assets/components/asset-facts';
import { AssetMetadata } from '@/features/assets/components/asset-metadata';
import { AssetProxyPlayer } from '@/features/assets/components/asset-proxy-player';
import type { AssetDetailProps } from './asset-detail.interface';
import './asset-detail.css';

export const AssetDetail: FC<AssetDetailProps> = ({ projectId, assetId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    assetDetailQueryOptions(projectId, assetId),
  );

  if (error) {
    const errorView = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('assetDetail.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
      />
    );
  }

  if (isPending) {
    return (
      <output className="asset-detail__loading">
        {translate('assetDetail.loading')}
        <Skeleton shape="rect" />
      </output>
    );
  }

  return (
    <div className="asset-detail">
      <AssetFacts asset={data} />
      <AssetProxyPlayer projectId={projectId} asset={data} />
      <AssetMetadata metadata={data.metadataJson} />

      <section className="asset-detail__unavailable">
        <h2 className="asset-detail__unavailable-title">
          {translate('assetDetail.derived.title')}
        </h2>
        <p>{translate('assetDetail.derived.unavailable')}</p>
      </section>

      <section className="asset-detail__unavailable">
        <h2 className="asset-detail__unavailable-title">
          {translate('assetDetail.subjects.title')}
        </h2>
        <p>{translate('assetDetail.subjects.unavailable')}</p>
      </section>
    </div>
  );
};
