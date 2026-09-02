import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { formatDuration } from '@/lib/format/format-duration';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { ORIGIN_LABEL_KEY } from '@/lib/i18n/origin-label.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveSfxAssetMutationOptions } from '@/features/sfx/api/approve-sfx-asset.mutation';
import { deleteSfxAssetMutationOptions } from '@/features/sfx/api/delete-sfx-asset.mutation';
import type { SfxAssetCardProps } from './sfx-asset-card.interface';
import './sfx-asset-card.css';

const MILLISECONDS_PER_SECOND = 1000;

export const SfxAssetCard: FC<SfxAssetCardProps> = ({ asset, onRemoved }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const approve = useMutation(approveSfxAssetMutationOptions(queryClient));
  const remove = useMutation(deleteSfxAssetMutationOptions(queryClient));

  const context = translate('sfx.card.context', { name: asset.name });
  const approveFailure =
    approve.error === null ? null : resolveRouteErrorView(approve.error);
  const removeFailure =
    remove.error === null ? null : resolveRouteErrorView(remove.error);

  return (
    <li className="sfx-asset-card">
      <div className="sfx-asset-card__header">
        <h3 className="sfx-asset-card__name">
          <ContentText>{asset.name}</ContentText>
        </h3>
        <Badge
          tone={asset.approved ? STATUS_TONE.SUCCESS : STATUS_TONE.WARNING}
          label={translate(
            asset.approved ? 'sfx.card.approved' : 'sfx.card.draft',
          )}
        />
      </div>

      <dl className="sfx-asset-card__figures">
        <dt>{translate('sfx.card.category')}</dt>
        <dd>
          <span className="sfx-asset-card__notation" dir="ltr">
            {asset.category}
          </span>
        </dd>

        <dt>{translate('sfx.card.tags')}</dt>
        <dd>
          {asset.tags.length === 0 ? (
            <span className="sfx-asset-card__absent">
              {translate('sfx.card.tags.none')}
            </span>
          ) : (
            asset.tags.map((tag, index) => (
              <span key={tag}>
                {index === 0 ? null : ', '}
                <ContentText>{tag}</ContentText>
              </span>
            ))
          )}
        </dd>

        <dt>{translate('sfx.card.origin')}</dt>
        <dd>{translate(ORIGIN_LABEL_KEY[asset.origin])}</dd>

        <dt>{translate('sfx.card.licence')}</dt>
        <dd>
          {asset.licence === undefined ? (
            <span className="sfx-asset-card__absent">
              {translate('sfx.card.licence.none')}
            </span>
          ) : (
            <ContentText>{asset.licence}</ContentText>
          )}
        </dd>

        <dt>{translate('sfx.card.duration')}</dt>
        <dd>
          {asset.durationMs === undefined ? (
            <span className="sfx-asset-card__absent">
              {translate('sfx.card.unmeasured')}
            </span>
          ) : (
            <span className="sfx-asset-card__notation" dir="ltr">
              {formatDuration(asset.durationMs / MILLISECONDS_PER_SECOND)}
            </span>
          )}
        </dd>

        <dt>{translate('sfx.card.sampleRate')}</dt>
        <dd>
          {asset.sampleRate === undefined ? (
            <span className="sfx-asset-card__absent">
              {translate('sfx.card.unmeasured')}
            </span>
          ) : (
            <span className="sfx-asset-card__notation" dir="ltr">
              {asset.sampleRate}
            </span>
          )}
        </dd>

        <dt>{translate('sfx.card.channels')}</dt>
        <dd>
          {asset.channels === undefined ? (
            <span className="sfx-asset-card__absent">
              {translate('sfx.card.unmeasured')}
            </span>
          ) : (
            <span className="sfx-asset-card__notation" dir="ltr">
              {asset.channels}
            </span>
          )}
        </dd>

        <dt>{translate('sfx.card.path')}</dt>
        <dd>
          <span className="sfx-asset-card__notation" dir="ltr">
            {asset.path}
          </span>
        </dd>

        <dt>{translate('sfx.card.hash')}</dt>
        <dd>
          <span className="sfx-asset-card__notation" dir="ltr">
            {asset.sha256}
          </span>
        </dd>
      </dl>

      {approveFailure === null ? null : (
        <ErrorState
          title={translate('sfx.approveError.title')}
          description={composeRouteErrorDescription(approveFailure, translate)}
          detail={approveFailure.detail}
          headingLevel={4}
        />
      )}

      {removeFailure === null ? null : (
        <ErrorState
          title={translate('sfx.card.remove.failed.title')}
          description={composeRouteErrorDescription(removeFailure, translate)}
          detail={removeFailure.detail}
          headingLevel={4}
        />
      )}

      {asset.approved ? (
        <p className="sfx-asset-card__frozen">{translate('sfx.card.frozen')}</p>
      ) : (
        <>
          <ApprovalControls
            contextLabel={context}
            onApprove={() => approve.mutate(asset.id)}
            regenerationModes={[]}
            onRegenerate={() => undefined}
            pending={approve.isPending}
            decided={false}
          />
          <div className="sfx-asset-card__actions">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={translate('sfx.card.removeContext', {
                name: asset.name,
              })}
              disabled={remove.isPending}
              onClick={() =>
                remove.mutate(asset.id, {
                  onSuccess: () => onRemoved(asset.name),
                })
              }
            >
              {translate(
                remove.isPending ? 'sfx.card.removing' : 'sfx.card.remove',
              )}
            </Button>
          </div>
        </>
      )}
    </li>
  );
};
