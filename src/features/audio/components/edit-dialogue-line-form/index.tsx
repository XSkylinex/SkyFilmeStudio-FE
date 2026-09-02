import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDialogueLineRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { updateDialogueLineMutationOptions } from '@/features/audio/api/update-dialogue-line.mutation';
import { dialogueLineEditDiff } from '@/features/audio/helpers/dialogue-line-edit-diff';
import type { EditDialogueLineFormProps } from './edit-dialogue-line-form.interface';
import './edit-dialogue-line-form.css';

const toWholeNumber = (value: string): number =>
  value === '' ? 0 : Number(value);

export const EditDialogueLineForm: FC<EditDialogueLineFormProps> = ({
  line,
  sceneId,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const update = useMutation(
    updateDialogueLineMutationOptions(line.id, sceneId, queryClient),
  );

  const [text, setText] = useState(line.text);
  const [emotion, setEmotion] = useState(line.emotion);
  const [pace, setPace] = useState(line.pace);
  const [pauseBeforeMs, setPauseBeforeMs] = useState(
    String(line.pauseBeforeMs),
  );
  const [pauseAfterMs, setPauseAfterMs] = useState(String(line.pauseAfterMs));
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const patch = dialogueLineEditDiff(line, {
    text,
    emotion,
    pace,
    pauseBeforeMs: toWholeNumber(pauseBeforeMs),
    pauseAfterMs: toWholeNumber(pauseAfterMs),
  });
  const untouched = Object.keys(patch).length === 0;

  if (update.isSuccess) {
    return (
      <div className="edit-dialogue-line-form">
        <output
          className="edit-dialogue-line-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('audio.line.saved')}
        </output>
        <div className="edit-dialogue-line-form__actions">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            {translate('library.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = updateDialogueLineRequestSchema.safeParse(patch);

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
    <form className="edit-dialogue-line-form" onSubmit={handleSubmit}>
      {Object.keys(fieldErrors).length === 0 ? null : (
        <ValidationSummary
          count={invalidFieldCount(fieldErrors)}
          attempt={attempt}
        />
      )}

      <p className="edit-dialogue-line-form__note">
        {translate('audio.line.form.frozen')}
      </p>

      <Field label={translate('audio.line.form.text')} error={errorFor('text')}>
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
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

      <div className="edit-dialogue-line-form__pauses">
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
        <p className="edit-dialogue-line-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <div className="edit-dialogue-line-form__actions">
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={update.isPending || untouched}
        >
          {translate(update.isPending ? 'library.saving' : 'library.save')}
        </Button>
      </div>
    </form>
  );
};
