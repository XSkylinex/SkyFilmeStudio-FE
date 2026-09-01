import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProjectBibleRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { Textarea } from '@/lib/components/textarea';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { createProjectBibleMutationOptions } from '@/features/bible/api/create-project-bible.mutation';
import {
  audioFromValues,
  narrativeFromValues,
  worldFromValues,
} from '@/features/bible/helpers/bible-sections-from-values';
import type {
  BibleFormField,
  BibleFormValues,
} from '@/features/bible/interfaces/bible-form-values';
import { styleProfilesQueryOptions } from '@/features/styles/api/style-profiles.query';
import type { CreateBibleFormProps } from './create-bible-form.interface';
import './create-bible-form.css';

export const CreateBibleForm: FC<CreateBibleFormProps> = ({
  projectId,
  carriesNarrative,
  initialValues,
  carriedSubjectRules,
  prefilledFromVersion,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const styleProfiles = useQuery(styleProfilesQueryOptions(projectId));
  const create = useMutation(
    createProjectBibleMutationOptions(projectId, queryClient),
  );

  const [values, setValues] = useState<BibleFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});

  const set = (field: BibleFormField, value: string): void => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  if (create.isSuccess) {
    return (
      <div className="create-bible-form">
        <output
          className="create-bible-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
        <div className="create-bible-form__actions">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            {translate('library.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const narrative = narrativeFromValues(values);
    const candidate = {
      world: worldFromValues(values),
      ...(carriesNarrative && narrative !== undefined ? { narrative } : {}),
      audio: audioFromValues(values),
      subjectRules: carriedSubjectRules ?? [],
      ...(values.styleProfileId === ''
        ? {}
        : { styleProfileId: values.styleProfileId }),
    };

    const result = createProjectBibleRequestSchema.safeParse(candidate);

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      return;
    }

    setFieldErrors({});
    create.mutate(result.data);
  };

  const failure =
    create.error === null ? null : resolveRouteErrorView(create.error);

  const styleProfileField =
    styleProfiles.error && styleProfiles.data === undefined ? (
      <p className="create-bible-form__note">
        {translate('bible.form.styleProfile.unreadable')}
      </p>
    ) : (
      <Field
        label={translate('bible.form.styleProfile')}
        error={errorFor('styleProfileId')}
      >
        <Select
          options={[
            { value: '', label: translate('bible.form.styleProfile.none') },
            ...(styleProfiles.data?.items ?? []).map((profile) => ({
              value: profile.id,
              label: `${profile.name} ${translate('productions.create.styleProfile.version', { version: profile.version })}`,
            })),
          ]}
          value={values.styleProfileId}
          onChange={(value) => set('styleProfileId', value)}
        />
      </Field>
    );

  const styleProfileTruncated =
    styleProfiles.data?.nextCursor === undefined ? null : (
      <p className="create-bible-form__note">
        {translate('bible.form.styleProfile.firstPageOnly')}
      </p>
    );

  return (
    <form className="create-bible-form" onSubmit={handleSubmit}>
      {prefilledFromVersion === undefined ? null : (
        <p className="create-bible-form__note">
          {translate('bible.create.prefilled', {
            version: String(prefilledFromVersion),
          })}
        </p>
      )}
      <p className="create-bible-form__note">
        {translate('bible.create.explain')}
      </p>

      <fieldset className="create-bible-form__fieldset">
        <legend className="create-bible-form__legend">
          {translate('bible.world.title')}
        </legend>

        <Field
          label={translate('bible.world.genre')}
          error={errorFor('world.genre')}
        >
          <Input
            value={values.genre}
            onChange={(event) => set('genre', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.world.tone')}
          error={errorFor('world.tone')}
        >
          <Input
            value={values.tone}
            onChange={(event) => set('tone', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.world.audience')}
          error={errorFor('world.audienceProfile')}
        >
          <Input
            value={values.audienceProfile}
            onChange={(event) => set('audienceProfile', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.world.contentBoundaries')}
          hint={translate('library.field.linesHint')}
          error={errorFor('world.contentBoundaries')}
        >
          <Textarea
            value={values.contentBoundaries}
            onChange={(event) => set('contentBoundaries', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.world.recurringThemes')}
          hint={translate('library.field.linesHint')}
          error={errorFor('world.recurringThemes')}
        >
          <Textarea
            value={values.recurringThemes}
            onChange={(event) => set('recurringThemes', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.world.introOutroRules')}
          hint={translate('library.field.linesHint')}
          error={errorFor('world.introOutroRules')}
        >
          <Textarea
            value={values.introOutroRules}
            onChange={(event) => set('introOutroRules', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.world.continuityConstraints')}
          hint={translate('library.field.linesHint')}
          error={errorFor('world.continuityConstraints')}
        >
          <Textarea
            value={values.continuityConstraints}
            onChange={(event) =>
              set('continuityConstraints', event.target.value)
            }
          />
        </Field>
      </fieldset>

      {carriesNarrative ? (
        <fieldset className="create-bible-form__fieldset">
          <legend className="create-bible-form__legend">
            {translate('bible.narrative.title')}
          </legend>

          <Field
            label={translate('bible.narrative.worldRules')}
            hint={translate('library.field.linesHint')}
            error={errorFor('narrative.worldRules')}
          >
            <Textarea
              value={values.narrativeWorldRules}
              onChange={(event) =>
                set('narrativeWorldRules', event.target.value)
              }
            />
          </Field>

          <Field
            label={translate('bible.narrative.humourDramaLanguage')}
            error={errorFor('narrative.humourDramaLanguage')}
          >
            <Input
              value={values.humourDramaLanguage}
              onChange={(event) =>
                set('humourDramaLanguage', event.target.value)
              }
            />
          </Field>

          <Field
            label={translate('bible.narrative.chronology')}
            error={errorFor('narrative.chronology')}
          >
            <Input
              value={values.chronology}
              onChange={(event) => set('chronology', event.target.value)}
            />
          </Field>
        </fieldset>
      ) : null}

      <fieldset className="create-bible-form__fieldset">
        <legend className="create-bible-form__legend">
          {translate('bible.audio.title')}
        </legend>

        <Field
          label={translate('bible.audio.languages')}
          hint={translate('bible.form.languages.hint')}
          error={errorFor('audio.languages')}
        >
          <Textarea
            value={values.languages}
            onChange={(event) => set('languages', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.audio.narratorPolicy')}
          error={errorFor('audio.narratorPolicy')}
        >
          <Input
            value={values.narratorPolicy}
            onChange={(event) => set('narratorPolicy', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.audio.musicIdentity')}
          error={errorFor('audio.musicIdentity')}
        >
          <Input
            value={values.musicIdentity}
            onChange={(event) => set('musicIdentity', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.audio.recurringMotifs')}
          hint={translate('library.field.linesHint')}
          error={errorFor('audio.recurringMotifs')}
        >
          <Textarea
            value={values.recurringMotifs}
            onChange={(event) => set('recurringMotifs', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.audio.ambienceRules')}
          hint={translate('library.field.linesHint')}
          error={errorFor('audio.ambienceRules')}
        >
          <Textarea
            value={values.ambienceRules}
            onChange={(event) => set('ambienceRules', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.audio.sfxAesthetic')}
          error={errorFor('audio.sfxAesthetic')}
        >
          <Input
            value={values.sfxAesthetic}
            onChange={(event) => set('sfxAesthetic', event.target.value)}
          />
        </Field>

        <Field
          label={translate('bible.audio.dialogueMusicPriority')}
          error={errorFor('audio.dialogueMusicPriority')}
        >
          <Input
            value={values.dialogueMusicPriority}
            onChange={(event) =>
              set('dialogueMusicPriority', event.target.value)
            }
          />
        </Field>

        <Field
          label={translate('bible.audio.loudnessProfile')}
          error={errorFor('audio.loudnessProfile')}
        >
          <Input
            value={values.loudnessProfile}
            onChange={(event) => set('loudnessProfile', event.target.value)}
          />
        </Field>
      </fieldset>

      {styleProfileField}
      {styleProfileTruncated}

      <p className="create-bible-form__note">
        {translate('bible.form.subjectRules')}
      </p>

      {failure === null ? null : (
        <p className="create-bible-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <div className="create-bible-form__actions">
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={create.isPending}
        >
          {translate(create.isPending ? 'library.creating' : 'library.add')}
        </Button>
      </div>
    </form>
  );
};
