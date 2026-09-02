import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { replaceSceneCuesRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { musicCuesQueryOptions } from '@/features/music/api/music-cues.query';
import { replaceSceneCuesMutationOptions } from '@/features/audio/api/replace-scene-cues.mutation';
import { sceneCuesQueryOptions } from '@/features/audio/api/scene-cues.query';
import {
  EMPTY_SCENE_CUE_VALUES,
  sceneCueValuesFrom,
  sceneCuesFrom,
} from '@/features/audio/helpers/scene-cue-values';
import type { SceneCueValues } from '@/features/audio/interfaces/scene-cue-values';
import type { SceneScoreProps } from './scene-score.interface';
import './scene-score.css';

const NUMBER_FIELDS: ReadonlyArray<
  [keyof SceneCueValues, TranslationKey, string]
> = [
  ['startOffsetMs', 'audio.score.cue.startsAt', 'startOffsetMs'],
  ['gainDb', 'audio.score.cue.gain', 'gainDb'],
  ['fadeInMs', 'audio.score.cue.fadeIn', 'fadeInMs'],
  ['fadeOutMs', 'audio.score.cue.fadeOut', 'fadeOutMs'],
];

export const SceneScore: FC<SceneScoreProps> = ({
  projectId,
  productionId,
  sceneId,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const placed = useQuery(sceneCuesQueryOptions(sceneId));
  const library = useQuery(musicCuesQueryOptions(projectId));
  const save = useMutation(
    replaceSceneCuesMutationOptions(sceneId, productionId, queryClient),
  );

  const [values, setValues] = useState<readonly SceneCueValues[] | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const cues = values ?? sceneCueValuesFrom(placed.data ?? []);

  const replaceAt = (index: number, next: Partial<SceneCueValues>): void => {
    setValues(cues.map((cue, at) => (at === index ? { ...cue, ...next } : cue)));
  };

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = replaceSceneCuesRequestSchema.safeParse(sceneCuesFrom(cues));

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    save.mutate(result.data, { onSuccess: () => setValues(null) });
  };

  const failure = save.error === null ? null : resolveRouteErrorView(save.error);
  const known = library.data?.items ?? [];
  const cueOptions = [
    { value: '', label: translate('audio.score.cue.choose') },
    ...known.map((cue) => ({ value: cue.id, label: cue.name })),
  ];

  const optionsFor = (musicCueId: string): typeof cueOptions =>
    musicCueId === '' || known.some((cue) => cue.id === musicCueId)
      ? cueOptions
      : [
          ...cueOptions,
          {
            value: musicCueId,
            label: translate('audio.score.cue.unknown'),
          },
        ];

  return (
    <section className="scene-score">
      <h4 className="scene-score__title">
        {translate('audio.score.scene.heading')}
      </h4>
      <p className="scene-score__note">
        {translate('audio.score.scene.wholesale')}
      </p>

      {placed.error && placed.data === undefined ? (
        <ErrorState
          title={translate('audio.score.scene.unreadable')}
          description={composeRouteErrorDescription(
            resolveRouteErrorView(placed.error),
            translate,
          )}
          detail={resolveRouteErrorView(placed.error).detail}
          headingLevel={5}
        />
      ) : null}

      {library.error && library.data === undefined ? (
        <p className="scene-score__note">
          {translate('audio.score.cue.libraryUnreadable')}
        </p>
      ) : null}

      <form onSubmit={handleSubmit}>
        {Object.keys(fieldErrors).length === 0 ? null : (
          <ValidationSummary
            count={invalidFieldCount(fieldErrors)}
            attempt={attempt}
          />
        )}

        {cues.length === 0 ? (
          <p className="scene-score__note">
            {translate('audio.score.scene.none')}
          </p>
        ) : (
          cues.map((cue, index) => {
            const position = String(index + 1);
            const prefix = `cues.${String(index)}`;

            return (
              <fieldset key={index} className="scene-score__cue">
                <legend className="scene-score__cue-name">
                  {translate('audio.score.cue.entry', { position })}
                </legend>

                <Field
                  label={translate('audio.score.cue.name')}
                  required
                  error={errorFor(`${prefix}.musicCueId`)}
                >
                  <Select
                    options={optionsFor(cue.musicCueId)}
                    value={cue.musicCueId}
                    onChange={(value) => replaceAt(index, { musicCueId: value })}
                  />
                </Field>

                <div className="scene-score__grid">
                  {NUMBER_FIELDS.map(([field, label, wireField]) => (
                    <Field
                      key={field}
                      label={translate(label)}
                      required
                      error={errorFor(`${prefix}.${wireField}`)}
                    >
                      <Input
                        type="number"
                        value={String(cue[field])}
                        onChange={(event) =>
                          replaceAt(index, { [field]: event.target.value })
                        }
                      />
                    </Field>
                  ))}
                </div>

                <Field label={translate('audio.score.cue.loop')}>
                  <Select
                    options={[
                      {
                        value: 'no',
                        label: translate('audio.score.cue.loop.no'),
                      },
                      {
                        value: 'yes',
                        label: translate('audio.score.cue.loop.yes'),
                      },
                    ]}
                    value={cue.loop ? 'yes' : 'no'}
                    onChange={(value) =>
                      replaceAt(index, { loop: value === 'yes' })
                    }
                  />
                </Field>

                <div className="scene-score__actions">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`${translate('audio.score.cue.remove')} ${translate(
                      'audio.score.cue.removeContext',
                      { position },
                    )}`}
                    onClick={() =>
                      setValues(cues.filter((_cue, at) => at !== index))
                    }
                  >
                    {translate('audio.score.cue.remove')}
                  </Button>
                </div>
              </fieldset>
            );
          })
        )}

        {failure === null ? null : (
          <ErrorState
            title={translate('audio.score.scene.failed.title')}
            description={composeRouteErrorDescription(failure, translate)}
            detail={failure.detail}
            headingLevel={5}
          />
        )}

        {save.isSuccess && values === null ? (
          <output
            className="scene-score__done"
            ref={focusWhenShown}
            tabIndex={-1}
          >
            {translate('audio.score.scene.saved')}
          </output>
        ) : null}

        <div className="scene-score__actions">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setValues([...cues, EMPTY_SCENE_CUE_VALUES])}
          >
            {translate('audio.score.cue.add')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={save.isPending || values === null}
          >
            {translate(
              save.isPending
                ? 'audio.score.scene.saving'
                : 'audio.score.scene.save',
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};
