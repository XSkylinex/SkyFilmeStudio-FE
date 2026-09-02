import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bibleCarriesNarrative,
  updateProjectBibleRequestSchema,
} from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { updateProjectBibleMutationOptions } from '@/features/bible/api/update-project-bible.mutation';
import { bibleEditDiff } from '@/features/bible/helpers/bible-edit-diff';
import { bibleFormValuesFrom } from '@/features/bible/helpers/bible-form-values';
import type {
  BibleFormField,
  BibleFormValues,
} from '@/features/bible/interfaces/bible-form-values';
import { BibleSubjectRulesEditor } from '@/features/bible/components/bible-subject-rules-editor';
import { subjectRulesValuesFrom } from '@/features/bible/helpers/subject-rules-values';
import type { SubjectRulesValues } from '@/features/bible/interfaces/subject-rules-values';
import { styleProfilesQueryOptions } from '@/features/styles/api/style-profiles.query';
import type { EditBibleFormProps } from './edit-bible-form.interface';
import './edit-bible-form.css';

export const EditBibleForm: FC<EditBibleFormProps> = ({
  projectId,
  bible,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const styleProfiles = useQuery(styleProfilesQueryOptions(projectId));
  const update = useMutation(
    updateProjectBibleMutationOptions(projectId, bible.id, queryClient),
  );

  const [values, setValues] = useState<BibleFormValues>(
    bibleFormValuesFrom(bible),
  );
  const [subjectRules, setSubjectRules] = useState<
    readonly SubjectRulesValues[]
  >(subjectRulesValuesFrom(bible.subjectRules));
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const [touchedSinceSave, setTouchedSinceSave] = useState(false);

  const set = (field: BibleFormField, value: string): void => {
    setTouchedSinceSave(true);
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const carriesNarrative = bibleCarriesNarrative(bible.projectKind);
  const baseline = update.data ?? bible;
  const patch = bibleEditDiff(baseline, values, carriesNarrative, subjectRules);
  const hasChanges = Object.keys(patch).length > 0;
  const justSaved = update.isSuccess && !hasChanges && !touchedSinceSave;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!hasChanges) {
      return;
    }

    const result = updateProjectBibleRequestSchema.safeParse(patch);

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    setTouchedSinceSave(false);
    update.mutate(result.data);
  };

  const failure =
    update.error === null ? null : resolveRouteErrorView(update.error);

  const styleProfileField =
    styleProfiles.error && styleProfiles.data === undefined ? (
      <p className="edit-bible-form__note">
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
      <p className="edit-bible-form__note">
        {translate('bible.form.styleProfile.firstPageOnly')}
      </p>
    );

  return (
    <form className="edit-bible-form" onSubmit={handleSubmit}>
      {Object.keys(fieldErrors).length === 0 ? null : (
        <ValidationSummary
          count={invalidFieldCount(fieldErrors)}
          attempt={attempt}
        />
      )}

      <fieldset className="edit-bible-form__fieldset">
        <legend className="edit-bible-form__legend">
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
        <fieldset className="edit-bible-form__fieldset">
          <legend className="edit-bible-form__legend">
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
      ) : (
        <p className="edit-bible-form__note">
          {translate('bible.narrative.notCarried')}
        </p>
      )}

      <fieldset className="edit-bible-form__fieldset">
        <legend className="edit-bible-form__legend">
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

      <BibleSubjectRulesEditor
        projectId={projectId}
        value={subjectRules}
        onChange={(next) => {
          setTouchedSinceSave(true);
          setSubjectRules(next);
        }}
        errorFor={errorFor}
      />

      {justSaved ? (
        <output
          className="edit-bible-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.saved')}
        </output>
      ) : null}

      {failure === null ? null : (
        <p className="edit-bible-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <div className="edit-bible-form__actions">
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={update.isPending || !hasChanges}
        >
          {translate(update.isPending ? 'library.saving' : 'library.save')}
        </Button>
      </div>
    </form>
  );
};
