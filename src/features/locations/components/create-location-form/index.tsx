import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLocationRequestSchema } from 'sky-filme-studio-be/contracts';
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
import { createLocationMutationOptions } from '@/features/locations/api/create-location.mutation';
import { parseLines } from '@/lib/helpers/parse-lines';
import type { CreateLocationFormProps } from './create-location-form.interface';
import './create-location-form.css';

export const CreateLocationForm: FC<CreateLocationFormProps> = ({
  projectId,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const create = useMutation(
    createLocationMutationOptions(projectId, queryClient),
  );

  const [name, setName] = useState('');
  const [canonicalDescription, setCanonicalDescription] = useState('');
  const [layoutNotes, setLayoutNotes] = useState('');
  const [immutableFeaturesText, setImmutableFeaturesText] = useState('');
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
      <div className="create-location-form">
        <output
          className="create-location-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
        <div className="create-location-form__actions">
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
      name,
      canonicalDescription,
      layoutNotes,
      immutableFeatures: parseLines(immutableFeaturesText),
    };

    const result = createLocationRequestSchema.safeParse(candidate);

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
    <form className="create-location-form" onSubmit={handleSubmit}>
      {Object.keys(fieldErrors).length === 0 ? null : (
        <ValidationSummary
          count={Object.keys(fieldErrors).length}
          attempt={attempt}
        />
      )}

      <Field
        label={translate('library.field.name')}
        required
        error={errorFor('name')}
      >
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>

      <Field
        label={translate('library.field.description')}

        error={errorFor('canonicalDescription')}
      >
        <Textarea
          value={canonicalDescription}
          onChange={(event) => setCanonicalDescription(event.target.value)}
        />
      </Field>

      <Field
        label={translate('library.field.layoutNotes')}

        error={errorFor('layoutNotes')}
      >
        <Textarea
          value={layoutNotes}
          onChange={(event) => setLayoutNotes(event.target.value)}
        />
      </Field>

      <Field
        label={translate('library.field.immutableFeatures')}
        hint={translate('library.field.linesHint')}
        error={errorFor('immutableFeatures')}
      >
        <Textarea
          value={immutableFeaturesText}
          onChange={(event) => setImmutableFeaturesText(event.target.value)}
        />
      </Field>

      {failure === null ? null : (
        <p className="create-location-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <div className="create-location-form__actions">
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
