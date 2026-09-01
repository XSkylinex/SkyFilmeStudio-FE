import type { FC } from 'react';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import type { ValidationSummaryProps } from './validation-summary.interface';
import './validation-summary.css';

export const ValidationSummary: FC<ValidationSummaryProps> = ({
  count,
  attempt,
}) => {
  const translate = useTranslate();

  return (
    <output
      key={attempt}
      className="validation-summary"
      ref={focusWhenShown}
      tabIndex={-1}
    >
      {translate('form.invalid', { count: String(count) })}
    </output>
  );
};
