import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { pronunciationDictionariesQueryOptions } from '@/features/voices/api/pronunciation-dictionaries.query';
import { PronunciationEntries } from '@/features/voices/components/pronunciation-entries';
import type { PronunciationDictionariesProps } from './pronunciation-dictionaries.interface';
import './pronunciation-dictionaries.css';

export const PronunciationDictionaries: FC<PronunciationDictionariesProps> = ({
  projectId,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    pronunciationDictionariesQueryOptions(projectId),
  );

  if (error) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('voices.dictionaries.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={3}
      />
    );
  }

  if (isPending) {
    return <Skeleton shape="rect" />;
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        title={translate('voices.dictionaries.empty.title')}
        description={translate('voices.dictionaries.empty.description')}
        headingLevel={3}
      />
    );
  }

  return (
    <div className="pronunciation-dictionaries">
      <p className="pronunciation-dictionaries__note">
        {translate('voices.dictionaries.editNote')}
      </p>
      <ul className="pronunciation-dictionaries__list">
        {data.items.map((dictionary) => (
          <li
            className="pronunciation-dictionaries__dictionary"
            key={dictionary.id}
          >
            <h4 className="pronunciation-dictionaries__language" dir="ltr">
              {dictionary.language}
            </h4>
            <PronunciationEntries
              projectId={projectId}
              dictionaryId={dictionary.id}
              language={dictionary.language}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
