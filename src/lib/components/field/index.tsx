import type { FC } from 'react';
import { cloneElement, useId } from 'react';
import type { FieldProps } from './field.interface';
import './field.css';

export const Field: FC<FieldProps> = ({ label, hint, error, id, children }) => {
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
      <label className="field__label" htmlFor={controlId}>
        {label}
      </label>
      <div className="field__control">
        {cloneElement(children, {
          id: controlId,
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : undefined,
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
