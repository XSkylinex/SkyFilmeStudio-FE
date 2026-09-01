import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVoiceProfileRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { createVoiceProfileMutationOptions } from '@/features/voices/api/create-voice-profile.mutation';
import type { CreateVoiceProfileFormProps } from './create-voice-profile-form.interface';
import './create-voice-profile-form.css';

const TRANSCRIPT_ROWS = 4;

export const CreateVoiceProfileForm: FC<CreateVoiceProfileFormProps> = ({
  projectId,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const create = useMutation(
    createVoiceProfileMutationOptions(projectId, queryClient),
  );

  const [displayName, setDisplayName] = useState('');
  const [engine, setEngine] = useState('');
  const [modelId, setModelId] = useState('');
  const [language, setLanguage] = useState('');
  const [referenceAudioPath, setReferenceAudioPath] = useState('');
  const [referenceTranscript, setReferenceTranscript] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  if (create.isSuccess) {
    return (
      <div className="create-voice-profile-form">
        <output
          className="create-voice-profile-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
        <div className="create-voice-profile-form__actions">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            {translate('library.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = createVoiceProfileRequestSchema.safeParse({
      displayName,
      engine,
      modelId,
      language,
      referenceAudioPath:
        referenceAudioPath === '' ? undefined : referenceAudioPath,
      referenceTranscript:
        referenceTranscript === '' ? undefined : referenceTranscript,
    });

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

  return (
    <section className="create-voice-profile-form">
      <form className="create-voice-profile-form__form" onSubmit={handleSubmit}>
        {Object.keys(fieldErrors).length === 0 ? null : (
          <ValidationSummary
            count={Object.keys(fieldErrors).length}
            attempt={attempt}
          />
        )}

        <Field
          label={translate('library.field.displayName')}
          required
          error={errorFor('displayName')}
        >
          <Input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.engine')}
          required
          error={errorFor('engine')}
        >
          <Input
            value={engine}
            onChange={(event) => setEngine(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.modelId')}
          required
          error={errorFor('modelId')}
        >
          <Input
            value={modelId}
            onChange={(event) => setModelId(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.language')}
          required
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

        <div className="create-voice-profile-form__actions">
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

      {failure === null ? null : (
        <p className="create-voice-profile-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
          {failure.detail === undefined ? null : (
            <span className="create-voice-profile-form__refusal-code" dir="ltr">
              {failure.detail}
            </span>
          )}
        </p>
      )}
    </section>
  );
};
