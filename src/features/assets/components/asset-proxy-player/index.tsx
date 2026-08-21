import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { API_PATH } from '@/lib/api/api.constants';
import { mediaUrl } from '@/lib/api/media-url';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { assetProxyAvailabilityQueryOptions } from '@/features/assets/api/asset-proxy-availability.query';
import { showsAThumbnail } from '@/features/assets/helpers/shows-a-thumbnail';
import type { AssetProxyPlayerProps } from './asset-proxy-player.interface';
import './asset-proxy-player.css';

export const AssetProxyPlayer: FC<AssetProxyPlayerProps> = ({
  projectId,
  asset,
}) => {
  const translate = useTranslate();
  const isVideo = asset.type === 'VIDEO';
  const { data, error, isPending, refetch } = useQuery({
    ...assetProxyAvailabilityQueryOptions(projectId, asset.id),
    enabled: isVideo,
  });
  const errorView = error ? resolveRouteErrorView(error) : undefined;

  return (
    <section className="asset-proxy-player">
      <h2 className="asset-proxy-player__title">
        {translate('assetDetail.proxy.title')}
      </h2>

      {!isVideo ? (
        <p className="asset-proxy-player__unsupported">
          {translate('assetDetail.proxy.unsupported')}
        </p>
      ) : null}

      {isVideo && errorView ? (
        <ErrorState
          title={translate('assetDetail.proxy.error.title')}
          description={composeRouteErrorDescription(errorView, translate)}
          detail={errorView.detail}
          headingLevel={3}
        />
      ) : null}

      {isVideo && isPending && !errorView ? <Skeleton shape="rect" /> : null}

      {isVideo && data === false ? (
        <EmptyState
          title={translate('assetDetail.proxy.absent.title')}
          description={translate('assetDetail.proxy.absent.description')}
          headingLevel={3}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void refetch()}
            >
              {translate('assetDetail.proxy.retry')}
            </Button>
          }
        />
      ) : null}

      {isVideo && data === true ? (
        <>
          <video
            className="asset-proxy-player__video"
            aria-label={translate('assetDetail.proxy.label', {
              path: asset.path,
            })}
            controls
            preload="metadata"
            playsInline
            poster={
              showsAThumbnail(asset.type)
                ? mediaUrl(API_PATH.projectAssetThumbnail(projectId, asset.id))
                : undefined
            }
            src={mediaUrl(API_PATH.projectAssetProxy(projectId, asset.id))}
          />
          <p className="asset-proxy-player__purpose">
            {translate('assetDetail.proxy.purpose')}
          </p>
        </>
      ) : null}
    </section>
  );
};
