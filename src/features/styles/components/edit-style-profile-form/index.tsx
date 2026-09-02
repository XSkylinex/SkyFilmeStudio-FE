import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStyleProfileRequestSchema } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Field } from '@/lib/components/field';
import { Input } from '@/lib/components/input';
import { Textarea } from '@/lib/components/textarea';
import { ValidationSummary } from '@/lib/components/validation-summary';
import { fieldErrorsFromIssues } from '@/lib/helpers/field-errors-from-issues';
import { invalidFieldCount } from '@/lib/helpers/invalid-field-count';
import { diffNullableText } from '@/lib/helpers/diff-nullable-text';
import { parseLines } from '@/lib/helpers/parse-lines';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { updateStyleProfileMutationOptions } from '@/features/styles/api/update-style-profile.mutation';
import type { EditStyleProfileFormProps } from './edit-style-profile-form.interface';
import './edit-style-profile-form.css';

const DESCRIPTION_ROWS = 4;
const RULE_ROWS = 3;

const linesChange = (next: string, original: string): string[] | undefined =>
  next === original ? undefined : parseLines(next);

export const EditStyleProfileForm: FC<EditStyleProfileFormProps> = ({
  projectId,
  lineageId,
  styleProfile,
  onClose,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const update = useMutation(
    updateStyleProfileMutationOptions(
      projectId,
      lineageId,
      styleProfile.id,
      queryClient,
    ),
  );

  const [name, setName] = useState(styleProfile.name);
  const [description, setDescription] = useState(styleProfile.description);
  const [mode, setMode] = useState<string>(styleProfile.mode);
  const originalRealismLevel = styleProfile.realismLevel ?? '';
  const originalPalette = styleProfile.paletteRules.join('\n');
  const originalLighting = styleProfile.lightingRules.join('\n');
  const originalCamera = styleProfile.cameraRules.join('\n');
  const originalTexture = styleProfile.textureRules.join('\n');
  const originalMotion = styleProfile.motionRules.join('\n');
  const originalDrift = styleProfile.prohibitedStyleDrift.join('\n');
  const [realismLevel, setRealismLevel] = useState(originalRealismLevel);
  const [paletteRules, setPaletteRules] = useState(originalPalette);
  const [lightingRules, setLightingRules] = useState(originalLighting);
  const [cameraRules, setCameraRules] = useState(originalCamera);
  const [textureRules, setTextureRules] = useState(originalTexture);
  const [motionRules, setMotionRules] = useState(originalMotion);
  const [prohibitedStyleDrift, setProhibitedStyleDrift] =
    useState(originalDrift);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, TranslationKey>
  >({});
  const [attempt, setAttempt] = useState(0);

  const errorFor = (field: string): string => {
    const key = fieldErrors[field];

    return key === undefined ? '' : translate(key);
  };

  const baseline = update.data ?? styleProfile;
  const patch = {
    name: name === baseline.name ? undefined : name,
    description: description === baseline.description ? undefined : description,
    mode: mode === baseline.mode ? undefined : mode,
    realismLevel: diffNullableText(realismLevel, baseline.realismLevel),
    paletteRules: linesChange(paletteRules, baseline.paletteRules.join('\n')),
    lightingRules: linesChange(
      lightingRules,
      baseline.lightingRules.join('\n'),
    ),
    cameraRules: linesChange(cameraRules, baseline.cameraRules.join('\n')),
    textureRules: linesChange(textureRules, baseline.textureRules.join('\n')),
    motionRules: linesChange(motionRules, baseline.motionRules.join('\n')),
    prohibitedStyleDrift: linesChange(
      prohibitedStyleDrift,
      baseline.prohibitedStyleDrift.join('\n'),
    ),
  };
  const hasChanges = Object.values(patch).some((value) => value !== undefined);
  const justSaved = update.isSuccess && !hasChanges;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = updateStyleProfileRequestSchema.safeParse(patch);

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
    <section className="edit-style-profile-form">
      <form className="edit-style-profile-form__form" onSubmit={handleSubmit}>
        {Object.keys(fieldErrors).length === 0 ? null : (
          <ValidationSummary
            count={invalidFieldCount(fieldErrors)}
            attempt={attempt}
          />
        )}

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

        {justSaved ? (
          <output
            className="edit-style-profile-form__done"
            ref={focusWhenShown}
            tabIndex={-1}
          >
            {translate('library.saved')}
          </output>
        ) : null}

        <div className="edit-style-profile-form__actions">
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
        <p className="edit-style-profile-form__refusal" role="alert">
          {composeRouteErrorDescription(failure, translate)}
          {failure.detail === undefined ? null : (
            <span className="edit-style-profile-form__refusal-code" dir="ltr">
              {failure.detail}
            </span>
          )}
        </p>
      )}
    </section>
  );
};
