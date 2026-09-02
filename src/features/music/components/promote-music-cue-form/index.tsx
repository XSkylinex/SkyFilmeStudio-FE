import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { promoteMusicCueRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import { parseLines } from '@/lib/helpers/parse-lines';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { promoteMusicCueMutationOptions } from '@/features/music/api/promote-music-cue.mutation';
import type { PromoteMusicCueFormProps } from './promote-music-cue-form.interface';
import './promote-music-cue-form.css';

const NUMBER_FIELDS: ReadonlyArray<
  ['introMs' | 'outroMs' | 'safeDialogueLevelDb', TranslationKey]
> = [
  ['introMs', 'music.promote.intro'],
  ['outroMs', 'music.promote.outro'],
  ['safeDialogueLevelDb', 'music.promote.safeLevel'],
];

const numberOf = (value: string): number =>
  value.trim() === '' ? Number.NaN : Number(value);

export const PromoteMusicCueForm: FC<PromoteMusicCueFormProps> = ({
  projectId,
  render,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const promote = useMutation(
    promoteMusicCueMutationOptions(projectId, queryClient),
  );

  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [bpm, setBpm] = useState('');
  const [musicalKey, setMusicalKey] = useState('');
  const [loopable, setLoopable] = useState(false);
  const [numbers, setNumbers] = useState({
    introMs: '',
    outroMs: '',
    safeDialogueLevelDb: '',
  });
  const [licence, setLicence] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const parsedTags = parseLines(tags);
    const trimmedKey = musicalKey.trim();
    const trimmedLicence = licence.trim();
    const result = promoteMusicCueRequestSchema.safeParse({
      renderId: render.id,
      name: name.trim(),
      ...(parsedTags.length === 0 ? {} : { tags: parsedTags }),
      ...(bpm.trim() === '' ? {} : { bpm: Number(bpm) }),
      ...(trimmedKey === '' ? {} : { musicalKey: trimmedKey }),
      loopable,
      introMs: numberOf(numbers.introMs),
      outroMs: numberOf(numbers.outroMs),
      safeDialogueLevelDb: numberOf(numbers.safeDialogueLevelDb),
      ...(trimmedLicence === '' ? {} : { licence: trimmedLicence }),
    });

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    promote.mutate(result.data);
  };

  const failure =
    promote.error === null ? null : resolveRouteErrorView(promote.error);

  return (
    <section className="promote-music-cue-form">
      <h5 className="promote-music-cue-form__heading">
        {translate('music.promote.heading')}
      </h5>
      <p className="promote-music-cue-form__note">
        {translate('music.promote.explain')}
      </p>

      {promote.isSuccess ? (
        <output
          className="promote-music-cue-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
      ) : (
        <form onSubmit={handleSubmit}>
          {Object.keys(fieldErrors).length === 0 ? null : (
            <ValidationSummary
              count={invalidFieldCount(fieldErrors)}
              attempt={attempt}
            />
          )}

          <Field
            label={translate('music.promote.name')}
            required
            error={errorFor('name')}
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field
            label={translate('music.promote.tags')}
            hint={translate('music.promote.tags.hint')}
            error={errorFor('tags')}
          >
            <Textarea
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </Field>

          <div className="promote-music-cue-form__grid">
            <Field
              label={translate('music.promote.bpm')}
              hint={translate('music.promote.bpm.hint')}
              error={errorFor('bpm')}
            >
              <Input
                type="number"
                value={bpm}
                onChange={(event) => setBpm(event.target.value)}
              />
            </Field>

            <Field
              label={translate('music.promote.key')}
              hint={translate('music.promote.key.hint')}
              error={errorFor('musicalKey')}
            >
              <Input
                value={musicalKey}
                onChange={(event) => setMusicalKey(event.target.value)}
              />
            </Field>

            <Field label={translate('music.promote.loopable')}>
              <Select
                options={[
                  {
                    value: 'false',
                    label: translate('music.promote.loopable.no'),
                  },
                  {
                    value: 'true',
                    label: translate('music.promote.loopable.yes'),
                  },
                ]}
                value={loopable ? 'true' : 'false'}
                onChange={(value) => setLoopable(value === 'true')}
              />
            </Field>
          </div>

          <p className="promote-music-cue-form__note">
            {translate('music.promote.introOutro.hint')}
          </p>
          <div className="promote-music-cue-form__grid">
            {NUMBER_FIELDS.map(([field, label]) => (
              <Field
                key={field}
                label={translate(label)}
                hint={
                  field === 'safeDialogueLevelDb'
                    ? translate('music.promote.safeLevel.hint')
                    : ''
                }
                required
                error={errorFor(field)}
              >
                <Input
                  type="number"
                  value={numbers[field]}
                  onChange={(event) =>
                    setNumbers((previous) => ({
                      ...previous,
                      [field]: event.target.value,
                    }))
                  }
                />
              </Field>
            ))}
          </div>

          <Field
            label={translate('music.promote.licence')}
            hint={translate('music.promote.licence.hint')}
            error={errorFor('licence')}
          >
            <Input
              value={licence}
              onChange={(event) => setLicence(event.target.value)}
            />
          </Field>

          {failure === null ? null : (
            <ErrorState
              title={translate('music.promote.failed.title')}
              description={composeRouteErrorDescription(failure, translate)}
              detail={failure.detail}
              headingLevel={6}
            />
          )}

          <div className="promote-music-cue-form__actions">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {translate('library.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={promote.isPending}
            >
              {translate(
                promote.isPending
                  ? 'music.promote.submitting'
                  : 'music.promote.submit',
              )}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
