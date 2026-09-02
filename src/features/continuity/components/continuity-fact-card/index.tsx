import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { deleteContinuityFactMutationOptions } from '@/features/continuity/api/delete-continuity-fact.mutation';
import { describeScope } from '@/features/continuity/helpers/describe-scope';
import type { ContinuityFactCardProps } from './continuity-fact-card.interface';
import './continuity-fact-card.css';

export const ContinuityFactCard: FC<ContinuityFactCardProps> = ({
  productionId,
  fact,
  scenes,
  onFilterByEntity,
  onRemoved,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const remove = useMutation(
    deleteContinuityFactMutationOptions(productionId, queryClient),
  );
  const scope = describeScope(fact, scenes);
  const removeFailure =
    remove.error === null ? null : resolveRouteErrorView(remove.error);

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

      {removeFailure === null ? null : (
        <ErrorState
          title={translate('continuity.card.remove.failed.title')}
          description={composeRouteErrorDescription(removeFailure, translate)}
          detail={removeFailure.detail}
          headingLevel={4}
        />
      )}

      <div className="continuity-fact-card__actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`${translate('continuity.card.onlyEntity')}${translate(
            'continuity.card.onlyEntityContext',
            { property: fact.property, value: fact.value },
          )}`}
          onClick={() => onFilterByEntity(fact.entityId)}
        >
          {translate('continuity.card.onlyEntity')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`${translate('continuity.card.remove')} ${translate(
            'continuity.card.removeContext',
            { property: fact.property, value: fact.value },
          )}`}
          disabled={remove.isPending}
          onClick={() =>
            remove.mutate(fact.id, {
              onSuccess: () => onRemoved(fact.property),
            })
          }
        >
          {translate(
            remove.isPending
              ? 'continuity.card.removing'
              : 'continuity.card.remove',
          )}
        </Button>
      </div>
    </li>
  );
};
