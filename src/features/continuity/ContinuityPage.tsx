import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PRODUCTION_ID_PARAM } from '@/shell/routes/routes.constants';
import { ContinuityFactList } from '@/features/continuity/components/continuity-fact-list';
import { PlanningContextPanel } from '@/features/continuity/components/planning-context-panel';
import { CONTINUITY_GAP_KEYS } from '@/features/continuity/continuity.constants';
import './continuity-page.css';

export const ContinuityPage: FC = () => {
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

  return (
    <div className="continuity-page">
      <h1 className="continuity-page__title">
        {translate('page.continuity.title')}
      </h1>
      <p className="continuity-page__description">
        {translate('page.continuity.description')}
      </p>

      <ContinuityFactList productionId={productionId.data} />

      <PlanningContextPanel productionId={productionId.data} />

      <section className="continuity-page__gaps">
        <h2 className="continuity-page__gaps-title">
          {translate('continuity.gaps.heading')}
        </h2>
        <ul className="continuity-page__gaps-list">
          {CONTINUITY_GAP_KEYS.map((key) => (
            <li key={key}>{translate(key)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};
