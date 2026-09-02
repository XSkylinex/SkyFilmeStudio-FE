import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApprovalControls } from '@/lib/components/approval-controls';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { formatMilliseconds } from '@/lib/format/format-milliseconds';
import { ORIGIN_LABEL_KEY } from '@/lib/i18n/origin-label.constants';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { approveMusicCueMutationOptions } from '@/features/music/api/approve-music-cue.mutation';
import { deleteMusicCueMutationOptions } from '@/features/music/api/delete-music-cue.mutation';
import type { MusicCueCardProps } from './music-cue-card.interface';
import './music-cue-card.css';

export const MusicCueCard: FC<MusicCueCardProps> = ({ projectId, cue }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const approve = useMutation(
    approveMusicCueMutationOptions(projectId, queryClient),
  );
  const remove = useMutation(
    deleteMusicCueMutationOptions(projectId, queryClient),
  );

  const context = translate('music.card.context', { name: cue.name });
  const approveFailure =
    approve.error === null ? null : resolveRouteErrorView(approve.error);
  const removeFailure =
    remove.error === null ? null : resolveRouteErrorView(remove.error);

  return (
    <li className="music-cue-card">
      <div className="music-cue-card__header">
        <h3 className="music-cue-card__name">
          <ContentText>{cue.name}</ContentText>
        </h3>
        <Badge
          tone={cue.approved ? STATUS_TONE.SUCCESS : STATUS_TONE.WARNING}
          label={translate(
            cue.approved ? 'music.card.approved' : 'music.card.draft',
          )}
        />
      </div>

      <dl className="music-cue-card__figures">
        <dt>{translate('music.card.category')}</dt>
        <dd>
          <span className="music-cue-card__notation" dir="ltr">
            {cue.category}
          </span>
        </dd>

        <dt>{translate('music.card.mood')}</dt>
        <dd>
          <ContentText>{cue.mood}</ContentText>
        </dd>

        <dt>{translate('music.card.tags')}</dt>
        <dd>
          {cue.tags.length === 0 ? (
            <span className="music-cue-card__absent">
              {translate('music.card.tags.none')}
            </span>
          ) : (
            cue.tags.map((tag, index) => (
              <span key={tag}>
                {index === 0 ? null : ', '}
                <ContentText>{tag}</ContentText>
              </span>
            ))
          )}
        </dd>

        <dt>{translate('music.card.duration')}</dt>
        <dd>
          <span className="music-cue-card__notation" dir="ltr">
            {formatMilliseconds(cue.durationMs)}
          </span>
        </dd>

        <dt>{translate('music.card.tempo')}</dt>
        <dd>
          {cue.bpm === undefined ? (
            <span className="music-cue-card__absent">
              {translate('music.card.tempo.unknown')}
            </span>
          ) : (
            <span className="music-cue-card__notation" dir="ltr">
              {cue.bpm}
            </span>
          )}
        </dd>

        <dt>{translate('music.card.key')}</dt>
        <dd>
          {cue.musicalKey === undefined ? (
            <span className="music-cue-card__absent">
              {translate('music.card.tempo.unknown')}
            </span>
          ) : (
            <ContentText>{cue.musicalKey}</ContentText>
          )}
        </dd>

        <dt>{translate('music.card.loopable')}</dt>
        <dd>
          {translate(
            cue.loopable ? 'music.card.loopable.yes' : 'music.card.loopable.no',
          )}
        </dd>

        <dt>{translate('music.card.intro')}</dt>
        <dd>
          <span className="music-cue-card__notation" dir="ltr">
            {formatMilliseconds(cue.introMs)}
          </span>
        </dd>

        <dt>{translate('music.card.outro')}</dt>
        <dd>
          <span className="music-cue-card__notation" dir="ltr">
            {formatMilliseconds(cue.outroMs)}
          </span>
        </dd>

        <dt>{translate('music.card.safeLevel')}</dt>
        <dd>
          <span className="music-cue-card__notation" dir="ltr">
            {cue.safeDialogueLevelDb} dB
          </span>
        </dd>

        <dt>{translate('music.card.origin')}</dt>
        <dd>{translate(ORIGIN_LABEL_KEY[cue.origin])}</dd>

        <dt>{translate('music.card.licence')}</dt>
        <dd>
          {cue.licence === undefined ? (
            <span className="music-cue-card__absent">
              {translate('music.card.licence.none')}
            </span>
          ) : (
            <ContentText>{cue.licence}</ContentText>
          )}
        </dd>

        <dt>{translate('music.card.path')}</dt>
        <dd>
          <span className="music-cue-card__notation" dir="ltr">
            {cue.path}
          </span>
        </dd>

        <dt>{translate('music.card.hash')}</dt>
        <dd>
          <span className="music-cue-card__notation" dir="ltr">
            {cue.sha256}
          </span>
        </dd>
      </dl>

      <p className="music-cue-card__note">
        {translate('music.card.safeLevel.explain')}
      </p>

      {approveFailure === null ? null : (
        <ErrorState
          title={translate('music.approveError.title')}
          description={composeRouteErrorDescription(approveFailure, translate)}
          detail={approveFailure.detail}
          headingLevel={4}
        />
      )}

      {removeFailure === null ? null : (
        <ErrorState
          title={translate('music.card.remove.failed.title')}
          description={composeRouteErrorDescription(removeFailure, translate)}
          detail={removeFailure.detail}
          headingLevel={4}
        />
      )}

      {cue.approved ? (
        <p className="music-cue-card__frozen">
          {translate('music.card.frozen')}
        </p>
      ) : (
        <>
          <ApprovalControls
            contextLabel={context}
            onApprove={() => approve.mutate(cue.id)}
            regenerationModes={[]}
            onRegenerate={() => undefined}
            pending={approve.isPending}
            decided={false}
          />
          <div className="music-cue-card__actions">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={translate('music.card.removeContext', {
                name: cue.name,
              })}
              disabled={remove.isPending}
              onClick={() => remove.mutate(cue.id)}
            >
              {translate(
                remove.isPending ? 'music.card.removing' : 'music.card.remove',
              )}
            </Button>
          </div>
        </>
      )}
    </li>
  );
};
