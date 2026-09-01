import type { FC } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { StyleProfileId } from 'sky-filme-studio-be/contracts';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { Dialog } from '@/lib/components/dialog';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveStyleProfileMutationOptions } from '@/features/styles/api/approve-style-profile.mutation';
import { styleProfileVersionsQueryOptions } from '@/features/styles/api/style-profile-versions.query';
import { CreateStyleProfileForm } from '@/features/styles/components/create-style-profile-form';
import { EditStyleProfileForm } from '@/features/styles/components/edit-style-profile-form';
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
  const [editingVersionId, setEditingVersionId] =
    useState<StyleProfileId | null>(null);
  const [nextVersionOfId, setNextVersionOfId] = useState<StyleProfileId | null>(
    null,
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
        {newestFirst.map((version) => {
          const contextLabel = translate('styles.version.context', {
            name: displayName,
            version: String(version.version),
          });

          return (
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
                  {approve.isSuccess && approve.variables === version.id ? (
                    <output
                      className="style-lineage-card__approved"
                      ref={focusWhenShown}
                      tabIndex={-1}
                    >
                      {translate('library.approved')}
                    </output>
                  ) : null}
                  <span className="style-lineage-card__frozen">
                    {translate('library.frozen.styleVersion')}
                  </span>
                </>
              ) : null}

              {version.approved ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label={`${translate('library.newVersion')} ${contextLabel}`}
                    onClick={() => setNextVersionOfId(version.id)}
                  >
                    {translate('library.newVersion')}
                  </Button>
                  <Dialog
                    open={nextVersionOfId === version.id}
                    title={translate('library.newVersion.title')}
                    onClose={() => setNextVersionOfId(null)}
                  >
                    {nextVersionOfId === version.id ? (
                      <CreateStyleProfileForm
                        projectId={projectId}
                        onClose={() => setNextVersionOfId(null)}
                        nextVersionOf={{
                          lineageId,
                          name: version.name,
                          description: version.description,
                          mode: version.mode,
                          realismLevel: version.realismLevel,
                          paletteRules: version.paletteRules,
                          lightingRules: version.lightingRules,
                          cameraRules: version.cameraRules,
                          textureRules: version.textureRules,
                          motionRules: version.motionRules,
                          prohibitedStyleDrift: version.prohibitedStyleDrift,
                        }}
                      />
                    ) : null}
                  </Dialog>
                </>
              ) : (
                <>
                  <ApprovalControls
                    contextLabel={contextLabel}
                    onApprove={() => approve.mutate(version.id)}
                    regenerationModes={[]}
                    onRegenerate={() => undefined}
                    pending={approve.isPending}
                    decided={false}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`${translate('library.edit')} ${contextLabel}`}
                    onClick={() => setEditingVersionId(version.id)}
                  >
                    {translate('library.edit')}
                  </Button>
                  <Dialog
                    open={editingVersionId === version.id}
                    title={translate('styles.edit.title')}
                    onClose={() => setEditingVersionId(null)}
                  >
                    {editingVersionId === version.id ? (
                      <EditStyleProfileForm
                        projectId={projectId}
                        lineageId={lineageId}
                        styleProfile={version}
                        onClose={() => setEditingVersionId(null)}
                      />
                    ) : null}
                  </Dialog>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
};
