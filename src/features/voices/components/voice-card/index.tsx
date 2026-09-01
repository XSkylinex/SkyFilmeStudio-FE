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
import { approveVoiceProfileMutationOptions } from '@/features/voices/api/approve-voice-profile.mutation';
import { EditVoiceProfileForm } from '@/features/voices/components/edit-voice-profile-form';
import type { VoiceCardProps } from './voice-card.interface';
import './voice-card.css';

export const VoiceCard: FC<VoiceCardProps> = ({ projectId, voice }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const approve = useMutation(
    approveVoiceProfileMutationOptions(projectId, queryClient),
  );
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="voice-card">
      <div className="voice-card__header">
        <h4 className="voice-card__name">
          <ContentText>{voice.displayName}</ContentText>
        </h4>
        <Badge
          tone={voice.approved ? STATUS_TONE.SUCCESS : STATUS_TONE.WARNING}
          label={translate(
            voice.approved ? 'voices.card.approved' : 'voices.card.draft',
          )}
        />
      </div>

      <dl className="voice-card__facts">
        <div className="voice-card__fact">
          <dt>{translate('voices.card.engine')}</dt>
          <dd>
            <span dir="ltr">{voice.engine}</span>
          </dd>
        </div>
        <div className="voice-card__fact">
          <dt>{translate('voices.card.model')}</dt>
          <dd>
            <span dir="ltr">{voice.modelId}</span>
          </dd>
        </div>
        <div className="voice-card__fact">
          <dt>{translate('voices.card.language')}</dt>
          <dd>
            <span dir="ltr">{voice.language}</span>
          </dd>
        </div>
      </dl>

      {voice.referenceTranscript === undefined ? null : (
        <p className="voice-card__transcript">
          <ContentText language={voice.language}>
            {voice.referenceTranscript}
          </ContentText>
        </p>
      )}

      {approve.error ? (
        <div className="voice-card__refusal" role="alert">
          <ErrorState
            title={translate('voices.approveError.title')}
            description={composeRouteErrorDescription(
              resolveRouteErrorView(approve.error),
              translate,
            )}
            detail={resolveRouteErrorView(approve.error).detail}
            headingLevel={5}
          />
        </div>
      ) : null}

      {voice.approved ? (
        <>
          {approve.isSuccess ? (
            <output
              className="voice-card__approved"
              ref={focusWhenShown}
              tabIndex={-1}
            >
              {translate('library.approved')}
            </output>
          ) : null}
          <p className="voice-card__frozen">{translate('library.frozen')}</p>
        </>
      ) : null}

      <Dialog
        open={isEditing}
        title={translate('voices.edit.title')}
        onClose={() => setIsEditing(false)}
      >
        {isEditing ? (
          <EditVoiceProfileForm
            projectId={projectId}
            voiceProfile={voice}
            onClose={() => setIsEditing(false)}
          />
        ) : null}
      </Dialog>
      {voice.approved ? null : (
        <>
          <ApprovalControls
            contextLabel={translate('voices.card.context', {
              name: voice.displayName,
            })}
            onApprove={() => approve.mutate(voice.id)}
            regenerationModes={[]}
            onRegenerate={() => undefined}
            pending={approve.isPending}
            decided={false}
          />
          <Button
            variant="ghost"
            size="sm"
            aria-label={`${translate('library.edit')} ${translate(
              'voices.card.context',
              {
                name: voice.displayName,
              },
            )}`}
            onClick={() => setIsEditing(true)}
          >
            {translate('library.edit')}
          </Button>
        </>
      )}
    </li>
  );
};
