import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { formatMilliseconds } from '@/lib/format/format-milliseconds';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveOpeningEndingAssetMutationOptions } from '@/features/music/api/approve-opening-ending-asset.mutation';
import { deleteOpeningEndingAssetMutationOptions } from '@/features/music/api/delete-opening-ending-asset.mutation';
import type { OpeningEndingLineageCardProps } from './opening-ending-lineage-card.interface';
import './opening-ending-lineage-card.css';

export const OpeningEndingLineageCard: FC<OpeningEndingLineageCardProps> = ({
  projectId,
  lineage,
  onRemoved,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const approve = useMutation(
    approveOpeningEndingAssetMutationOptions(projectId, queryClient),
  );
  const remove = useMutation(
    deleteOpeningEndingAssetMutationOptions(projectId, queryClient),
  );

  const approveFailure =
    approve.error === null ? null : resolveRouteErrorView(approve.error);
  const removeFailure =
    remove.error === null ? null : resolveRouteErrorView(remove.error);

  return (
    <li className="opening-ending-lineage-card">
      <div className="opening-ending-lineage-card__header">
        <h3 className="opening-ending-lineage-card__name">
          <ContentText>{lineage.name}</ContentText>
        </h3>
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate('openingEnding.lineage.versionCount', {
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
              ? translate('openingEnding.lineage.noApproved')
              : translate('openingEnding.lineage.approvedIs', {
                  version: String(lineage.approved.version),
                })
          }
        />
      </div>

      <dl className="opening-ending-lineage-card__facts">
        <dt>{translate('openingEnding.lineage.kind')}</dt>
        <dd>
          <span className="opening-ending-lineage-card__notation" dir="ltr">
            {lineage.kind}
          </span>
        </dd>
        <dt>{translate('openingEnding.lineage.season')}</dt>
        <dd>
          {lineage.newestFirst[0]?.seasonLabel === undefined ? (
            <span className="opening-ending-lineage-card__absent">
              {translate('openingEnding.lineage.season.none')}
            </span>
          ) : (
            <ContentText>{lineage.newestFirst[0].seasonLabel}</ContentText>
          )}
        </dd>
      </dl>

      {approveFailure === null ? null : (
        <ErrorState
          title={translate('openingEnding.approveError.title')}
          description={composeRouteErrorDescription(approveFailure, translate)}
          detail={approveFailure.detail}
          headingLevel={4}
        />
      )}

      {removeFailure === null ? null : (
        <ErrorState
          title={translate('openingEnding.version.remove.failed.title')}
          description={composeRouteErrorDescription(removeFailure, translate)}
          detail={removeFailure.detail}
          headingLevel={4}
        />
      )}

      <ul className="opening-ending-lineage-card__versions">
        {lineage.newestFirst.map((version) => {
          const context = translate('openingEnding.version.context', {
            name: lineage.name,
            version: String(version.version),
          });

          return (
            <li
              className="opening-ending-lineage-card__version"
              key={version.id}
            >
              <div className="opening-ending-lineage-card__version-header">
                <span
                  className="opening-ending-lineage-card__notation"
                  dir="ltr"
                >
                  {translate('openingEnding.version.label', {
                    version: String(version.version),
                  })}
                </span>
                {version.approved ? (
                  <Badge
                    tone={STATUS_TONE.SUCCESS}
                    label={translate('openingEnding.version.approved')}
                  />
                ) : null}
              </div>

              <dl className="opening-ending-lineage-card__facts">
                <dt>{translate('openingEnding.version.frame')}</dt>
                <dd>
                  {version.width === undefined ||
                  version.height === undefined ||
                  version.fps === undefined ? (
                    <span className="opening-ending-lineage-card__absent">
                      {translate('openingEnding.version.frame.unmeasured')}
                    </span>
                  ) : (
                    <span
                      className="opening-ending-lineage-card__notation"
                      dir="ltr"
                    >
                      {translate('openingEnding.version.frame.value', {
                        width: String(version.width),
                        height: String(version.height),
                        fps: String(version.fps),
                      })}
                    </span>
                  )}
                </dd>

                <dt>{translate('openingEnding.version.duration')}</dt>
                <dd>
                  {version.durationMs === undefined ? (
                    <span className="opening-ending-lineage-card__absent">
                      {translate('openingEnding.version.frame.unmeasured')}
                    </span>
                  ) : (
                    <span
                      className="opening-ending-lineage-card__notation"
                      dir="ltr"
                    >
                      {formatMilliseconds(version.durationMs)}
                    </span>
                  )}
                </dd>

                <dt>{translate('openingEnding.version.audio')}</dt>
                <dd>
                  {version.sampleRate === undefined ||
                  version.channels === undefined ? (
                    <span className="opening-ending-lineage-card__absent">
                      {translate('openingEnding.version.frame.unmeasured')}
                    </span>
                  ) : (
                    <span
                      className="opening-ending-lineage-card__notation"
                      dir="ltr"
                    >
                      {translate('openingEnding.version.audio.value', {
                        sampleRate: String(version.sampleRate),
                        channels: String(version.channels),
                      })}
                    </span>
                  )}
                </dd>

                <dt>{translate('openingEnding.version.path')}</dt>
                <dd>
                  <span
                    className="opening-ending-lineage-card__notation"
                    dir="ltr"
                  >
                    {version.path}
                  </span>
                </dd>
              </dl>

              {version.approved ? (
                <p className="opening-ending-lineage-card__frozen">
                  {translate('openingEnding.version.frozen')}
                </p>
              ) : (
                <>
                  <ApprovalControls
                    contextLabel={context}
                    onApprove={() => approve.mutate(version.id)}
                    regenerationModes={[]}
                    onRegenerate={() => undefined}
                    pending={approve.isPending}
                    decided={false}
                  />
                  <div className="opening-ending-lineage-card__actions">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={translate(
                        'openingEnding.version.removeContext',
                        {
                          name: lineage.name,
                          version: String(version.version),
                        },
                      )}
                      disabled={remove.isPending}
                      onClick={() =>
                        remove.mutate(version.id, {
                          onSuccess: () => onRemoved(version.name),
                        })
                      }
                    >
                      {translate(
                        remove.isPending
                          ? 'openingEnding.version.removing'
                          : 'openingEnding.version.remove',
                      )}
                    </Button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
};
