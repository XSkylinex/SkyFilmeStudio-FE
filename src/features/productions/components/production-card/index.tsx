import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { formatDuration } from '@/lib/format/format-duration';
import { useTranslate } from '@/lib/i18n/use-translate';
import { PRODUCTION_STATE_TONE } from '@/lib/status-tone/production-state.tone';
import { productionPlanPath } from '@/shell/routes/routes.constants';
import {
  NARRATIVE_MODE_LABEL,
  PRODUCTION_KIND_LABEL,
  PRODUCTION_STATE_LABEL,
} from '@/features/productions/productions.constants';
import type { ProductionCardProps } from './production-card.interface';
import './production-card.css';

export const ProductionCard: FC<ProductionCardProps> = ({
  projectId,
  production,
}) => {
  const translate = useTranslate();

  let toleranceValue: ReactNode;

  if (production.runtimeToleranceSeconds !== undefined) {
    toleranceValue = (
      <span className="production-card__notation" dir="ltr">
        {formatDuration(production.runtimeToleranceSeconds)}
      </span>
    );
  } else if (production.productionProfileId !== undefined) {
    toleranceValue = translate('productions.card.toleranceFromProfile');
  } else {
    toleranceValue = translate('productions.card.toleranceUndeclared');
  }

  const toleranceUndeclared =
    production.runtimeToleranceSeconds === undefined &&
    production.productionProfileId === undefined;

  return (
    <li className="production-card">
      <div className="production-card__header">
        <Link
          className="production-card__link"
          to={productionPlanPath(projectId, production.id)}
          aria-label={translate('productions.card.open', {
            title: production.title,
          })}
        >
          <h3 className="production-card__title">
            <ContentText>{production.title}</ContentText>
          </h3>
        </Link>
        <Badge
          tone={PRODUCTION_STATE_TONE[production.state]}
          label={translate(PRODUCTION_STATE_LABEL[production.state])}
        />
      </div>

      <dl className="production-card__figures">
        <div className="production-card__figure">
          <dt>{translate('productions.kind.label')}</dt>
          <dd>{translate(PRODUCTION_KIND_LABEL[production.productionKind])}</dd>
        </div>

        <div className="production-card__figure">
          <dt>{translate('productions.mode.label')}</dt>
          <dd>{translate(NARRATIVE_MODE_LABEL[production.narrativeMode])}</dd>
        </div>

        <div className="production-card__figure">
          <dt>{translate('productions.card.target')}</dt>
          <dd>
            <span className="production-card__notation" dir="ltr">
              {formatDuration(production.targetRuntimeSeconds)}
            </span>
          </dd>
        </div>

        {production.sequenceNumber === undefined ? null : (
          <div className="production-card__figure">
            <dt>{translate('productions.card.sequence')}</dt>
            <dd>
              <span className="production-card__notation" dir="ltr">
                {production.sequenceNumber}
              </span>
            </dd>
          </div>
        )}

        <div className="production-card__figure">
          <dt>{translate('productions.card.tolerance')}</dt>
          <dd>{toleranceValue}</dd>
        </div>

        <div className="production-card__figure">
          <dt>{translate('productions.card.planVersion')}</dt>
          <dd>
            <span className="production-card__notation" dir="ltr">
              {production.planVersion}
            </span>
          </dd>
        </div>

        <div className="production-card__figure">
          <dt>{translate('productions.card.screenplayVersion')}</dt>
          <dd>
            {production.screenplayVersion === undefined ? (
              translate('productions.card.noScreenplayVersion')
            ) : (
              <span className="production-card__notation" dir="ltr">
                {production.screenplayVersion}
              </span>
            )}
          </dd>
        </div>
      </dl>

      {toleranceUndeclared ? (
        <p className="production-card__tolerance-detail">
          {translate('productions.card.toleranceUndeclared.detail')}
        </p>
      ) : null}
    </li>
  );
};
