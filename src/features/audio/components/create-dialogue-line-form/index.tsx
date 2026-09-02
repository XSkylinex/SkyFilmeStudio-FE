import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDialogueLineRequestSchema } from 'sky-filme-studio-be/contracts';
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
import { createDialogueLineMutationOptions } from '@/features/audio/api/create-dialogue-line.mutation';
import { projectSubjectsQueryOptions } from '@/features/subjects/api/project-subjects.query';
import { voiceProfilesQueryOptions } from '@/features/voices/api/voice-profiles.query';
import type { CreateDialogueLineFormProps } from './create-dialogue-line-form.interface';
import './create-dialogue-line-form.css';

const NO_SPEAKER = '';

const toWholeNumber = (value: string): number =>
  value === '' ? 0 : Number(value);

export const CreateDialogueLineForm: FC<CreateDialogueLineFormProps> = ({
  projectId,
  sceneId,
  nextOrder,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const voices = useQuery(voiceProfilesQueryOptions(projectId));
  const subjects = useQuery(projectSubjectsQueryOptions(projectId));
  const create = useMutation(
    createDialogueLineMutationOptions(sceneId, queryClient),
  );

  const [text, setText] = useState('');
  const [language, setLanguage] = useState('');
  const [voiceProfileId, setVoiceProfileId] = useState('');
  const [speakerSubjectId, setSpeakerSubjectId] = useState(NO_SPEAKER);
  const [order, setOrder] = useState(String(nextOrder));
  const [emotion, setEmotion] = useState('');
  const [pace, setPace] = useState('');
  const [pauseBeforeMs, setPauseBeforeMs] = useState('0');
  const [pauseAfterMs, setPauseAfterMs] = useState('0');
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
      <div className="create-dialogue-line-form">
        <output
          className="create-dialogue-line-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('audio.line.created')}
        </output>
        <div className="create-dialogue-line-form__actions">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            {translate('library.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const candidate = {
      text,
      language,
      voiceProfileId,
      ...(speakerSubjectId === NO_SPEAKER ? {} : { speakerSubjectId }),
      order: toWholeNumber(order),
      pronunciationOverrides: [],
      emotion,
      pace,
      pauseBeforeMs: toWholeNumber(pauseBeforeMs),
      pauseAfterMs: toWholeNumber(pauseAfterMs),
    };

    const result = createDialogueLineRequestSchema.safeParse(candidate);

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

  const voiceOptions = [
    { value: '', label: translate('audio.line.form.voice.choose') },
    ...(voices.data?.items ?? []).map((voice) => ({
      value: voice.id,
      label: voice.displayName,
    })),
  ];

  const speakerOptions = [
    { value: NO_SPEAKER, label: translate('audio.line.form.speaker.none') },
    ...(subjects.data?.items ?? []).map((subject) => ({
      value: subject.id,
      label: subject.displayName,
    })),
  ];

  return (
    <form className="create-dialogue-line-form" onSubmit={handleSubmit}>
      {Object.keys(fieldErrors).length === 0 ? null : (
        <ValidationSummary
          count={invalidFieldCount(fieldErrors)}
          attempt={attempt}
        />
      )}

      <Field label={translate('audio.line.form.text')} error={errorFor('text')}>
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </Field>

      <Field
        label={translate('audio.line.language')}
        hint={translate('audio.line.form.language.hint')}
        required
        error={errorFor('language')}
      >
        <Input
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        />
      </Field>

      {voices.error && voices.data === undefined ? (
        <p className="create-dialogue-line-form__note">
          {translate('audio.line.form.voice.unreadable')}
        </p>
      ) : (
        <Field
          label={translate('audio.line.form.voice')}
          required
          error={errorFor('voiceProfileId')}
        >
          <Select
            options={voiceOptions}
            value={voiceProfileId}
            onChange={setVoiceProfileId}
          />
        </Field>
      )}
      {voices.data?.nextCursor === undefined ? null : (
        <p className="create-dialogue-line-form__note">
          {translate('audio.line.form.voice.firstPageOnly')}
        </p>
      )}

      {subjects.error && subjects.data === undefined ? null : (
        <Field
          label={translate('audio.line.form.speaker')}
          error={errorFor('speakerSubjectId')}
        >
          <Select
            options={speakerOptions}
            value={speakerSubjectId}
            onChange={setSpeakerSubjectId}
          />
        </Field>
      )}

      <Field
        label={translate('audio.line.form.order')}
        hint={translate('audio.line.form.order.hint')}
        error={errorFor('order')}
      >
        <Input
          type="number"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
        />
      </Field>

      <Field
        label={translate('audio.line.emotion')}
        error={errorFor('emotion')}
      >
        <Input
          value={emotion}
          onChange={(event) => setEmotion(event.target.value)}
        />
      </Field>

      <Field label={translate('audio.line.pace')} error={errorFor('pace')}>
        <Input value={pace} onChange={(event) => setPace(event.target.value)} />
      </Field>

      <div className="create-dialogue-line-form__pauses">
        <Field
          label={translate('audio.line.form.pauseBeforeMs')}
          error={errorFor('pauseBeforeMs')}
        >
          <Input
            type="number"
            value={pauseBeforeMs}
            onChange={(event) => setPauseBeforeMs(event.target.value)}
          />
        </Field>
        <Field
          label={translate('audio.line.form.pauseAfterMs')}
          error={errorFor('pauseAfterMs')}
        >
          <Input
            type="number"
            value={pauseAfterMs}
            onChange={(event) => setPauseAfterMs(event.target.value)}
          />
        </Field>
      </div>

      {failure === null ? null : (
        <p className="create-dialogue-line-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <div className="create-dialogue-line-form__actions">
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
