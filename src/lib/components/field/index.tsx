import type { FC } from 'react';
import { cloneElement, useId } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import type { FieldProps } from './field.interface';
import './field.css';

export const Field: FC<FieldProps> = ({
  label,
  hint,
  error,
  required,
  id,
  children,
}) => {
  const translate = useTranslate();
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [children.props['aria-describedby'], hintId, errorId]
      .filter((value) => value !== undefined)
      .join(' ') || undefined;

  return (
    <div className="field">
      <div className="field__heading">
        <label className="field__label" htmlFor={controlId}>
          {label}
        </label>
        {required ? (
          <span className="field__required" aria-hidden="true">
            {translate('field.required')}
          </span>
        ) : null}
      </div>
      <div className="field__control">
        {cloneElement(children, {
          id: controlId,
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : children.props['aria-invalid'],
          'aria-required': required ? true : children.props['aria-required'],
        })}
      </div>
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
};
