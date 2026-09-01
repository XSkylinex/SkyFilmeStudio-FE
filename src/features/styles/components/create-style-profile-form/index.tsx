import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SUGGESTED_STYLE_MODES,
  createStyleProfileRequestSchema,
} from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Textarea } from '@/lib/components/textarea';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { parseLines } from '@/lib/helpers/parse-lines';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { createStyleProfileMutationOptions } from '@/features/styles/api/create-style-profile.mutation';
import type { CreateStyleProfileFormProps } from './create-style-profile-form.interface';
import './create-style-profile-form.css';

const DESCRIPTION_ROWS = 4;
const RULE_ROWS = 3;

export const CreateStyleProfileForm: FC<CreateStyleProfileFormProps> = ({
  projectId,
  onClose,
  nextVersionOf,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const create = useMutation(
    createStyleProfileMutationOptions(projectId, queryClient),
  );

  const [name, setName] = useState(nextVersionOf?.name ?? '');
  const [description, setDescription] = useState(
    nextVersionOf?.description ?? '',
  );
  const [mode, setMode] = useState(nextVersionOf?.mode ?? '');
  const [realismLevel, setRealismLevel] = useState(
    nextVersionOf?.realismLevel ?? '',
  );
  const [paletteRules, setPaletteRules] = useState(
    (nextVersionOf?.paletteRules ?? []).join('\n'),
  );
  const [lightingRules, setLightingRules] = useState(
    (nextVersionOf?.lightingRules ?? []).join('\n'),
  );
  const [cameraRules, setCameraRules] = useState(
    (nextVersionOf?.cameraRules ?? []).join('\n'),
  );
  const [textureRules, setTextureRules] = useState(
    (nextVersionOf?.textureRules ?? []).join('\n'),
  );
  const [motionRules, setMotionRules] = useState(
    (nextVersionOf?.motionRules ?? []).join('\n'),
  );
  const [prohibitedStyleDrift, setProhibitedStyleDrift] = useState(
    (nextVersionOf?.prohibitedStyleDrift ?? []).join('\n'),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  if (create.isSuccess) {
    return (
      <output
        className="create-style-profile-form__done"
        ref={focusWhenShown}
        tabIndex={-1}
      >
        {translate('library.created')}
      </output>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = createStyleProfileRequestSchema.safeParse({
      name,
      description,
      mode,
      lineageId: nextVersionOf?.lineageId,
      realismLevel: realismLevel === '' ? undefined : realismLevel,
      paletteRules: parseLines(paletteRules),
      lightingRules: parseLines(lightingRules),
      cameraRules: parseLines(cameraRules),
      textureRules: parseLines(textureRules),
      motionRules: parseLines(motionRules),
      prohibitedStyleDrift: parseLines(prohibitedStyleDrift),
    });

    if (!result.success) {
      setFieldErrors(fieldErrorsFromIssues(result.error));
      return;
    }

    setFieldErrors({});
    create.mutate(result.data);
  };

  const failure =
    create.error === null ? null : resolveRouteErrorView(create.error);

  return (
    <section className="create-style-profile-form">
      <h4 className="create-style-profile-form__heading">
        {translate(
          nextVersionOf === undefined
            ? 'styles.create.title'
            : 'library.newVersion.title',
        )}
      </h4>

      {nextVersionOf === undefined ? null : (
        <p className="create-style-profile-form__explain">
          {translate('library.newVersion.explain')}
        </p>
      )}

      <form className="create-style-profile-form__form" onSubmit={handleSubmit}>
        <Field label={translate('library.field.name')} error={errorFor('name')}>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.description')}
          error={errorFor('description')}
        >
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={DESCRIPTION_ROWS}
          />
        </Field>

        <Field
          label={translate('library.field.mode')}
          hint={translate('library.field.mode.hint')}
          error={errorFor('mode')}
        >
          <Input
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          />
        </Field>

        <div className="create-style-profile-form__suggestions">
          {SUGGESTED_STYLE_MODES.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMode(suggestion)}
            >
              <span dir="ltr">{suggestion}</span>
            </Button>
          ))}
        </div>

        <Field
          label={translate('library.field.realismLevel')}
          error={errorFor('realismLevel')}
        >
          <Input
            value={realismLevel}
            onChange={(event) => setRealismLevel(event.target.value)}
          />
        </Field>

        <Field
          label={translate('library.field.paletteRules')}
          hint={translate('library.field.linesHint')}
          error={errorFor('paletteRules')}
        >
          <Textarea
            value={paletteRules}
            onChange={(event) => setPaletteRules(event.target.value)}
            rows={RULE_ROWS}
          />
        </Field>

        <Field
          label={translate('library.field.lightingRules')}
          hint={translate('library.field.linesHint')}
          error={errorFor('lightingRules')}
        >
          <Textarea
            value={lightingRules}
            onChange={(event) => setLightingRules(event.target.value)}
            rows={RULE_ROWS}
          />
        </Field>

        <Field
          label={translate('library.field.cameraRules')}
          hint={translate('library.field.linesHint')}
          error={errorFor('cameraRules')}
        >
          <Textarea
            value={cameraRules}
            onChange={(event) => setCameraRules(event.target.value)}
            rows={RULE_ROWS}
          />
        </Field>

        <Field
          label={translate('library.field.textureRules')}
          hint={translate('library.field.linesHint')}
          error={errorFor('textureRules')}
        >
          <Textarea
            value={textureRules}
            onChange={(event) => setTextureRules(event.target.value)}
            rows={RULE_ROWS}
          />
        </Field>

        <Field
          label={translate('library.field.motionRules')}
          hint={translate('library.field.linesHint')}
          error={errorFor('motionRules')}
        >
          <Textarea
            value={motionRules}
            onChange={(event) => setMotionRules(event.target.value)}
            rows={RULE_ROWS}
          />
        </Field>

        <Field
          label={translate('library.field.prohibitedStyleDrift')}
          hint={translate('library.field.linesHint')}
          error={errorFor('prohibitedStyleDrift')}
        >
          <Textarea
            value={prohibitedStyleDrift}
            onChange={(event) => setProhibitedStyleDrift(event.target.value)}
            rows={RULE_ROWS}
          />
        </Field>

        <div className="create-style-profile-form__actions">
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
        <p className="create-style-profile-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
          {failure.detail === undefined ? null : (
            <span className="create-style-profile-form__refusal-code" dir="ltr">
              {failure.detail}
            </span>
          )}
        </p>
      )}
    </section>
  );
};
