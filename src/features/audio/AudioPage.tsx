import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import {
  productionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import {
  PRODUCTION_ID_PARAM,
  PROJECT_ID_PARAM,
} from '@/shell/routes/routes.constants';
import { DialogueReview } from '@/features/audio/components/dialogue-review';

export const AudioPage: FC = () => {
  const translate = useTranslate();
  const params = useParams();
  const projectId = projectIdSchema.safeParse(params[PROJECT_ID_PARAM]);
  const productionId = productionIdSchema.safeParse(
    params[PRODUCTION_ID_PARAM],
  );

  if (!projectId.success || !productionId.success) {
    return (
      <ErrorState
        title={translate('project.invalidId.title')}
        description={translate('project.invalidId.description')}
        headingLevel={1}
      />
    );
  }

  return (
    <DialogueReview
      projectId={projectId.data}
      productionId={productionId.data}
    />
  );
};
