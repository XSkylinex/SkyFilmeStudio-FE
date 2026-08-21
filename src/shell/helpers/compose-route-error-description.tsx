import type { ReactNode } from 'react';
import { ContentText } from '@/lib/components/content-text';
import type { Translate } from '@/lib/i18n/interfaces/catalogue';
import type { RouteErrorView } from '@/shell/interfaces/route-error-view';

export const composeRouteErrorDescription = (
  view: RouteErrorView,
  translate: Translate,
): ReactNode => {
  const sentence =
    view.descriptionKey === undefined
      ? undefined
      : translate(view.descriptionKey, view.descriptionValues);

  if (view.descriptionDetail === undefined) {
    return sentence;
  }

  const detail = <ContentText>{view.descriptionDetail}</ContentText>;

  return sentence === undefined ? (
    detail
  ) : (
    <>
      {sentence} ({detail})
    </>
  );
};
