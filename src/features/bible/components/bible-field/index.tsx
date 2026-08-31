import type { FC } from 'react';
import { ContentText } from '@/lib/components/content-text';
import { useTranslate } from '@/lib/i18n/use-translate';
import type { BibleFieldProps } from './bible-field.interface';
import './bible-field.css';

export const BibleField: FC<BibleFieldProps> = ({ label, value }) => {
  const translate = useTranslate();

  return (
    <div className="bible-field">
      <dt className="bible-field__label">{label}</dt>
      <dd className="bible-field__value">
        {value === undefined || value === '' ? (
          <span className="bible-field__absent">
            {translate('bible.field.notRecorded')}
          </span>
        ) : (
          <ContentText>{value}</ContentText>
        )}
      </dd>
    </div>
  );
};
