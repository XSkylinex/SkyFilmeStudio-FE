import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  projectIdSchema,
  sourceAssetIdSchema,
} from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import {
  ASSET_ID_PARAM,
  PROJECT_ID_PARAM,
  projectAssetsPath,
} from '@/shell/routes/routes.constants';
import { AssetDetail } from '@/features/assets/components/asset-detail';
import './asset-detail-page.css';

export const AssetDetailPage: FC = () => {
  const translate = useTranslate();
  const params = useParams();
  const projectId = projectIdSchema.safeParse(params[PROJECT_ID_PARAM]);
  const assetId = sourceAssetIdSchema.safeParse(params[ASSET_ID_PARAM]);

  if (!projectId.success) {
    return (
      <ErrorState
        title={translate('project.invalidId.title')}
        description={translate('project.invalidId.description')}
        headingLevel={1}
      />
    );
  }

  if (!assetId.success) {
    return (
      <ErrorState
        title={translate('assetDetail.invalidAsset.title')}
        description={translate('assetDetail.invalidAsset.description')}
        headingLevel={1}
      />
    );
  }

  return (
    <div className="asset-detail-page">
      <Link
        className="asset-detail-page__back"
        to={projectAssetsPath(projectId.data)}
      >
        {translate('assetDetail.back')}
      </Link>

      <h1 className="asset-detail-page__title">
        {translate('page.assetDetail.title')}
      </h1>

      <AssetDetail projectId={projectId.data} assetId={assetId.data} />
    </div>
  );
};
