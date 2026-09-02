import type { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { formatMilliseconds } from '@/lib/format/format-milliseconds';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { sceneMixesQueryOptions } from '@/features/audio/api/scene-mixes.query';
import { submitSceneMixMutationOptions } from '@/features/audio/api/submit-scene-mix.mutation';
import type { SceneMixProps } from './scene-mix.interface';
import './scene-mix.css';

export const SceneMix: FC<SceneMixProps> = ({ scene }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const mixes = useQuery(sceneMixesQueryOptions(scene.id));
  const submit = useMutation(
    submitSceneMixMutationOptions(scene.id, queryClient),
  );

  const newest = mixes.data?.at(-1);
  const failure =
    submit.error === null ? null : resolveRouteErrorView(submit.error);

  return (
    <section className="scene-mix">
      <div className="scene-mix__header">
        <h4 className="scene-mix__title">
          {translate('audio.mix.scene.heading')}
        </h4>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label={translate('audio.mix.scene.submitContext', {
            order: String(scene.order),
          })}
          disabled={submit.isPending}
          onClick={() => submit.mutate()}
        >
          {translate(
            submit.isPending
              ? 'audio.mix.scene.submitting'
              : 'audio.mix.scene.submit',
          )}
        </Button>
      </div>

      {mixes.error && mixes.data === undefined ? (
        <p className="scene-mix__note">
          {translate('audio.mix.scene.unreadable')}
        </p>
      ) : null}

      {failure === null ? null : (
        <ErrorState
          title={translate('audio.mix.scene.failed.title')}
          description={composeRouteErrorDescription(failure, translate)}
          detail={failure.detail}
          headingLevel={5}
        />
      )}

      {submit.isSuccess ? (
        <output className="scene-mix__note" ref={focusWhenShown} tabIndex={-1}>
          {translate('audio.mix.scene.submitted', {
            renderJobId: submit.data.renderJobId,
          })}
        </output>
      ) : null}

      {newest === undefined ? (
        <p className="scene-mix__note">{translate('audio.mix.scene.none')}</p>
      ) : (
        <>
          <dl className="scene-mix__facts">
            <dt>{translate('audio.mix.field.duration')}</dt>
            <dd>
              <span className="scene-mix__notation" dir="ltr">
                {formatMilliseconds(newest.durationMs)}
              </span>
            </dd>
            <dt>{translate('audio.mix.field.audio')}</dt>
            <dd>
              <span className="scene-mix__notation" dir="ltr">
                {translate('audio.mix.field.audio.value', {
                  sampleRate: String(newest.sampleRate),
                  channels: String(newest.channels),
                })}
              </span>
            </dd>
            <dt>{translate('audio.mix.field.stems')}</dt>
            <dd>{translate('audio.mix.field.stems.value')}</dd>
            <dt>{translate('audio.mix.field.path')}</dt>
            <dd>
              <span className="scene-mix__notation" dir="ltr">
                {newest.path}
              </span>
            </dd>
          </dl>
          <p className="scene-mix__note">
            {translate('audio.mix.stems.unreadable')}
          </p>
        </>
      )}
    </section>
  );
};
