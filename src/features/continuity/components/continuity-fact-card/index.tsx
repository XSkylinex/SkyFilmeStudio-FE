import type { FC } from 'react';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import { describeScope } from '@/features/continuity/helpers/describe-scope';
import type { ContinuityFactCardProps } from './continuity-fact-card.interface';
import './continuity-fact-card.css';

export const ContinuityFactCard: FC<ContinuityFactCardProps> = ({
  fact,
  scenes,
  onFilterByEntity,
}) => {
  const translate = useTranslate();
  const scope = describeScope(fact, scenes);

  return (
    <li className="continuity-fact-card">
      <h3 className="continuity-fact-card__property">
        <ContentText>{fact.property}</ContentText>
      </h3>
      <p className="continuity-fact-card__value">
        <ContentText>{fact.value}</ContentText>
      </p>

      <dl className="continuity-fact-card__figures">
        <dt>{translate('continuity.card.scope')}</dt>
        <dd>{translate(scope.messageKey, scope.values)}</dd>

        <dt>{translate('continuity.card.source')}</dt>
        <dd>
          <ContentText>{fact.sourceEvent}</ContentText>
        </dd>

        <dt>{translate('continuity.card.entity')}</dt>
        <dd>
          <span className="continuity-fact-card__id" dir="ltr">
            {fact.entityId}
          </span>
        </dd>
      </dl>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={translate('continuity.card.onlyEntityContext', {
          property: fact.property,
        })}
        onClick={() => onFilterByEntity(fact.entityId)}
      >
        {translate('continuity.card.onlyEntity')}
      </Button>
    </li>
  );
};
