import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/lib/components/skeleton';
import { formatDateTime } from '@/lib/format/format-date-time';
import { useTranslate } from '@/lib/i18n/use-translate';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import { productionBibleQueryOptions } from '@/features/planner/api/production-bible.query';
import type { BiblePinProps } from './bible-pin.interface';
import './bible-pin.css';

export const BiblePin: FC<BiblePinProps> = ({ productionId }) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const { data, error, isPending } = useQuery(
    productionBibleQueryOptions(productionId),
  );

  if (error && data === undefined) {
    return (
      <p className="bible-pin__unresolved">
        {translate('planner.summary.bibleUnresolved')}
      </p>
    );
  }

  if (isPending) {
    return <Skeleton shape="text" />;
  }

  return (
    <>
      <dl className="bible-pin">
        <div className="bible-pin__figure">
          <dt>{translate('planner.summary.bibleVersion')}</dt>
          <dd>
            <span className="bible-pin__notation" dir="ltr">
              {data.version}
            </span>
          </dd>
        </div>
        <div className="bible-pin__figure">
          <dt>{translate('planner.summary.biblePublished')}</dt>
          <dd>
            {data.publishedAt === undefined ? (
              translate('planner.summary.bibleUnpublished')
            ) : (
              <span className="bible-pin__notation" dir="ltr">
                {formatDateTime(data.publishedAt, interfaceLanguage)}
              </span>
            )}
          </dd>
        </div>
      </dl>
      <p className="bible-pin__note">
        {translate('planner.summary.biblePinned')}
      </p>
    </>
  );
};
