import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { replaceAudioCuesRequestSchema } from 'sky-filme-studio-be/contracts';
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
import { sfxAssetsQueryOptions } from '@/features/sfx/api/sfx-assets.query';
import { replaceAudioCuesMutationOptions } from '@/features/shots/api/replace-audio-cues.mutation';
import { shotAudioCuesQueryOptions } from '@/features/shots/api/shot-audio-cues.query';
import {
  EMPTY_AUDIO_CUE_VALUES,
  audioCueValuesFrom,
  audioCuesFrom,
} from '@/features/shots/helpers/audio-cue-values';
import type { AudioCueValues } from '@/features/shots/interfaces/audio-cue-values';
import type { ShotAudioCuesProps } from './shot-audio-cues.interface';
import './shot-audio-cues.css';

const NUMBER_FIELDS: ReadonlyArray<
  [keyof AudioCueValues, TranslationKey, string]
> = [
  ['atMs', 'shots.cues.field.at', 'atMs'],
  ['durationMs', 'shots.cues.field.duration', 'durationMs'],
  ['gainDb', 'shots.cues.field.gain', 'gainDb'],
  ['fadeInMs', 'shots.cues.field.fadeIn', 'fadeInMs'],
  ['fadeOutMs', 'shots.cues.field.fadeOut', 'fadeOutMs'],
];

export const ShotAudioCues: FC<ShotAudioCuesProps> = ({ shot }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const cues = useQuery(shotAudioCuesQueryOptions(shot.id));
  const assets = useQuery(sfxAssetsQueryOptions());
  const save = useMutation(
    replaceAudioCuesMutationOptions(shot.id, queryClient),
  );

  const [values, setValues] = useState<readonly AudioCueValues[] | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const placed = values ?? audioCueValuesFrom(cues.data ?? []);

  const replaceAt = (index: number, next: Partial<AudioCueValues>): void => {
    setValues(
      placed.map((cue, at) => (at === index ? { ...cue, ...next } : cue)),
    );
  };

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = replaceAudioCuesRequestSchema.safeParse(
      audioCuesFrom(placed),
    );

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    save.mutate(result.data, { onSuccess: () => setValues(null) });
  };

  const failure =
    save.error === null ? null : resolveRouteErrorView(save.error);
  const assetOptions = [
    { value: '', label: translate('shots.cues.field.asset.none') },
    ...(assets.data?.items ?? []).map((asset) => ({
      value: asset.id,
      label: asset.name,
    })),
  ];

  return (
    <section className="shot-audio-cues">
      <h5 className="shot-audio-cues__title">
        {translate('shots.cues.title')}
      </h5>
      <p className="shot-audio-cues__note">{translate('shots.cues.explain')}</p>

      {cues.error && cues.data === undefined ? (
        <p className="shot-audio-cues__note">
          {translate('shots.cues.unreadable')}
        </p>
      ) : null}

      {assets.error && assets.data === undefined ? (
        <p className="shot-audio-cues__note">
          {translate('shots.cues.field.asset.unreadable')}
        </p>
      ) : null}

      <form onSubmit={handleSubmit}>
        {Object.keys(fieldErrors).length === 0 ? null : (
          <ValidationSummary
            count={invalidFieldCount(fieldErrors)}
            attempt={attempt}
          />
        )}

        {placed.length === 0 ? (
          <p className="shot-audio-cues__note">
            {translate('shots.cues.none')}
          </p>
        ) : (
          placed.map((cue, index) => {
            const position = String(index + 1);
            const prefix = `cues.${String(index)}`;

            return (
              <fieldset key={index} className="shot-audio-cues__entry">
                <legend className="shot-audio-cues__legend">
                  {translate('shots.cues.entry', { position })}
                </legend>

                <Field
                  label={translate('shots.cues.field.asset')}
                  required
                  error={errorFor(`${prefix}.sfxAssetId`)}
                >
                  <Select
                    options={assetOptions}
                    value={cue.sfxAssetId}
                    onChange={(value) =>
                      replaceAt(index, { sfxAssetId: value })
                    }
                  />
                </Field>

                <Field label={translate('shots.cues.field.stem')}>
                  <Select
                    options={[
                      {
                        value: 'FX',
                        label: translate('shots.cues.field.stem.FX'),
                      },
                      {
                        value: 'AMB',
                        label: translate('shots.cues.field.stem.AMB'),
                      },
                    ]}
                    value={cue.stemKind}
                    onChange={(value) =>
                      replaceAt(index, {
                        stemKind: value === 'AMB' ? 'AMB' : 'FX',
                      })
                    }
                  />
                </Field>

                <div className="shot-audio-cues__grid">
                  {NUMBER_FIELDS.map(([field, label, wireField]) => (
                    <Field
                      key={field}
                      label={translate(label)}
                      required
                      error={errorFor(`${prefix}.${wireField}`)}
                    >
                      <Input
                        type="number"
                        value={cue[field]}
                        onChange={(event) =>
                          replaceAt(index, { [field]: event.target.value })
                        }
                      />
                    </Field>
                  ))}
                </div>

                <div className="shot-audio-cues__actions">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={translate('shots.cues.removeContext', {
                      position,
                    })}
                    onClick={() =>
                      setValues(placed.filter((_cue, at) => at !== index))
                    }
                  >
                    {translate('shots.cues.remove')}
                  </Button>
                </div>
              </fieldset>
            );
          })
        )}

        {failure === null ? null : (
          <ErrorState
            title={translate('shots.cues.failed.title')}
            description={composeRouteErrorDescription(failure, translate)}
            detail={failure.detail}
            headingLevel={6}
          />
        )}

        {save.isSuccess && values === null ? (
          <output
            className="shot-audio-cues__done"
            ref={focusWhenShown}
            tabIndex={-1}
          >
            {translate('shots.cues.saved')}
          </output>
        ) : null}

        <div className="shot-audio-cues__actions">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setValues([...placed, EMPTY_AUDIO_CUE_VALUES])}
          >
            {translate('shots.cues.add')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={save.isPending || values === null}
          >
            {translate(
              save.isPending ? 'shots.cues.saving' : 'shots.cues.save',
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};
