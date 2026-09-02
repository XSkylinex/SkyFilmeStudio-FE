import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVoiceProfileRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { diffNullableText } from '@/lib/helpers/diff-nullable-text';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { updateVoiceProfileMutationOptions } from '@/features/voices/api/update-voice-profile.mutation';
import type { EditVoiceProfileFormProps } from './edit-voice-profile-form.interface';
import './edit-voice-profile-form.css';

const TRANSCRIPT_ROWS = 4;

export const EditVoiceProfileForm: FC<EditVoiceProfileFormProps> = ({
  projectId,
  voiceProfile,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const update = useMutation(
    updateVoiceProfileMutationOptions(projectId, voiceProfile.id, queryClient),
  );

  const [displayName, setDisplayName] = useState(voiceProfile.displayName);
  const [engine, setEngine] = useState(voiceProfile.engine);
  const [modelId, setModelId] = useState(voiceProfile.modelId);
  const [language, setLanguage] = useState<string>(voiceProfile.language);
  const originalAudioPath = voiceProfile.referenceAudioPath ?? '';
  const originalTranscript = voiceProfile.referenceTranscript ?? '';
  const [referenceAudioPath, setReferenceAudioPath] =
    useState(originalAudioPath);
  const [referenceTranscript, setReferenceTranscript] =
    useState(originalTranscript);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const baseline = update.data ?? voiceProfile;
  const patch = {
    displayName: displayName === baseline.displayName ? undefined : displayName,
    engine: engine === baseline.engine ? undefined : engine,
    modelId: modelId === baseline.modelId ? undefined : modelId,
    language: language === baseline.language ? undefined : language,
    referenceAudioPath: diffNullableText(
      referenceAudioPath,
      baseline.referenceAudioPath,
    ),
    referenceTranscript: diffNullableText(
      referenceTranscript,
      baseline.referenceTranscript,
    ),
  };
  const hasChanges = Object.values(patch).some((value) => value !== undefined);
  const justSaved = update.isSuccess && !hasChanges;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = updateVoiceProfileRequestSchema.safeParse(patch);

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    update.mutate(result.data);
  };

  const failure =
    update.error === null ? null : resolveRouteErrorView(update.error);

  return (
    <section className="edit-voice-profile-form">
      <form className="edit-voice-profile-form__form" onSubmit={handleSubmit}>
        {Object.keys(fieldErrors).length === 0 ? null : (
          <ValidationSummary
            count={invalidFieldCount(fieldErrors)}
            attempt={attempt}
          />
        )}

        <Field
          label={translate('library.field.displayName')}
          error={errorFor('displayName')}
        >
          <Input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.engine')}
          error={errorFor('engine')}
        >
          <Input
            value={engine}
            onChange={(event) => setEngine(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.modelId')}
          error={errorFor('modelId')}
        >
          <Input
            value={modelId}
            onChange={(event) => setModelId(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.language')}
          error={errorFor('language')}
        >
          <Input
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.referenceAudioPath')}
          error={errorFor('referenceAudioPath')}
        >
          <Input
            value={referenceAudioPath}
            onChange={(event) => setReferenceAudioPath(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.referenceTranscript')}
          hint={translate('library.field.referenceTranscript.hint')}
          error={errorFor('referenceTranscript')}
        >
          <Textarea
            value={referenceTranscript}
            onChange={(event) => setReferenceTranscript(event.target.value)}
            rows={TRANSCRIPT_ROWS}
          />
        </Field>

        {justSaved ? (
          <output
            className="edit-voice-profile-form__done"
            ref={focusWhenShown}
            tabIndex={-1}
          >
            {translate('library.saved')}
          </output>
        ) : null}

        <div className="edit-voice-profile-form__actions">
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

      {failure === null ? null : (
        <p className="edit-voice-profile-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
          {failure.detail === undefined ? null : (
            <span className="edit-voice-profile-form__refusal-code" dir="ltr">
              {failure.detail}
            </span>
          )}
        </p>
      )}
    </section>
  );
};
