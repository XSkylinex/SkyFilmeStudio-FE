import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PRODUCTION_ID_PARAM } from '@/shell/routes/routes.constants';
import { ShotReviewQueue } from '@/features/shots/components/shot-review-queue';

export const ShotsPage: FC = () => {
  const translate = useTranslate();
  const params = useParams();
  const productionId = productionIdSchema.safeParse(
    params[PRODUCTION_ID_PARAM],
  );

  if (!productionId.success) {
    return (
      <ErrorState
        title={translate('project.invalidId.title')}
        description={translate('project.invalidId.description')}
        headingLevel={1}
      />
    );
  }

  return <ShotReviewQueue productionId={productionId.data} />;
};
