import type { FC } from 'react';
import { Field } from '@/lib/components/field';
import { Select } from '@/lib/components/select';
import { INTERFACE_LANGUAGE } from '@/lib/i18n/i18n.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import type { InterfaceLanguage } from '@/lib/i18n/interfaces/interface-language';
import {
  interfaceLanguageSet,
  selectInterfaceLanguage,
} from '@/shell/shell.slice';
import { useAppDispatch, useAppSelector } from '@/shell/store/hooks';
import './interface-language-select.css';

export const InterfaceLanguageSelect: FC = () => {
  const translate = useTranslate();
  const dispatch = useAppDispatch();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);

  return (
    <div className="interface-language-select">
      <Field label={translate('language.label')}>
        <Select
          value={interfaceLanguage}
          options={[
            { value: INTERFACE_LANGUAGE.EN, label: translate('language.en') },
            { value: INTERFACE_LANGUAGE.HE, label: translate('language.he') },
          ]}
          onChange={(value) =>
            dispatch(interfaceLanguageSet(value as InterfaceLanguage))
          }
        />
      </Field>
    </div>
  );
};
