import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { publishProjectBibleMutationOptions } from '@/features/bible/api/publish-project-bible.mutation';
import type { BiblePublishProps } from './bible-publish.interface';
import './bible-publish.css';

export const BiblePublish: FC<BiblePublishProps> = ({ projectId, bible }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const publish = useMutation(
    publishProjectBibleMutationOptions(projectId, queryClient),
  );

  const announced = publish.data?.id === bible.id;

  if (bible.published) {
    return announced ? (
      <output
        className="bible-publish__done"
        ref={focusWhenShown}
        tabIndex={-1}
      >
        {translate('bible.publish.done')}
      </output>
    ) : null;
  }

  const errorView = publish.error
    ? resolveRouteErrorView(publish.error)
    : undefined;

  return (
    <section className="bible-publish">
      <p className="bible-publish__explained">
        {translate('bible.publish.explained')}
      </p>

      {errorView === undefined ? null : (
        <div className="bible-publish__refusal" role="alert">
          <ErrorState
            title={translate('bible.publish.error.title')}
            description={composeRouteErrorDescription(errorView, translate)}
            detail={errorView.detail}
            headingLevel={3}
          />
        </div>
      )}

      <Button
        variant="primary"
        size="md"
        disabled={publish.isPending}
        aria-label={translate('bible.publish.context', {
          version: String(bible.version),
        })}
        onClick={() => publish.mutate(bible.id)}
      >
        {translate('bible.publish.action')}
      </Button>
    </section>
  );
};
