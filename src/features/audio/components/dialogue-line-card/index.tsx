import type { FC } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { formatMilliseconds } from '@/lib/format/format-milliseconds';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveDialogueAudioMutationOptions } from '@/features/audio/api/approve-dialogue-audio.mutation';
import { unapproveDialogueAudioMutationOptions } from '@/features/audio/api/unapprove-dialogue-audio.mutation';
import { synthesiseSpeechMutationOptions } from '@/features/audio/api/synthesise-speech.mutation';
import { SpeechTakes } from '@/features/audio/components/speech-takes';
import { DialogueTier } from '@/features/audio/components/dialogue-tier';
import type { DialogueLineCardProps } from './dialogue-line-card.interface';
import './dialogue-line-card.css';

export const DialogueLineCard: FC<DialogueLineCardProps> = ({
  line,
  sceneId,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const approve = useMutation(
    approveDialogueAudioMutationOptions(line.id, sceneId, queryClient),
  );
  const unapprove = useMutation(
    unapproveDialogueAudioMutationOptions(line.id, sceneId, queryClient),
  );
  const synthesise = useMutation(
    synthesiseSpeechMutationOptions(line.id, sceneId, queryClient),
  );

  const context = translate('audio.approve.context', {
    order: String(line.order),
  });
  const pending =
    approve.isPending || unapprove.isPending || synthesise.isPending;
  const hasAudio = line.generatedAudioPath !== undefined;

  const failure =
    approve.error !== null
      ? resolveRouteErrorView(approve.error)
      : unapprove.error !== null
        ? resolveRouteErrorView(unapprove.error)
        : synthesise.error !== null
          ? resolveRouteErrorView(synthesise.error)
          : null;

  return (
    <li className="dialogue-line-card">
      <div className="dialogue-line-card__header">
        <h4 className="dialogue-line-card__title">
          {translate('audio.line.label', { order: String(line.order) })}
        </h4>
        <Badge
          tone={line.approved ? STATUS_TONE.SUCCESS : STATUS_TONE.NEUTRAL}
          label={translate(
            line.approved ? 'audio.line.approved' : 'audio.line.notApproved',
          )}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={open}
          aria-label={`${translate('audio.takes.title')} ${context}`}
          onClick={() => setOpen(!open)}
        >
          {translate('audio.takes.title')}
        </Button>
      </div>

      <p className="dialogue-line-card__text">
        <ContentText language={line.language}>{line.text}</ContentText>
      </p>

      <dl className="dialogue-line-card__facts">
        <div className="dialogue-line-card__fact">
          <dt>{translate('audio.line.emotion')}</dt>
          <dd>
            <ContentText>{line.emotion}</ContentText>
          </dd>
        </div>
        <div className="dialogue-line-card__fact">
          <dt>{translate('audio.line.pace')}</dt>
          <dd>
            <ContentText>{line.pace}</ContentText>
          </dd>
        </div>
        <div className="dialogue-line-card__fact">
          <dt>{translate('audio.line.language')}</dt>
          <dd>
            <span dir="ltr">{line.language}</span>
          </dd>
        </div>
        <div className="dialogue-line-card__fact">
          <dt>{translate('audio.line.pauseBefore')}</dt>
          <dd>
            <span dir="ltr">{formatMilliseconds(line.pauseBeforeMs)}</span>
          </dd>
        </div>
        <div className="dialogue-line-card__fact">
          <dt>{translate('audio.line.pauseAfter')}</dt>
          <dd>
            <span dir="ltr">{formatMilliseconds(line.pauseAfterMs)}</span>
          </dd>
        </div>
        {line.durationMs === undefined ? null : (
          <div className="dialogue-line-card__fact">
            <dt>{translate('audio.line.measured')}</dt>
            <dd>
              <span dir="ltr">{formatMilliseconds(line.durationMs)}</span>
            </dd>
          </div>
        )}
      </dl>

      {hasAudio ? null : (
        <p className="dialogue-line-card__note">
          {translate('audio.line.noAudioYet')}
        </p>
      )}

      {line.approved ? (
        <p className="dialogue-line-card__note">
          {translate('audio.synthesise.blocked')}
        </p>
      ) : null}

      <div className="dialogue-line-card__actions">
        {line.approved ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={pending}
            aria-label={`${translate('audio.unapprove.action')} ${context}`}
            onClick={() => unapprove.mutate(undefined)}
          >
            {translate('audio.unapprove.action')}
          </Button>
        ) : (
          <>
            {hasAudio ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={pending}
                aria-label={`${translate('audio.approve.action')} ${context}`}
                onClick={() => approve.mutate(undefined)}
              >
                {translate('audio.approve.action')}
              </Button>
            ) : null}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={pending}
              aria-label={`${translate('audio.synthesise.draft')} ${translate('audio.synthesise.context', { order: String(line.order) })}`}
              onClick={() => synthesise.mutate({ pass: 'DRAFT' })}
            >
              {translate(
                synthesise.isPending
                  ? 'audio.synthesise.pending'
                  : 'audio.synthesise.draft',
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={pending}
              aria-label={`${translate('audio.synthesise.final')} ${translate('audio.synthesise.context', { order: String(line.order) })}`}
              onClick={() => synthesise.mutate({ pass: 'FINAL' })}
            >
              {translate('audio.synthesise.final')}
            </Button>
          </>
        )}
      </div>

      {approve.isSuccess ? (
        <output
          className="dialogue-line-card__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('audio.approve.done')}
        </output>
      ) : null}

      {unapprove.isSuccess ? (
        <output
          className="dialogue-line-card__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('audio.unapprove.done')}
        </output>
      ) : null}

      {synthesise.isSuccess ? (
        <output
          className="dialogue-line-card__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('audio.synthesise.submitted')}
        </output>
      ) : null}

      {failure === null ? null : (
        <p className="dialogue-line-card__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <DialogueTier line={line} />

      {open ? <SpeechTakes line={line} /> : null}
    </li>
  );
};
