import type { FC } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LocationPlateId } from 'sky-filme-studio-be/contracts';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveLocationPlateMutationOptions } from '@/features/locations/api/approve-location-plate.mutation';
import { locationPlatesQueryOptions } from '@/features/locations/api/location-plates.query';
import { PlateForm } from '@/features/locations/components/plate-form';
import type { PlateListProps } from './plate-list.interface';
import './plate-list.css';

export const PlateList: FC<PlateListProps> = ({ projectId, locationId }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const plates = useQuery(locationPlatesQueryOptions(projectId, locationId));
  const approve = useMutation(
    approveLocationPlateMutationOptions(projectId, locationId, queryClient),
  );
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<LocationPlateId | null>(null);

  const approveFailure =
    approve.error === null ? null : resolveRouteErrorView(approve.error);

  return (
    <section className="plate-list">
      <div className="plate-list__header">
        <h4 className="plate-list__title">{translate('plates.heading')}</h4>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={adding}
          onClick={() => setAdding(true)}
        >
          {translate('plates.add')}
        </Button>
      </div>

      {adding ? (
        <PlateForm
          projectId={projectId}
          locationId={locationId}
          plate={undefined}
          onClose={() => setAdding(false)}
        />
      ) : null}

      {plates.error && plates.data === undefined ? (
        <p className="plate-list__note">{translate('plates.unreadable')}</p>
      ) : null}

      {approveFailure === null ? null : (
        <ErrorState
          title={translate('plates.approveError.title')}
          description={composeRouteErrorDescription(approveFailure, translate)}
          detail={approveFailure.detail}
          headingLevel={5}
        />
      )}

      {plates.data === undefined ? null : plates.data.items.length === 0 ? (
        <p className="plate-list__note">{translate('plates.empty')}</p>
      ) : (
        <ul className="plate-list__items">
          {plates.data.items.map((plate) => (
            <li className="plate-list__item" key={plate.id}>
              <div className="plate-list__item-header">
                <span className="plate-list__notation" dir="ltr">
                  {plate.kind}
                </span>
                <Badge
                  tone={
                    plate.approved ? STATUS_TONE.SUCCESS : STATUS_TONE.WARNING
                  }
                  label={translate(
                    plate.approved
                      ? 'plates.card.approved'
                      : 'plates.card.draft',
                  )}
                />
              </div>

              <p className="plate-list__note">
                {translate(
                  plate.sourceAssetId === undefined
                    ? 'plates.card.anchor.artifact'
                    : 'plates.card.anchor.sourceAsset',
                )}{' '}
                <span className="plate-list__notation" dir="ltr">
                  {plate.sourceAssetId ?? plate.artifactId}
                </span>
              </p>

              {plate.sourceAssetId === undefined ? (
                <p className="plate-list__note">
                  {translate('plates.card.artifactNoImage')}
                </p>
              ) : null}

              {plate.approved ? (
                <p className="plate-list__note">
                  {translate('plates.card.frozen')}
                </p>
              ) : editing === plate.id ? (
                <PlateForm
                  projectId={projectId}
                  locationId={locationId}
                  plate={plate}
                  onClose={() => setEditing(null)}
                />
              ) : (
                <>
                  <ApprovalControls
                    contextLabel={translate('plates.edit.context', {
                      kind: plate.kind,
                    })}
                    onApprove={() => approve.mutate(plate.id)}
                    regenerationModes={[]}
                    onRegenerate={() => undefined}
                    pending={approve.isPending}
                    decided={false}
                  />
                  <div className="plate-list__actions">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`${translate('plates.edit')} ${translate('plates.edit.context', { kind: plate.kind })}`}
                      onClick={() => setEditing(plate.id)}
                    >
                      {translate('plates.edit')}
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
