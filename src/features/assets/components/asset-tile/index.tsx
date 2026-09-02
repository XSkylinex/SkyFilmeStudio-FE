import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/lib/components/badge';
import { MediaTile } from '@/lib/components/media-tile';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { API_PATH } from '@/lib/api/api.constants';
import { mediaUrl } from '@/lib/api/media-url';
import { formatDateTime } from '@/lib/format/format-date-time';
import { ORIGIN_LABEL_KEY } from '@/lib/i18n/origin-label.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { projectAssetPath } from '@/shell/routes/routes.constants';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import {
  ASSET_PRIVACY_LABEL_KEY,
  ASSET_TYPE_LABEL_KEY,
} from '@/features/assets/assets.constants';
import { showsAThumbnail } from '@/features/assets/helpers/shows-a-thumbnail';
import type { AssetTileProps } from './asset-tile.interface';
import './asset-tile.css';

export const AssetTile: FC<AssetTileProps> = ({ projectId, asset }) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const thumbnail = showsAThumbnail(asset.type)
    ? mediaUrl(API_PATH.projectAssetThumbnail(projectId, asset.id))
    : undefined;

  return (
    <li className="asset-tile">
      <Link
        className="asset-tile__link"
        to={projectAssetPath(projectId, asset.id)}
      >
        <MediaTile
          src={thumbnail}
          alt={translate('assets.thumbnailAlt', { path: asset.path })}
        />
        <span className="asset-tile__path" dir="ltr">
          {asset.path}
        </span>
      </Link>
      <div className="asset-tile__meta">
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(ASSET_TYPE_LABEL_KEY[asset.type])}
        />
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(ORIGIN_LABEL_KEY[asset.origin])}
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
      {asset.capturedAt ? (
        <p className="asset-tile__captured">
          {translate('assets.captured')}{' '}
          {formatDateTime(asset.capturedAt, interfaceLanguage)}
        </p>
      ) : null}
      {asset.immutable ? (
        <p className="asset-tile__immutable">{translate('assets.immutable')}</p>
      ) : null}
    </li>
  );
};
