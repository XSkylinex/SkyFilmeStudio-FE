import type { UIMatch } from 'react-router-dom';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { isRouteHandle } from './is-route-handle';

export const resolveCurrentRouteTitle = (
  matches: readonly UIMatch[],
): TranslationKey | null => {
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = matches[index];
    if (match && isRouteHandle(match.handle)) {
      return match.handle.titleKey;
    }
  }

  return null;
};
