import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { projectBibleMarkdownQueryOptions } from '@/features/bible/api/project-bible-markdown.query';
import { BibleMarkdownView } from '@/features/bible/components/bible-markdown-view';
import type { BibleMarkdownPanelProps } from './bible-markdown-panel.interface';
import './bible-markdown-panel.css';

export const BibleMarkdownPanel: FC<BibleMarkdownPanelProps> = ({
  projectId,
  bibleId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    projectBibleMarkdownQueryOptions(projectId, bibleId),
  );

  if (error) {
    const errorView = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('bible.markdown.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
        headingLevel={2}
      />
    );
  }

  return (
    <section className="bible-markdown-panel">
      <h2 className="bible-markdown-panel__title">
        {translate('bible.markdown.title')}
      </h2>
      <p className="bible-markdown-panel__source">
        {translate('bible.markdown.source')}
      </p>
      {isPending ? (
        <Skeleton shape="rect" />
      ) : (
        <BibleMarkdownView
          markdown={data}
          label={translate('bible.markdown.title')}
        />
      )}
    </section>
  );
};
