import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/lib/components/button';
import { EmptyState } from '@/lib/components/empty-state';
import { API_PATH } from '@/lib/api/api.constants';
import { mediaUrl } from '@/lib/api/media-url';
import { useTranslate } from '@/lib/i18n/use-translate';
import { showsAThumbnail } from '@/features/assets/helpers/shows-a-thumbnail';
import type { AssetProxyPlayerProps } from './asset-proxy-player.interface';
import './asset-proxy-player.css';

export const AssetProxyPlayer: FC<AssetProxyPlayerProps> = ({
  projectId,
  asset,
}) => {
  const translate = useTranslate();
  const [attempt, setAttempt] = useState(0);
  const [unplayable, setUnplayable] = useState(false);
  const isVideo = asset.type === 'VIDEO';

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

      {isVideo && unplayable ? (
        <EmptyState
          title={translate('assetDetail.proxy.absent.title')}
          description={translate('assetDetail.proxy.absent.description')}
          headingLevel={3}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setAttempt(attempt + 1);
                setUnplayable(false);
              }}
            >
              {translate('assetDetail.proxy.retry')}
            </Button>
          }
        />
      ) : null}

      {isVideo && !unplayable ? (
        <>
          <video
            key={attempt}
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
            onError={() => setUnplayable(true)}
          />
          <p className="asset-proxy-player__purpose">
            {translate('assetDetail.proxy.purpose')}
          </p>
          <p className="asset-proxy-player__purpose">
            {translate('assetDetail.proxy.mayBeAbsent')}
          </p>
        </>
      ) : null}
    </section>
  );
};
