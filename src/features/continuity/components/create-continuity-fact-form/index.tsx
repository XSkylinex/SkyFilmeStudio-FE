import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContinuityFactRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { createContinuityFactMutationOptions } from '@/features/continuity/api/create-continuity-fact.mutation';
import { orderedScenes } from '@/features/continuity/helpers/ordered-scenes';
import type { CreateContinuityFactFormProps } from './create-continuity-fact-form.interface';
import './create-continuity-fact-form.css';

export const CreateContinuityFactForm: FC<CreateContinuityFactFormProps> = ({
  productionId,
  scenes,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const create = useMutation(
    createContinuityFactMutationOptions(productionId, queryClient),
  );

  const [entityId, setEntityId] = useState('');
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [sourceEvent, setSourceEvent] = useState('');
  const [scopeStartScene, setScopeStartScene] = useState('');
  const [scopeEndScene, setScopeEndScene] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const available = orderedScenes(scenes);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = createContinuityFactRequestSchema.safeParse({
      entityId: entityId.trim(),
      property: property.trim(),
      value: value.trim(),
      sourceEvent: sourceEvent.trim(),
      scopeStartScene,
      ...(scopeEndScene === '' ? {} : { scopeEndScene }),
    });

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      setAttempt((count) => count + 1);
      return;
    }

    setFieldErrors({});
    create.mutate(result.data);
  };

  const failure = create.error === null ? null : resolveRouteErrorView(create.error);

  const sceneOptions = available.map((scene) => ({
    value: scene.id,
    label: translate('continuity.context.sceneOption', {
      order: String(scene.order),
    }),
  }));

  return (
    <section className="create-continuity-fact-form">
      <div className="create-continuity-fact-form__header">
        <h3 className="create-continuity-fact-form__heading">
          {translate('continuity.create.heading')}
        </h3>
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('library.cancel')}
        </Button>
      </div>

      {create.isSuccess ? (
        <output
          className="create-continuity-fact-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.created')}
        </output>
      ) : (
        <form
          className="create-continuity-fact-form__form"
          onSubmit={handleSubmit}
        >
          {Object.keys(fieldErrors).length === 0 ? null : (
            <ValidationSummary
              count={invalidFieldCount(fieldErrors)}
              attempt={attempt}
            />
          )}

          <Field
            label={translate('continuity.create.entity')}
            hint={translate('continuity.create.entity.hint')}
            required
            error={errorFor('entityId')}
          >
            <Input
              value={entityId}
              onChange={(event) => setEntityId(event.target.value)}
            />
          </Field>

          <Field
            label={translate('continuity.create.property')}
            hint={translate('continuity.create.property.hint')}
            required
            error={errorFor('property')}
          >
            <Input
              value={property}
              onChange={(event) => setProperty(event.target.value)}
            />
          </Field>

          <Field
            label={translate('continuity.create.value')}
            required
            error={errorFor('value')}
          >
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>

          <Field
            label={translate('continuity.create.source')}
            hint={translate('continuity.create.source.hint')}
            required
            error={errorFor('sourceEvent')}
          >
            <Input
              value={sourceEvent}
              onChange={(event) => setSourceEvent(event.target.value)}
            />
          </Field>

          <Field
            label={translate('continuity.create.start')}
            required
            error={errorFor('scopeStartScene')}
          >
            <Select
              options={[
                { value: '', label: translate('continuity.context.choose') },
                ...sceneOptions,
              ]}
              value={scopeStartScene}
              onChange={setScopeStartScene}
            />
          </Field>

          <Field
            label={translate('continuity.create.end')}
            hint={translate('continuity.create.end.hint')}
            error={errorFor('scopeEndScene')}
          >
            <Select
              options={[
                { value: '', label: translate('continuity.create.end.open') },
                ...sceneOptions,
              ]}
              value={scopeEndScene}
              onChange={setScopeEndScene}
            />
          </Field>

          {failure === null ? null : (
            <ErrorState
              title={translate('continuity.create.failed.title')}
              description={composeRouteErrorDescription(failure, translate)}
              detail={failure.detail}
              headingLevel={4}
            />
          )}

          <Button type="submit" variant="primary" size="md" disabled={create.isPending}>
            {translate(
              create.isPending
                ? 'continuity.create.saving'
                : 'continuity.create.submit',
            )}
          </Button>
        </form>
      )}
    </section>
  );
};
