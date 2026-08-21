import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { captureGuideQueryOptions } from '@/features/assets/api/capture-guide.query';
import './capture-guide-panel.css';

export const CaptureGuidePanel: FC = () => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);
  const { data, error, isPending } = useQuery({
    ...captureGuideQueryOptions(),
    enabled: open,
  });
  const errorView = error ? resolveRouteErrorView(error) : undefined;

  return (
    <section className="capture-guide" data-open={open}>
      <div className="capture-guide__headline">
        <h2 className="capture-guide__title">
          {translate('captureGuide.title')}
        </h2>
        <Button
          variant="secondary"
          size="sm"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open
            ? translate('captureGuide.hide')
            : translate('captureGuide.show')}
        </Button>
      </div>
      <p className="capture-guide__intro">{translate('captureGuide.intro')}</p>
      {open ? (
        <div className="capture-guide__body">
          {errorView ? (
            <ErrorState
              title={translate('captureGuide.error.title')}
              description={composeRouteErrorDescription(errorView, translate)}
              detail={errorView.detail}
              headingLevel={3}
            />
          ) : null}
          {isPending && !error ? <Skeleton shape="text" /> : null}
          {data ? (
            <>
              <h3 className="capture-guide__subtitle">
                {translate('captureGuide.views')}
              </h3>
              <ul className="capture-guide__views">
                {data.views.map((view) => (
                  <li key={view.id} className="capture-guide__view">
                    <span className="capture-guide__view-label">
                      <ContentText>{view.label}</ContentText>
                    </span>
                    <span className="capture-guide__view-why">
                      <ContentText>{view.why}</ContentText>
                    </span>
                  </li>
                ))}
              </ul>
              <h3 className="capture-guide__subtitle">
                {translate('captureGuide.advice')}
              </h3>
              <ul className="capture-guide__advice">
                {data.recommendations.map((recommendation) => (
                  <li key={recommendation.id}>
                    <ContentText>{recommendation.advice}</ContentText>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
