import type { FC, FormEvent } from 'react';
import { useId, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  narrativeModeSchema,
  productionKindSchema,
  updateProductionRequestSchema,
} from 'sky-filme-studio-be/contracts';
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
import { productionProfilesQueryOptions } from '@/features/productions/api/production-profiles.query';
import { updateProductionMutationOptions } from '@/features/productions/api/update-production.mutation';
import {
  productionEditDiff,
  targetRuntimeSecondsOf,
  unclearableFields,
} from '@/features/productions/helpers/production-edit-diff';
import { productionEditValuesFrom } from '@/features/productions/helpers/production-edit-values';
import type {
  ProductionClearableField,
  ProductionEditValues,
} from '@/features/productions/interfaces/production-edit-values';
import {
  NARRATIVE_MODE_LABEL,
  PRODUCTION_KIND_LABEL,
} from '@/features/productions/productions.constants';
import { styleProfilesQueryOptions } from '@/features/styles/api/style-profiles.query';
import type { EditProductionFormProps } from './edit-production-form.interface';
import './edit-production-form.css';

export const EditProductionForm: FC<EditProductionFormProps> = ({
  projectId,
  production,
  onClose,
}) => {
  const translate = useTranslate();
  const runtimeErrorId = useId();
  const queryClient = useQueryClient();
  const styleProfiles = useQuery(styleProfilesQueryOptions(projectId));
  const productionProfiles = useQuery(
    productionProfilesQueryOptions(projectId),
  );
  const update = useMutation(
    updateProductionMutationOptions(projectId, production.id, queryClient),
  );

  const [values, setValues] = useState<ProductionEditValues>(
    productionEditValuesFrom(production),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);
  const [touchedSinceSave, setTouchedSinceSave] = useState(false);

  const set = <K extends keyof ProductionEditValues>(
    field: K,
    value: ProductionEditValues[K],
  ): void => {
    setTouchedSinceSave(true);
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const baseline = update.data ?? production;
  const patch = productionEditDiff(baseline, values);
  const unclearable = unclearableFields(baseline, values);
  const hasChanges = Object.keys(patch).length > 0;
  const justSaved = update.isSuccess && !hasChanges && !touchedSinceSave;
  const previewSeconds = targetRuntimeSecondsOf(values);
  const runtimeError = errorFor('targetRuntimeSeconds');

  const clearHint = (
    field: ProductionClearableField,
    hint: TranslationKey,
  ): string =>
    translate(
      unclearable.includes(field) ? 'productions.edit.cannotClear' : hint,
    );

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = updateProductionRequestSchema.safeParse(patch);

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

  const styleProfileOptions = (styleProfiles.data?.items ?? []).map(
    (profile) => ({
      value: profile.id,
      label: `${profile.name} ${translate('productions.create.styleProfile.version', { version: profile.version })}`,
    }),
  );
  const styleProfileListed = styleProfileOptions.some(
    (option) => option.value === values.styleProfileId,
  );

  const productionProfileOptions = [
    {
      value: '',
      label: translate('productions.create.productionProfile.none'),
    },
    ...(productionProfiles.data?.items ?? []).map((profile) => ({
      value: profile.id,
      label: profile.name,
    })),
  ];

  return (
    <form className="edit-production-form" onSubmit={handleSubmit}>
      {Object.keys(fieldErrors).length === 0 ? null : (
        <ValidationSummary
          count={invalidFieldCount(fieldErrors)}
          attempt={attempt}
        />
      )}

      <p className="edit-production-form__note">
        {translate('productions.edit.explain')}
      </p>

      <Field
        label={translate('productions.create.title')}
        hint={translate('productions.create.title.hint')}
        required
        error={errorFor('title')}
      >
        <Input
          value={values.title}
          onChange={(event) => set('title', event.target.value)}
        />
      </Field>

      <Field
        label={translate('productions.kind.label')}
        hint={translate('productions.edit.modeChange')}
        error={errorFor('productionKind')}
      >
        <Select
          options={productionKindSchema.options.map((kind) => ({
            value: kind,
            label: translate(PRODUCTION_KIND_LABEL[kind]),
          }))}
          value={values.productionKind}
          onChange={(value) =>
            set('productionKind', productionKindSchema.parse(value))
          }
        />
      </Field>

      <Field
        label={translate('productions.mode.label')}
        hint={translate('productions.edit.modeChange')}
        error={errorFor('narrativeMode')}
      >
        <Select
          options={narrativeModeSchema.options.map((mode) => ({
            value: mode,
            label: translate(NARRATIVE_MODE_LABEL[mode]),
          }))}
          value={values.narrativeMode}
          onChange={(value) =>
            set('narrativeMode', narrativeModeSchema.parse(value))
          }
        />
      </Field>

      <fieldset className="edit-production-form__runtime">
        <legend className="edit-production-form__runtime-legend">
          {translate('productions.create.targetRuntime')}
        </legend>
        <div className="edit-production-form__runtime-fields">
          <Field label={translate('productions.create.targetRuntime.minutes')}>
            <Input
              type="number"
              value={values.minutes}
              onChange={(event) => set('minutes', event.target.value)}
              aria-describedby={runtimeErrorId}
              aria-invalid={runtimeError === '' ? undefined : true}
            />
          </Field>
          <Field label={translate('productions.create.targetRuntime.seconds')}>
            <Input
              type="number"
              value={values.seconds}
              onChange={(event) => set('seconds', event.target.value)}
              aria-describedby={runtimeErrorId}
              aria-invalid={runtimeError === '' ? undefined : true}
            />
          </Field>
        </div>
        <p className="edit-production-form__runtime-preview">
          {translate('productions.create.targetRuntime.preview')}{' '}
          <span dir="ltr">{formatDuration(previewSeconds)}</span>
        </p>
        {runtimeError === '' ? null : (
          <p
            className="edit-production-form__runtime-error"
            id={runtimeErrorId}
          >
            {runtimeError}
          </p>
        )}
      </fieldset>

      <Field
        label={translate('productions.create.tolerance')}
        hint={clearHint('tolerance', 'productions.create.tolerance.hint')}
        error={errorFor('runtimeToleranceSeconds')}
      >
        <Input
          type="number"
          value={values.tolerance}
          onChange={(event) => set('tolerance', event.target.value)}
        />
      </Field>

      {styleProfileListed ? (
        <Field
          label={translate('productions.create.styleProfile')}
          hint={translate('planner.summary.stylePinned')}
          error={errorFor('styleProfileId')}
        >
          <Select
            options={styleProfileOptions}
            value={values.styleProfileId}
            onChange={(value) => set('styleProfileId', value)}
          />
        </Field>
      ) : null}

      <Field
        label={translate('productions.create.productionProfile')}
        hint={clearHint(
          'productionProfileId',
          'productions.create.productionProfile.hint',
        )}
        error={errorFor('productionProfileId')}
      >
        <Select
          options={productionProfileOptions}
          value={values.productionProfileId}
          onChange={(value) => set('productionProfileId', value)}
        />
      </Field>

      <Field
        label={translate('productions.create.sequenceNumber')}
        hint={clearHint(
          'sequenceNumber',
          'productions.create.sequenceNumber.hint',
        )}
        error={errorFor('sequenceNumber')}
      >
        <Input
          type="number"
          value={values.sequenceNumber}
          onChange={(event) => set('sequenceNumber', event.target.value)}
        />
      </Field>

      <Field
        label={translate('productions.create.logline')}
        hint={clearHint('logline', 'productions.create.logline.hint')}
        error={errorFor('logline')}
      >
        <Input
          value={values.logline}
          onChange={(event) => set('logline', event.target.value)}
        />
      </Field>

      <Field
        label={translate('productions.create.brief')}
        hint={clearHint('brief', 'productions.create.brief.hint')}
        error={errorFor('brief')}
      >
        <Textarea
          value={values.brief}
          onChange={(event) => set('brief', event.target.value)}
        />
      </Field>

      {justSaved ? (
        <output
          className="edit-production-form__done"
          ref={focusWhenShown}
          tabIndex={-1}
        >
          {translate('library.saved')}
        </output>
      ) : null}

      {failure === null ? null : (
        <ErrorState
          title={translate('productions.edit.failed.title')}
          description={composeRouteErrorDescription(failure, translate)}
          detail={failure.detail}
          headingLevel={4}
        />
      )}

      <div className="edit-production-form__actions">
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
