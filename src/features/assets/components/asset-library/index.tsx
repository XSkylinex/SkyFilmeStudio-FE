import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { projectAssetsQueryOptions } from '@/features/assets/api/project-assets.query';
import { AssetTile } from '@/features/assets/components/asset-tile';
import { ASSET_GRID_SKELETON_COUNT } from '@/features/assets/assets.constants';
import type { AssetLibraryProps } from './asset-library.interface';
import './asset-library.css';

export const AssetLibrary: FC<AssetLibraryProps> = ({ projectId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    projectAssetsQueryOptions(projectId),
  );

  if (error) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('assets.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={2}
      />
    );
  }

  if (isPending) {
    return (
      <div className="asset-library">
        <output className="asset-library__loading">
          {translate('assets.loading')}
        </output>
        <ul className="asset-library__grid">
          {Array.from({ length: ASSET_GRID_SKELETON_COUNT }, (_, index) => (
            <li key={index} className="asset-library__placeholder">
              <Skeleton shape="rect" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        title={translate('assets.empty.title')}
        description={translate('assets.empty.description')}
        headingLevel={2}
      />
    );
  }

  return (
    <div className="asset-library">
      <ul className="asset-library__grid">
        {data.items.map((asset) => (
          <AssetTile key={asset.id} projectId={projectId} asset={asset} />
        ))}
      </ul>
    </div>
  );
};
