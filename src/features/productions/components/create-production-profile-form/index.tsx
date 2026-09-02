import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductionProfileRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { formatDuration } from '@/lib/format/format-duration';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { createProductionProfileMutationOptions } from '@/features/productions/api/create-production-profile.mutation';
import {
  EMPTY_PRODUCTION_PROFILE_VALUES,
  EMPTY_PROFILE_SECTION_VALUES,
  productionProfileCandidateFrom,
  profileTargetSecondsOf,
} from '@/features/productions/helpers/production-profile-candidate';
import type {
  ProductionProfileFormValues,
  ProfileSectionValues,
} from '@/features/productions/interfaces/production-profile-form-values';
import type { CreateProductionProfileFormProps } from './create-production-profile-form.interface';
import './create-production-profile-form.css';

type NumberField =
  | 'minutes'
  | 'seconds'
  | 'tolerance'
  | 'fps'
  | 'width'
  | 'height'
  | 'sampleRateHz'
  | 'audioChannels';

const FORMAT_FIELDS: ReadonlyArray<[NumberField, TranslationKey, string]> = [
  ['fps', 'productions.profiles.form.fps', 'fps'],
  ['width', 'productions.profiles.form.width', 'width'],
  ['height', 'productions.profiles.form.height', 'height'],
  ['sampleRateHz', 'productions.profiles.form.sampleRateHz', 'sampleRateHz'],
  ['audioChannels', 'productions.profiles.form.audioChannels', 'audioChannels'],
];

export const CreateProductionProfileForm: FC<
  CreateProductionProfileFormProps
> = ({ projectId, onClose }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const create = useMutation(
    createProductionProfileMutationOptions(projectId, queryClient),
  );
  const [values, setValues] = useState<ProductionProfileFormValues>(
    EMPTY_PRODUCTION_PROFILE_VALUES,
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const set = <K extends keyof ProductionProfileFormValues>(
    field: K,
    value: ProductionProfileFormValues[K],
  ): void => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const setSection = (
    index: number,
    next: Partial<ProfileSectionValues>,
  ): void => {
    set(
      'sections',
      values.sections.map((section, at) =>
        at === index ? { ...section, ...next } : section,
      ),
    );
  };

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = createProductionProfileRequestSchema.safeParse(
      productionProfileCandidateFrom(values),
    );

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    create.mutate(result.data);
  };

  const failure =
    create.error === null ? null : resolveRouteErrorView(create.error);
  const runtimeError = errorFor('targetRuntimeSeconds');

  return (
    <section className="create-production-profile-form">
      <div className="create-production-profile-form__header">
        <h3 className="create-production-profile-form__heading">
          {translate('productions.profiles.create.heading')}
        </h3>
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
      </div>

      {create.isSuccess ? (
        <output
          className="create-production-profile-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
      ) : (
        <form
          className="create-production-profile-form__form"
          onSubmit={handleSubmit}
        >
          {Object.keys(fieldErrors).length === 0 ? null : (
            <ValidationSummary
              count={invalidFieldCount(fieldErrors)}
              attempt={attempt}
            />
          )}

          <Field
            label={translate('productions.profiles.form.name')}
            required
            error={errorFor('name')}
          >
            <Input
              value={values.name}
              onChange={(event) => set('name', event.target.value)}
            />
          </Field>

          <Field
            label={translate('productions.profiles.form.description')}
            error={errorFor('description')}
          >
            <Textarea
              value={values.description}
              onChange={(event) => set('description', event.target.value)}
            />
          </Field>

          <fieldset className="create-production-profile-form__group">
            <legend className="create-production-profile-form__legend">
              {translate('productions.create.targetRuntime')}
            </legend>
            <div className="create-production-profile-form__grid">
              <Field
                label={translate('productions.create.targetRuntime.minutes')}
              >
                <Input
                  type="number"
                  value={values.minutes}
                  onChange={(event) => set('minutes', event.target.value)}
                  aria-invalid={runtimeError === '' ? undefined : true}
                />
              </Field>
              <Field
                label={translate('productions.create.targetRuntime.seconds')}
              >
                <Input
                  type="number"
                  value={values.seconds}
                  onChange={(event) => set('seconds', event.target.value)}
                  aria-invalid={runtimeError === '' ? undefined : true}
                />
              </Field>
            </div>
            <p className="create-production-profile-form__preview">
              {translate('productions.create.targetRuntime.preview')}{' '}
              <span dir="ltr">
                {formatDuration(profileTargetSecondsOf(values))}
              </span>
            </p>
            {runtimeError === '' ? null : (
              <p className="create-production-profile-form__hint">
                {runtimeError}
              </p>
            )}
          </fieldset>

          <Field
            label={translate('productions.profiles.form.tolerance')}
            hint={translate('productions.profiles.form.tolerance.hint')}
            required
            error={errorFor('toleranceSeconds')}
          >
            <Input
              type="number"
              value={values.tolerance}
              onChange={(event) => set('tolerance', event.target.value)}
            />
          </Field>

          <fieldset className="create-production-profile-form__group">
            <legend className="create-production-profile-form__legend">
              {translate('productions.profiles.frame')}
            </legend>
            <p className="create-production-profile-form__hint">
              {translate('productions.profiles.form.format.hint')}
            </p>
            <div className="create-production-profile-form__grid">
              {FORMAT_FIELDS.map(([field, label, wireField]) => (
                <Field
                  key={field}
                  label={translate(label)}
                  required
                  error={errorFor(wireField)}
                >
                  <Input
                    type="number"
                    value={values[field]}
                    onChange={(event) => set(field, event.target.value)}
                  />
                </Field>
              ))}
              <Field
                label={translate('productions.profiles.form.aspectRatio')}
                hint={translate('productions.profiles.form.aspectRatio.hint')}
                required
                error={errorFor('aspectRatio')}
              >
                <Input
                  value={values.aspectRatio}
                  onChange={(event) => set('aspectRatio', event.target.value)}
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="create-production-profile-form__group">
            <legend className="create-production-profile-form__legend">
              {translate('productions.profiles.form.sections')}
            </legend>
            <p className="create-production-profile-form__hint">
              {translate('productions.profiles.form.sections.hint')}
            </p>
            {values.sections.map((section, index) => {
              const position = String(index + 1);
              const prefix = `sections.${String(index)}`;

              return (
                <fieldset
                  key={index}
                  className="create-production-profile-form__section"
                >
                  <legend className="create-production-profile-form__legend">
                    {translate('productions.profiles.form.section', {
                      position,
                    })}
                  </legend>
                  <Field
                    label={translate('productions.profiles.form.section.label')}
                    required
                    error={errorFor(`${prefix}.label`)}
                  >
                    <Input
                      value={section.label}
                      onChange={(event) =>
                        setSection(index, { label: event.target.value })
                      }
                    />
                  </Field>
                  <div className="create-production-profile-form__grid">
                    <Field
                      label={translate(
                        'productions.profiles.form.section.start',
                      )}
                      required
                      error={errorFor(`${prefix}.startSeconds`)}
                    >
                      <Input
                        type="number"
                        value={section.startSeconds}
                        onChange={(event) =>
                          setSection(index, {
                            startSeconds: event.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field
                      label={translate('productions.profiles.form.section.end')}
                      required
                      error={errorFor(`${prefix}.endSeconds`)}
                    >
                      <Input
                        type="number"
                        value={section.endSeconds}
                        onChange={(event) =>
                          setSection(index, { endSeconds: event.target.value })
                        }
                      />
                    </Field>
                    <Field
                      label={translate(
                        'productions.profiles.form.section.reusable',
                      )}
                    >
                      <Select
                        options={[
                          {
                            value: 'false',
                            label: translate(
                              'productions.profiles.form.section.reusable.no',
                            ),
                          },
                          {
                            value: 'true',
                            label: translate(
                              'productions.profiles.form.section.reusable.yes',
                            ),
                          },
                        ]}
                        value={section.reusable ? 'true' : 'false'}
                        onChange={(value) =>
                          setSection(index, { reusable: value === 'true' })
                        }
                      />
                    </Field>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={translate(
                      'productions.profiles.form.section.removeContext',
                      { position },
                    )}
                    onClick={() =>
                      set(
                        'sections',
                        values.sections.filter((_section, at) => at !== index),
                      )
                    }
                  >
                    {translate('productions.profiles.form.section.remove')}
                  </Button>
                </fieldset>
              );
            })}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                set('sections', [
                  ...values.sections,
                  EMPTY_PROFILE_SECTION_VALUES,
                ])
              }
            >
              {translate('productions.profiles.form.section.add')}
            </Button>
          </fieldset>

          {failure === null ? null : (
            <ErrorState
              title={translate('productions.profiles.create.failed.title')}
              description={composeRouteErrorDescription(failure, translate)}
              detail={failure.detail}
              headingLevel={4}
            />
          )}

          <div className="create-production-profile-form__actions">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={create.isPending}
            >
              {translate(
                create.isPending
                  ? 'productions.profiles.create.submitting'
                  : 'productions.profiles.create.submit',
              )}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
