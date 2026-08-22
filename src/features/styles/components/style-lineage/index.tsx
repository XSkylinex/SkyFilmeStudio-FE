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
import { approveStyleProfileMutationOptions } from '@/features/styles/api/approve-style-profile.mutation';
import type { StyleLineageProps } from './style-lineage.interface';
import './style-lineage.css';

export const StyleLineageCard: FC<StyleLineageProps> = ({
  projectId,
  lineage,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const approve = useMutation(
    approveStyleProfileMutationOptions(projectId, queryClient),
  );

  return (
    <li className="style-lineage">
      <div className="style-lineage__header">
        <h3 className="style-lineage__name">
          <ContentText>{lineage.name}</ContentText>
        </h3>
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate('styles.lineage.versionCount', {
            count: String(lineage.newestFirst.length),
          })}
        />
        <Badge
          tone={
            lineage.approved === undefined
              ? STATUS_TONE.WARNING
              : STATUS_TONE.SUCCESS
          }
          label={
            lineage.approved === undefined
              ? translate('styles.lineage.noApproved')
              : translate('styles.lineage.approvedIs', {
                  version: String(lineage.approved.version),
                })
          }
        />
      </div>

      {approve.error ? (
        <div className="style-lineage__refusal" role="alert">
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

      <ul className="style-lineage__versions">
        {lineage.newestFirst.map((version) => (
          <li className="style-lineage__version" key={version.id}>
            <span className="style-lineage__version-label">
              {translate('styles.version.label', {
                version: String(version.version),
              })}
            </span>
            <span className="style-lineage__mode" dir="ltr">
              {version.mode}
            </span>
            {version.approved ? (
              <>
                <Badge
                  tone={STATUS_TONE.SUCCESS}
                  label={translate('styles.version.approved')}
                />
                <span className="style-lineage__frozen">
                  {translate('styles.version.frozen')}
                </span>
              </>
            ) : (
              <ApprovalControls
                contextLabel={translate('styles.version.context', {
                  name: lineage.name,
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
