import type { Translate } from '@/lib/i18n/interfaces/catalogue';
import type { RouteErrorView } from '@/shell/interfaces/route-error-view';

export const composeRouteErrorDescription = (
  view: RouteErrorView,
  translate: Translate,
): string => {
  const sentence =
    view.descriptionKey === undefined
      ? undefined
      : translate(view.descriptionKey, view.descriptionValues);

  if (sentence !== undefined && view.descriptionDetail !== undefined) {
    return `${sentence} (${view.descriptionDetail})`;
  }

  return sentence ?? view.descriptionDetail ?? '';
};
