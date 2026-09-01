import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLocationRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Textarea } from '@/lib/components/textarea';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { updateLocationMutationOptions } from '@/features/locations/api/update-location.mutation';
import { locationEditDiff } from '@/features/locations/helpers/location-edit-diff';
import { parseLines } from '@/lib/helpers/parse-lines';
import type { EditLocationFormProps } from './edit-location-form.interface';
import './edit-location-form.css';

export const EditLocationForm: FC<EditLocationFormProps> = ({
  projectId,
  location,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const update = useMutation(
    updateLocationMutationOptions(projectId, location.id, queryClient),
  );

  const [name, setName] = useState(location.name);
  const [canonicalDescription, setCanonicalDescription] = useState(
    location.canonicalDescription,
  );
  const [layoutNotes, setLayoutNotes] = useState(location.layoutNotes);
  const [immutableFeaturesText, setImmutableFeaturesText] = useState(
    location.immutableFeatures.join('\n'),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const baseline = update.data ?? location;
  const patch = locationEditDiff(baseline, {
    name,
    canonicalDescription,
    layoutNotes,
    immutableFeatures: parseLines(immutableFeaturesText),
  });
  const hasChanges = Object.keys(patch).length > 0;
  const justSaved = update.isSuccess && !hasChanges;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!hasChanges) {
      return;
    }

    const result = updateLocationRequestSchema.safeParse(patch);

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      return;
    }

    setFieldErrors({});
    update.mutate(result.data);
  };

  const failure =
    update.error === null ? null : resolveRouteErrorView(update.error);

  return (
    <form className="edit-location-form" onSubmit={handleSubmit}>
      <Field label={translate('library.field.name')} error={errorFor('name')}>
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

      {justSaved ? (
        <output
          className="edit-location-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.saved')}
        </output>
      ) : null}

      {failure === null ? null : (
        <p className="edit-location-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
        </p>
      )}

      <div className="edit-location-form__actions">
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
