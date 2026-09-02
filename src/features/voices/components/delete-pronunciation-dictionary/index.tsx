import type { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { deletePronunciationDictionaryMutationOptions } from '@/features/voices/api/delete-pronunciation-dictionary.mutation';
import { pronunciationEntriesQueryOptions } from '@/features/voices/api/pronunciation-entries.query';
import type { DeletePronunciationDictionaryProps } from './delete-pronunciation-dictionary.interface';
import './delete-pronunciation-dictionary.css';

export const DeletePronunciationDictionary: FC<
  DeletePronunciationDictionaryProps
> = ({ projectId, dictionaryId, language }) => {
  const translate = useTranslate();
  const queryClient = useQueryClient();
  const entries = useQuery(
    pronunciationEntriesQueryOptions(projectId, dictionaryId),
  );
  const remove = useMutation(
    deletePronunciationDictionaryMutationOptions(projectId, queryClient),
  );

  const failure = remove.error === null ? null : resolveRouteErrorView(remove.error);

  if (entries.error && entries.data === undefined) {
    return (
      <p className="delete-pronunciation-dictionary__held">
        {translate('voices.dictionaries.remove.unknown')}
      </p>
    );
  }

  if (entries.data === undefined) {
    return null;
  }

  if (entries.data.items.length > 0) {
    return (
      <p className="delete-pronunciation-dictionary__held">
        {translate('voices.dictionaries.remove.held')}
      </p>
    );
  }

  return (
    <div className="delete-pronunciation-dictionary">
      {failure === null ? null : (
        <ErrorState
          title={translate('voices.dictionaries.remove.failed.title')}
          description={composeRouteErrorDescription(failure, translate)}
          detail={failure.detail}
          headingLevel={5}
        />
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={`${translate('voices.dictionaries.remove')} ${translate(
          'voices.dictionaries.removeContext',
          { language },
        )}`}
        disabled={remove.isPending}
        onClick={() => remove.mutate(dictionaryId)}
      >
        {translate(
          remove.isPending
            ? 'voices.dictionaries.removing'
            : 'voices.dictionaries.remove',
        )}
      </Button>
    </div>
  );
};
