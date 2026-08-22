import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approvePropMutationOptions } from '@/features/props/api/approve-prop.mutation';
import type { PropCardProps } from './prop-card.interface';
import './prop-card.css';

export const PropCard: FC<PropCardProps> = ({ projectId, prop }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const approve = useMutation(
    approvePropMutationOptions(projectId, queryClient),
  );

  return (
    <li className="prop-card">
      <div className="prop-card__header">
        <h3 className="prop-card__name">
          <ContentText>{prop.name}</ContentText>
        </h3>
        <Badge
          tone={prop.approved ? STATUS_TONE.SUCCESS : STATUS_TONE.WARNING}
          label={translate(
            prop.approved ? 'props.card.approved' : 'props.card.draft',
          )}
        />
        {prop.ownerSubjectId === undefined ? null : (
          <Badge
            tone={STATUS_TONE.NEUTRAL}
            label={translate('props.card.owned')}
          />
        )}
      </div>

      {prop.canonicalDescription ? (
        <p className="prop-card__description">
          <ContentText>{prop.canonicalDescription}</ContentText>
        </p>
      ) : null}

      <h4 className="prop-card__subtitle">
        {translate('props.card.continuityRules')}
      </h4>
      {prop.continuityRules.length === 0 ? (
        <p className="prop-card__none">
          {translate('props.card.noContinuityRules')}
        </p>
      ) : (
        <ul className="prop-card__rules">
          {prop.continuityRules.map((rule) => (
            <li key={rule}>
              <ContentText>{rule}</ContentText>
            </li>
          ))}
        </ul>
      )}

      <p className="prop-card__appearances">
        {translate('props.card.appearancesUnavailable')}
      </p>

      {approve.error ? (
        <div className="prop-card__refusal" role="alert">
          <ErrorState
            title={translate('props.approveError.title')}
            description={composeRouteErrorDescription(
              resolveRouteErrorView(approve.error),
              translate,
            )}
            detail={resolveRouteErrorView(approve.error).detail}
            headingLevel={4}
          />
        </div>
      ) : null}

      {prop.approved ? null : (
        <ApprovalControls
          contextLabel={translate('props.card.context', { name: prop.name })}
          onApprove={() => approve.mutate(prop.id)}
          regenerationModes={[]}
          onRegenerate={() => undefined}
          pending={approve.isPending}
          decided={false}
        />
      )}
    </li>
  );
};
