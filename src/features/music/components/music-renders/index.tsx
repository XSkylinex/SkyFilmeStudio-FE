import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { submitMusicCueRequestSchema } from 'sky-filme-studio-be/contracts';
import type { MusicCueRenderId } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { formatMilliseconds } from '@/lib/format/format-milliseconds';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { musicCueRendersQueryOptions } from '@/features/music/api/music-cue-renders.query';
import { submitMusicCueRenderMutationOptions } from '@/features/music/api/submit-music-cue-render.mutation';
import { PromoteMusicCueForm } from '@/features/music/components/promote-music-cue-form';
import type { MusicRendersProps } from './music-renders.interface';
import './music-renders.css';

export const MusicRenders: FC<MusicRendersProps> = ({ projectId }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const renders = useQuery(musicCueRendersQueryOptions(projectId));
  const submit = useMutation(
    submitMusicCueRenderMutationOptions(projectId, queryClient),
  );

  const [category, setCategory] = useState('');
  const [mood, setMood] = useState('');
  const [prompt, setPrompt] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [seed, setSeed] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);
  const [promoting, setPromoting] = useState<MusicCueRenderId | null>(null);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = submitMusicCueRequestSchema.safeParse({
      category: category.trim(),
      mood: mood.trim(),
      prompt: prompt.trim(),
      durationSeconds:
        durationSeconds.trim() === '' ? Number.NaN : Number(durationSeconds),
      ...(seed.trim() === '' ? {} : { seed: Number(seed) }),
    });

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    submit.mutate(result.data);
  };

  const failure =
    submit.error === null ? null : resolveRouteErrorView(submit.error);

  return (
    <section className="music-renders">
      <div className="music-renders__header">
        <h2 className="music-renders__title">
          {translate('music.renders.heading')}
        </h2>
      </div>
      <p className="music-renders__note">
        {translate('music.renders.explain')}
      </p>

      <form onSubmit={handleSubmit}>
        {Object.keys(fieldErrors).length === 0 ? null : (
          <ValidationSummary
            count={invalidFieldCount(fieldErrors)}
            attempt={attempt}
          />
        )}

        <div className="music-renders__fields">
          <Field
            label={translate('music.renders.field.category')}
            hint={translate('music.renders.field.category.hint')}
            required
            error={errorFor('category')}
          >
            <Input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </Field>
          <Field
            label={translate('music.renders.field.mood')}
            required
            error={errorFor('mood')}
          >
            <Input
              value={mood}
              onChange={(event) => setMood(event.target.value)}
            />
          </Field>
          <Field
            label={translate('music.renders.field.prompt')}
            hint={translate('music.renders.field.prompt.hint')}
            required
            error={errorFor('prompt')}
          >
            <Input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </Field>
          <Field
            label={translate('music.renders.field.duration')}
            required
            error={errorFor('durationSeconds')}
          >
            <Input
              type="number"
              value={durationSeconds}
              onChange={(event) => setDurationSeconds(event.target.value)}
            />
          </Field>
          <Field
            label={translate('music.renders.field.seed')}
            hint={translate('music.renders.field.seed.hint')}
            error={errorFor('seed')}
          >
            <Input
              type="number"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
            />
          </Field>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={submit.isPending}
          >
            {translate(
              submit.isPending
                ? 'music.renders.submitting'
                : 'music.renders.submit',
            )}
          </Button>
        </div>
      </form>

      {failure === null ? null : (
        <ErrorState
          title={translate('music.renders.submit.failed.title')}
          description={composeRouteErrorDescription(failure, translate)}
          detail={failure.detail}
          headingLevel={3}
        />
      )}

      {submit.isSuccess ? (
        <output
          className="music-renders__note"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('music.renders.submitted', {
            renderJobId: submit.data.renderJobId,
          })}
        </output>
      ) : null}

      {renders.error && renders.data === undefined ? (
        <p className="music-renders__note">
          {translate('music.renders.unreadable')}
        </p>
      ) : null}

      {renders.isPending ? (
        <output className="music-renders__note">
          {translate('music.renders.loading')}
        </output>
      ) : null}

      {renders.data === undefined ? null : renders.data.items.length === 0 ? (
        <p className="music-renders__note">{translate('music.renders.none')}</p>
      ) : (
        <ul className="music-renders__list">
          {renders.data.items.map((render) => (
            <li className="music-renders__item" key={render.id}>
              <dl className="music-renders__facts">
                <dt>{translate('music.renders.card.prompt')}</dt>
                <dd>
                  <ContentText>{render.prompt}</ContentText>
                </dd>
                <dt>{translate('music.renders.card.model')}</dt>
                <dd>
                  <span className="music-renders__notation" dir="ltr">
                    {render.modelId}
                  </span>
                </dd>
                <dt>{translate('music.renders.card.seed')}</dt>
                <dd>
                  {render.seed === undefined ? (
                    <span className="music-renders__absent">
                      {translate('music.renders.card.seed.none')}
                    </span>
                  ) : (
                    <span className="music-renders__notation" dir="ltr">
                      {render.seed}
                    </span>
                  )}
                </dd>
                <dt>{translate('music.renders.card.duration')}</dt>
                <dd>
                  <span className="music-renders__notation" dir="ltr">
                    {formatMilliseconds(render.durationMs)}
                  </span>
                </dd>
                <dt>{translate('music.renders.card.peak')}</dt>
                <dd>
                  <span className="music-renders__notation" dir="ltr">
                    {render.peakLevelDb} dB
                  </span>
                </dd>
                <dt>{translate('music.renders.card.audio')}</dt>
                <dd>
                  <span className="music-renders__notation" dir="ltr">
                    {translate('music.renders.card.audio.value', {
                      sampleRate: String(render.sampleRate),
                      channels: String(render.channels),
                    })}
                  </span>
                </dd>
                <dt>{translate('music.renders.card.path')}</dt>
                <dd>
                  <span className="music-renders__notation" dir="ltr">
                    {render.path}
                  </span>
                </dd>
              </dl>

              {promoting === render.id ? (
                <PromoteMusicCueForm
                  projectId={projectId}
                  render={render}
                  onClose={() => setPromoting(null)}
                />
              ) : (
                <div className="music-renders__actions">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setPromoting(render.id)}
                  >
                    {translate('music.promote.open')}
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {renders.data?.nextCursor === undefined ? null : (
        <p className="music-renders__note">
          {translate('music.renders.truncated')}
        </p>
      )}
    </section>
  );
};
