import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ContentText } from '@/lib/components/content-text';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { pronunciationEntriesQueryOptions } from '@/features/voices/api/pronunciation-entries.query';
import type { PronunciationEntriesProps } from './pronunciation-entries.interface';
import './pronunciation-entries.css';

export const PronunciationEntries: FC<PronunciationEntriesProps> = ({
  projectId,
  dictionaryId,
  language,
}) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    pronunciationEntriesQueryOptions(projectId, dictionaryId),
  );

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
          </li>
        ))}
      </ul>
    </>
  );
};
