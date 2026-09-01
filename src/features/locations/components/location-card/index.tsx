import type { FC } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { Dialog } from '@/lib/components/dialog';
import { ErrorState } from '@/lib/components/error-state';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveLocationMutationOptions } from '@/features/locations/api/approve-location.mutation';
import { EditLocationForm } from '@/features/locations/components/edit-location-form';
import { PlateCoverage } from '@/features/locations/components/plate-coverage';
import type { LocationCardProps } from './location-card.interface';
import './location-card.css';

export const LocationCard: FC<LocationCardProps> = ({
  projectId,
  location,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const approve = useMutation(
    approveLocationMutationOptions(projectId, queryClient),
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <li className="location-card">
      <div className="location-card__header">
        <h3 className="location-card__name">
          <ContentText>{location.name}</ContentText>
        </h3>
        <Badge
          tone={location.approved ? STATUS_TONE.SUCCESS : STATUS_TONE.WARNING}
          label={translate(
            location.approved
              ? 'locations.card.approved'
              : 'locations.card.draft',
          )}
        />
      </div>

      {location.canonicalDescription ? (
        <p className="location-card__description">
          <ContentText>{location.canonicalDescription}</ContentText>
        </p>
      ) : null}

      {location.immutableFeatures.length === 0 ? null : (
        <p className="location-card__features">
          {translate('locations.card.immutableFeatures')}{' '}
          <ContentText>{location.immutableFeatures.join(', ')}</ContentText>
        </p>
      )}

      <PlateCoverage projectId={projectId} locationId={location.id} />

      {approve.error ? (
        <div className="location-card__refusal" role="alert">
          <ErrorState
            title={translate('locations.approveError.title')}
            description={composeRouteErrorDescription(
              resolveRouteErrorView(approve.error),
              translate,
            )}
            detail={resolveRouteErrorView(approve.error).detail}
            headingLevel={4}
          />
        </div>
      ) : null}

      {location.approved ? (
        <>
          {approve.isSuccess ? (
            <output
              className="location-card__approved"
              ref={focusWhenShown}
              tabIndex={-1}
            >
              {translate('library.approved')}
            </output>
          ) : null}
          <p className="location-card__frozen">{translate('library.frozen')}</p>
        </>
      ) : (
        <>
          <div className="location-card__actions">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-label={`${translate('library.edit')} ${translate('locations.card.context', { name: location.name })}`}
              onClick={() => setIsEditOpen(true)}
            >
              {translate('library.edit')}
            </Button>
          </div>
          <ApprovalControls
            contextLabel={translate('locations.card.context', {
              name: location.name,
            })}
            onApprove={() => approve.mutate(location.id)}
            regenerationModes={[]}
            onRegenerate={() => undefined}
            pending={approve.isPending}
            decided={false}
          />
        </>
      )}

      <Dialog
        open={isEditOpen}
        title={translate('locations.edit.title')}
        onClose={() => setIsEditOpen(false)}
      >
        {isEditOpen ? (
          <EditLocationForm
            projectId={projectId}
            location={location}
            onClose={() => setIsEditOpen(false)}
          />
        ) : null}
      </Dialog>
    </li>
  );
};
