import { CATALOGUE } from '@/lib/i18n/catalogue';
import { translate } from '@/lib/i18n/helpers/translate';
import type { Translate } from '@/lib/i18n/interfaces/catalogue';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';

export const useTranslate = (): Translate => {
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const catalogue = CATALOGUE[interfaceLanguage];

  return (key, values) => translate(catalogue, key, values);
};
