import type { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approvePlanMutationOptions } from '@/features/planner/api/approve-plan.mutation';
import { planningBudgetQueryOptions } from '@/features/planner/api/planning-budget.query';
import { PLAN_APPROVAL_STATE } from '@/features/planner/planner.constants';
import type { PlanApprovalProps } from './plan-approval.interface';
import './plan-approval.css';

export const PlanApproval: FC<PlanApprovalProps> = ({ production }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const budget = useQuery(planningBudgetQueryOptions(production.id));
  const approve = useMutation(
    approvePlanMutationOptions(
      production.projectId,
      production.id,
      queryClient,
    ),
  );

  const atTheGate =
    !approve.isSuccess && production.state === PLAN_APPROVAL_STATE;
  const failure =
    approve.error === null ? null : resolveRouteErrorView(approve.error);

  return (
    <section className="plan-approval">
      <h2 className="plan-approval__title">
        {translate('planner.approval.heading')}
      </h2>

      {approve.isSuccess ? (
        <output
          className="plan-approval__announcement"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('planner.approval.approved')}
        </output>
      ) : null}

      {atTheGate && budget.data?.withinTolerance === true ? (
        <>
          <p className="plan-approval__note">
            {translate('planner.approval.ready')}
          </p>
          <ApprovalControls
            contextLabel={translate('planner.approval.context', {
              title: production.title,
            })}
            onApprove={() => approve.mutate()}
            regenerationModes={[]}
            onRegenerate={() => undefined}
            pending={approve.isPending}
            decided={false}
          />
        </>
      ) : null}

      {atTheGate && budget.data?.withinTolerance === false ? (
        <EmptyState
          title={translate('planner.approval.blocked.title')}
          description={translate('planner.approval.blocked.description')}
          headingLevel={3}
        />
      ) : null}

      {approve.isSuccess || atTheGate ? null : (
        <EmptyState
          title={translate('planner.approval.wrongState.title')}
          description={translate('planner.approval.wrongState.description')}
          headingLevel={3}
        />
      )}

      {failure === null ? null : (
        <ErrorState
          title={translate('planner.approval.failed.title')}
          description={composeRouteErrorDescription(failure, translate)}
          detail={failure.detail}
          headingLevel={3}
        />
      )}
    </section>
  );
};
