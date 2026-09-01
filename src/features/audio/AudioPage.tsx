import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PRODUCTION_ID_PARAM } from '@/shell/routes/routes.constants';
import { DialogueReview } from '@/features/audio/components/dialogue-review';

export const AudioPage: FC = () => {
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

  return <DialogueReview productionId={productionId.data} />;
};
