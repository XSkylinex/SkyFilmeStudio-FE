import type { FC } from 'react';
import { resolveTextDirection } from '@/lib/i18n/helpers/resolve-text-direction';
import type { ContentTextProps } from './content-text.interface';

const AUTO_DIRECTION = 'auto';

export const ContentText: FC<ContentTextProps> = ({ language, children }) => (
  <bdi
    dir={
      language === undefined || language === ''
        ? AUTO_DIRECTION
        : resolveTextDirection(language)
    }
  >
    {children}
  </bdi>
);
