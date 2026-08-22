import type { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { APPROVAL_STATE } from 'sky-filme-studio-be/contracts';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { ContentText } from '@/lib/components/content-text';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { formatDateTime } from '@/lib/format/format-date-time';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import { canonicalSetsQueryOptions } from '@/features/subjects/api/canonical-sets.query';
import { approveCanonicalSetMutationOptions } from '@/features/subjects/api/approve-canonical-set.mutation';
import { CanonicalReferences } from '@/features/subjects/components/canonical-references';
import type { CanonicalDraftProps } from './canonical-draft.interface';
import './canonical-draft.css';

export const CanonicalDraft: FC<CanonicalDraftProps> = ({
  projectId,
  subjectId,
  subjectName,
}) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const queryClient = useQueryClient();
  const sets = useQuery(canonicalSetsQueryOptions(projectId, subjectId));
  const approve = useMutation(
    approveCanonicalSetMutationOptions(projectId, subjectId, queryClient),
  );

  if (sets.error && sets.data === undefined) {
    const errorView = resolveRouteErrorView(sets.error);

    return (
      <ErrorState
        title={translate('subjectReview.draft.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
        headingLevel={2}
      />
    );
  }

  if (sets.isPending) {
    return <Skeleton shape="rect" />;
  }

  const draft = sets.data.find(
    (set) => set.approvalState === APPROVAL_STATE.PENDING,
  );

  return (
    <section className="canonical-draft">
      <h2 className="canonical-draft__title">
        {translate('subjectReview.draft.title')}
      </h2>

      {draft === undefined ? (
        approve.isSuccess ? (
          <output
            className="canonical-draft__approved"
            ref={focusWhenShown}
            tabIndex={-1}
          >
            {translate('subjectReview.draft.approved')}
          </output>
        ) : (
          <>
            <EmptyState
              title={translate('subjectReview.draft.none.title')}
              description={translate('subjectReview.draft.none.description')}
              headingLevel={3}
            />
            <p className="canonical-draft__explained">
              {translate('subjectReview.draft.cannotOpen')}
            </p>
          </>
        )
      ) : (
        <>
          <p className="canonical-draft__fact">
            {translate('subjectReview.draft.opened')}{' '}
            {formatDateTime(draft.createdAt, interfaceLanguage)}
          </p>

          {draft.notes ? (
            <div className="canonical-draft__notes">
              <h3 className="canonical-draft__subtitle">
                {translate('subjectReview.draft.notes')}
              </h3>
              <p>
                <ContentText>{draft.notes}</ContentText>
              </p>
            </div>
          ) : null}

          <CanonicalReferences
            projectId={projectId}
            subjectId={subjectId}
            setId={draft.id}
            headingLevel={3}
          />

          <p className="canonical-draft__explained">
            {translate('subjectReview.draft.explained')}
          </p>

          {approve.error ? (
            <div className="canonical-draft__refusal" role="alert">
              <ErrorState
                title={translate('subjectReview.draft.approveError.title')}
                description={composeRouteErrorDescription(
                  resolveRouteErrorView(approve.error),
                  translate,
                )}
                detail={resolveRouteErrorView(approve.error).detail}
                headingLevel={3}
              />
            </div>
          ) : null}

          <ApprovalControls
            contextLabel={translate('subjectReview.draft.context', {
              subject: subjectName,
            })}
            onApprove={() => approve.mutate(draft.id)}
            regenerationModes={[]}
            onRegenerate={() => undefined}
            pending={approve.isPending}
            decided={approve.isSuccess}
          />
        </>
      )}
    </section>
  );
};
