import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ContentText } from '@/lib/components/content-text';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { styleProfileQueryOptions } from '@/features/styles/api/style-profile.query';
import type { StylePinProps } from './style-pin.interface';
import './style-pin.css';

export const StylePin: FC<StylePinProps> = ({ projectId, styleProfileId }) => {
  const translate = useTranslate();
  const { data, error } = useQuery(
    styleProfileQueryOptions(projectId, styleProfileId),
  );

  if (error && data === undefined) {
    return (
      <p className="style-pin__unresolved">
        {translate('planner.summary.styleUnresolved')}
      </p>
    );
  }

  if (data === undefined) {
    return <Skeleton shape="text" />;
  }

  return (
    <>
      <dl className="style-pin">
        <div className="style-pin__figure">
          <dt>{translate('planner.summary.styleProfile')}</dt>
          <dd>
            <ContentText>{data.name}</ContentText>
          </dd>
        </div>
        <div className="style-pin__figure">
          <dt>{translate('planner.summary.styleVersion')}</dt>
          <dd>
            <span className="style-pin__notation" dir="ltr">
              {data.version}
            </span>
          </dd>
        </div>
      </dl>
      <p className="style-pin__note">
        {translate('planner.summary.stylePinned')}
      </p>
    </>
  );
};
