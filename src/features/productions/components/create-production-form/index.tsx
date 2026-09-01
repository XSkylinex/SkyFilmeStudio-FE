import type { FC, FormEvent, ReactNode } from 'react';
import { useId, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  NARRATIVE_MODE,
  PRODUCTION_KIND,
  createProductionRequestSchema,
  narrativeModeSchema,
  productionKindSchema,
} from 'sky-filme-studio-be/contracts';
import type {
  NarrativeMode,
  ProductionKind,
} from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Select } from '@/lib/components/select';
import { Skeleton } from '@/lib/components/skeleton';
import { Textarea } from '@/lib/components/textarea';
import { formatDuration } from '@/lib/format/format-duration';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { createProductionMutationOptions } from '@/features/productions/api/create-production.mutation';
import { productionProfilesQueryOptions } from '@/features/productions/api/production-profiles.query';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import {
  NARRATIVE_MODE_LABEL,
  PRODUCTION_KIND_LABEL,
} from '@/features/productions/productions.constants';
import { styleProfilesQueryOptions } from '@/features/styles/api/style-profiles.query';
import type { CreateProductionFormProps } from './create-production-form.interface';
import './create-production-form.css';

const SECONDS_PER_MINUTE = 60;

export const CreateProductionForm: FC<CreateProductionFormProps> = ({
  projectId,
  onClose,
}) => {
  const translate = useTranslate();
  const runtimeErrorId = useId();
  const queryClient = useQueryClient();
  const styleProfiles = useQuery(styleProfilesQueryOptions(projectId));
  const productionProfiles = useQuery(
    productionProfilesQueryOptions(projectId),
  );
  const create = useMutation(
    createProductionMutationOptions(projectId, queryClient),
  );

  const [title, setTitle] = useState('');
  const [productionKind, setProductionKind] = useState<ProductionKind>(
    PRODUCTION_KIND.EPISODE,
  );
  const [narrativeMode, setNarrativeMode] = useState<NarrativeMode>(
    NARRATIVE_MODE.SCREENPLAY,
  );
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [tolerance, setTolerance] = useState('');
  const [styleProfileId, setStyleProfileId] = useState('');
  const [productionProfileId, setProductionProfileId] = useState('');
  const [sequenceNumber, setSequenceNumber] = useState('');
  const [logline, setLogline] = useState('');
  const [brief, setBrief] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const resolveBody = (): ReactNode => {
    if (styleProfiles.error && styleProfiles.data === undefined) {
      const view = resolveRouteErrorView(styleProfiles.error);

      return (
        <ErrorState
          title={translate('styles.error.title')}
          description={composeRouteErrorDescription(view, translate)}
          detail={view.detail}
          headingLevel={4}
        />
      );
    }

    if (styleProfiles.isPending) {
      return <Skeleton shape="rect" />;
    }

    const firstStyleProfile = styleProfiles.data.items[0];

    if (firstStyleProfile === undefined) {
      return (
        <EmptyState
          title={translate('productions.create.blocked.title')}
          description={translate('productions.create.blocked.description')}
          headingLevel={4}
        />
      );
    }

    const runtimeError = errorFor('targetRuntimeSeconds');
    const resolvedStyleProfileId = styleProfileId || firstStyleProfile.id;
    const minutesValue = minutes === '' ? 0 : Number(minutes);
    const secondsValue = seconds === '' ? 0 : Number(seconds);
    const previewSeconds = minutesValue * SECONDS_PER_MINUTE + secondsValue;

    const styleProfileOptions = styleProfiles.data.items.map((profile) => ({
      value: profile.id,
      label: `${profile.name} ${translate('productions.create.styleProfile.version', { version: profile.version })}`,
    }));

    const productionProfileItems = productionProfiles.data?.items ?? [];
    const productionProfileOptions = [
      {
        value: '',
        label: translate('productions.create.productionProfile.none'),
      },
      ...productionProfileItems.map((profile) => ({
        value: profile.id,
        label: profile.name,
      })),
    ];

    const productionKindOptions = productionKindSchema.options.map((kind) => ({
      value: kind,
      label: translate(PRODUCTION_KIND_LABEL[kind]),
    }));

    const narrativeModeOptions = narrativeModeSchema.options.map((mode) => ({
      value: mode,
      label: translate(NARRATIVE_MODE_LABEL[mode]),
    }));

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      const candidate = {
        title,
        productionKind,
        narrativeMode,
        targetRuntimeSeconds: previewSeconds,
        runtimeToleranceSeconds:
          tolerance === '' ? undefined : Number(tolerance),
        productionProfileId:
          productionProfileId === '' ? undefined : productionProfileId,
        styleProfileId: resolvedStyleProfileId,
        sequenceNumber:
          sequenceNumber === '' ? undefined : Number(sequenceNumber),
        logline: logline === '' ? undefined : logline,
        brief: brief === '' ? undefined : brief,
      };

      const result = createProductionRequestSchema.safeParse(candidate);

      if (!result.success) {
        setFieldErrors(fieldErrorsFromIssues(result.error));
        return;
      }

      setFieldErrors({});
      create.mutate(result.data, { onSuccess: onClose });
    };

    const failure =
      create.error === null ? null : resolveRouteErrorView(create.error);
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;

    return (
      <>
        <form className="create-production-form__form" onSubmit={handleSubmit}>
          {hasFieldErrors ? (
            <p className="create-production-form__invalid">
              {translate('productions.create.invalid')}
            </p>
          ) : null}

          <Field
            label={translate('productions.create.title')}
            hint={translate('productions.create.title.hint')}
            error={errorFor('title')}
          >
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>

          <Field
            label={translate('productions.kind.label')}
            error={errorFor('productionKind')}
          >
            <Select
              options={productionKindOptions}
              value={productionKind}
              onChange={(value) =>
                setProductionKind(productionKindSchema.parse(value))
              }
            />
          </Field>

          <Field
            label={translate('productions.mode.label')}
            error={errorFor('narrativeMode')}
          >
            <Select
              options={narrativeModeOptions}
              value={narrativeMode}
              onChange={(value) =>
                setNarrativeMode(narrativeModeSchema.parse(value))
              }
            />
          </Field>

          <fieldset className="create-production-form__runtime">
            <legend className="create-production-form__runtime-legend">
              {translate('productions.create.targetRuntime')}
            </legend>
            <p className="create-production-form__runtime-hint">
              {translate('productions.create.targetRuntime.hint')}
            </p>
            <div className="create-production-form__runtime-fields">
              <Field
                label={translate('productions.create.targetRuntime.minutes')}
              >
                <Input
                  type="number"
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  aria-describedby={runtimeErrorId}
                  aria-invalid={runtimeError === '' ? undefined : true}
                />
              </Field>
              <Field
                label={translate('productions.create.targetRuntime.seconds')}
              >
                <Input
                  type="number"
                  value={seconds}
                  onChange={(event) => setSeconds(event.target.value)}
                  aria-describedby={runtimeErrorId}
                  aria-invalid={runtimeError === '' ? undefined : true}
                />
              </Field>
            </div>
            <p className="create-production-form__runtime-preview">
              {translate('productions.create.targetRuntime.preview')}{' '}
              <span dir="ltr">{formatDuration(previewSeconds)}</span>
            </p>
            {runtimeError === '' ? null : (
              <p
                className="create-production-form__runtime-error"
                id={runtimeErrorId}
              >
                {runtimeError}
              </p>
            )}
          </fieldset>

          <Field
            label={translate('productions.create.tolerance')}
            hint={translate('productions.create.tolerance.hint')}
            error={errorFor('runtimeToleranceSeconds')}
          >
            <Input
              type="number"
              value={tolerance}
              onChange={(event) => setTolerance(event.target.value)}
            />
          </Field>

          <Field
            label={translate('productions.create.styleProfile')}
            hint={translate('productions.create.styleProfile.hint')}
            error={errorFor('styleProfileId')}
          >
            <Select
              options={styleProfileOptions}
              value={resolvedStyleProfileId}
              onChange={setStyleProfileId}
            />
          </Field>

          <Field
            label={translate('productions.create.productionProfile')}
            hint={translate('productions.create.productionProfile.hint')}
            error={errorFor('productionProfileId')}
          >
            <Select
              options={productionProfileOptions}
              value={productionProfileId}
              onChange={setProductionProfileId}
            />
          </Field>

          <Field
            label={translate('productions.create.sequenceNumber')}
            hint={translate('productions.create.sequenceNumber.hint')}
            error={errorFor('sequenceNumber')}
          >
            <Input
              type="number"
              value={sequenceNumber}
              onChange={(event) => setSequenceNumber(event.target.value)}
            />
          </Field>

          <Field
            label={translate('productions.create.logline')}
            hint={translate('productions.create.logline.hint')}
            error={errorFor('logline')}
          >
            <Input
              value={logline}
              onChange={(event) => setLogline(event.target.value)}
            />
          </Field>

          <Field
            label={translate('productions.create.brief')}
            hint={translate('productions.create.brief.hint')}
            error={errorFor('brief')}
          >
            <Textarea
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
            />
          </Field>

          <div className="create-production-form__actions">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={create.isPending}
            >
              {translate(
                create.isPending
                  ? 'productions.create.submitting'
                  : 'productions.create.submit',
              )}
            </Button>
          </div>
        </form>

        {failure === null ? null : (
          <ErrorState
            title={translate('productions.create.failed.title')}
            description={composeRouteErrorDescription(failure, translate)}
            detail={failure.detail}
            headingLevel={4}
          />
        )}
      </>
    );
  };

  return (
    <section className="create-production-form">
      <div className="create-production-form__header">
        <h3 className="create-production-form__heading">
          {translate('productions.create.heading')}
        </h3>
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          {translate('productions.create.cancel')}
        </Button>
      </div>
      {resolveBody()}
    </section>
  );
};
