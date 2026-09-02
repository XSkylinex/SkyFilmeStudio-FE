import type { FC, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { deletePronunciationEntryMutationOptions } from '@/features/voices/api/delete-pronunciation-entry.mutation';
import { pronunciationEntriesQueryOptions } from '@/features/voices/api/pronunciation-entries.query';
import { AddPronunciationEntryForm } from '@/features/voices/components/add-pronunciation-entry-form';
import type { PronunciationEntriesProps } from './pronunciation-entries.interface';
import './pronunciation-entries.css';

export const PronunciationEntries: FC<PronunciationEntriesProps> = ({
  projectId,
  dictionaryId,
  language,
}) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const { data, error, isPending } = useQuery(
    pronunciationEntriesQueryOptions(projectId, dictionaryId),
  );
  const remove = useMutation(
    deletePronunciationEntryMutationOptions(
      projectId,
      dictionaryId,
      queryClient,
    ),
  );

  const removalFailure =
    remove.error === null ? null : resolveRouteErrorView(remove.error);

  const list = (): ReactNode => {
    if (error) {
      return (
        <p className="pronunciation-entries__unread">
          {translate('voices.entries.unreadable')}
        </p>
      );
    }

    if (isPending) {
      return <Skeleton shape="text" />;
    }

    if (data.items.length === 0) {
      return (
        <p className="pronunciation-entries__none">
          {translate('voices.entries.none')}
        </p>
      );
    }

    return (
      <>
        {data.nextCursor === undefined ? null : (
          <p className="pronunciation-entries__truncated">
            {translate('voices.entries.truncated')}
          </p>
        )}
        <ul className="pronunciation-entries">
          {data.items.map((entry) => (
            <li className="pronunciation-entries__entry" key={entry.id}>
              <span className="pronunciation-entries__term">
                <ContentText language={language}>{entry.term}</ContentText>
              </span>
              <span className="pronunciation-entries__normalised">
                {translate('voices.entries.normalisedAs')}{' '}
                <ContentText language={language}>
                  {entry.normalisedTerm}
                </ContentText>
              </span>
              {entry.phonemeOverride === undefined ? null : (
                <span className="pronunciation-entries__phonemes" dir="ltr">
                  {entry.phonemeOverride}
                </span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={translate('voices.entries.removeContext', {
                  term: entry.term,
                })}
                disabled={remove.isPending}
                onClick={() => remove.mutate(entry.id)}
              >
                {translate(
                  remove.isPending && remove.variables === entry.id
                    ? 'voices.entries.removing'
                    : 'voices.entries.remove',
                )}
              </Button>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <>
      {list()}
      {removalFailure === null ? null : (
        <ErrorState
          title={translate('voices.entries.remove.failed.title')}
          description={composeRouteErrorDescription(removalFailure, translate)}
          detail={removalFailure.detail}
          headingLevel={5}
        />
      )}
      <AddPronunciationEntryForm
        projectId={projectId}
        dictionaryId={dictionaryId}
        language={language}
      />
    </>
  );
};
