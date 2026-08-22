import type { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveStyleProfileMutationOptions } from '@/features/styles/api/approve-style-profile.mutation';
import { styleProfileVersionsQueryOptions } from '@/features/styles/api/style-profile-versions.query';
import type { StyleLineageCardProps } from './style-lineage-card.interface';
import './style-lineage-card.css';

export const StyleLineageCard: FC<StyleLineageCardProps> = ({
  projectId,
  lineageId,
  name,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const versions = useQuery(
    styleProfileVersionsQueryOptions(projectId, lineageId),
  );
  const approve = useMutation(
    approveStyleProfileMutationOptions(projectId, lineageId, queryClient),
  );

  const newestFirst =
    versions.data === undefined
      ? []
      : [...versions.data].sort((a, b) => b.version - a.version);
  const approved = newestFirst.find((version) => version.approved);
  const displayName = newestFirst[0]?.name ?? name;

  return (
    <li className="style-lineage-card">
      <div className="style-lineage-card__header">
        <h3 className="style-lineage-card__name">
          <ContentText>{displayName}</ContentText>
        </h3>
        {versions.data === undefined ? null : (
          <>
            <Badge
              tone={STATUS_TONE.NEUTRAL}
              label={translate('styles.lineage.versionCount', {
                count: String(newestFirst.length),
              })}
            />
            <Badge
              tone={
                approved === undefined
                  ? STATUS_TONE.WARNING
                  : STATUS_TONE.SUCCESS
              }
              label={
                approved === undefined
                  ? translate('styles.lineage.noApproved')
                  : translate('styles.lineage.approvedIs', {
                      version: String(approved.version),
                    })
              }
            />
          </>
        )}
      </div>

      {versions.error && versions.data === undefined ? (
        <p className="style-lineage-card__unread">
          {translate('styles.lineage.unreadable')}
        </p>
      ) : null}

      {versions.isPending ? <Skeleton shape="text" /> : null}

      {approve.error ? (
        <div className="style-lineage-card__refusal" role="alert">
          <ErrorState
            title={translate('styles.approveError.title')}
            description={composeRouteErrorDescription(
              resolveRouteErrorView(approve.error),
              translate,
            )}
            detail={resolveRouteErrorView(approve.error).detail}
            headingLevel={4}
          />
        </div>
      ) : null}

      <ul className="style-lineage-card__versions">
        {newestFirst.map((version) => (
          <li className="style-lineage-card__version" key={version.id}>
            <span className="style-lineage-card__version-label">
              {translate('styles.version.label', {
                version: String(version.version),
              })}
            </span>
            <span className="style-lineage-card__mode" dir="ltr">
              {version.mode}
            </span>
            {version.approved ? (
              <>
                <Badge
                  tone={STATUS_TONE.SUCCESS}
                  label={translate('styles.version.approved')}
                />
                <span className="style-lineage-card__frozen">
                  {translate('styles.version.frozen')}
                </span>
              </>
            ) : (
              <ApprovalControls
                contextLabel={translate('styles.version.context', {
                  name: displayName,
                  version: String(version.version),
                })}
                onApprove={() => approve.mutate(version.id)}
                regenerationModes={[]}
                onRegenerate={() => undefined}
                pending={approve.isPending}
                decided={false}
              />
            )}
          </li>
        ))}
      </ul>
    </li>
  );
};
