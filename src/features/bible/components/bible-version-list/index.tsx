import type { FC } from 'react';
import { Badge } from '@/lib/components/badge';
import { Button } from '@/lib/components/button';
import { formatDateTime } from '@/lib/format/format-date-time';
import { useTranslate } from '@/lib/i18n/use-translate';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import type { BibleVersionListProps } from './bible-version-list.interface';
import './bible-version-list.css';

export const BibleVersionList: FC<BibleVersionListProps> = ({
  versions,
  activeId,
  selectedId,
  onSelect,
}) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);
  const ordered = versions.toSorted(
    (left, right) => right.version - left.version,
  );

  return (
    <section className="bible-version-list">
      <h2 className="bible-version-list__title">
        {translate('bible.versions.title')}
      </h2>
      <ul className="bible-version-list__items">
        {ordered.map((bible) => (
          <li className="bible-version-list__item" key={bible.id}>
            <Button
              variant={bible.id === selectedId ? 'primary' : 'secondary'}
              size="sm"
              aria-pressed={bible.id === selectedId}
              aria-label={translate('bible.versions.select', {
                version: String(bible.version),
              })}
              onClick={() => onSelect(bible.id)}
            >
              <span className="bible-version-list__number" dir="ltr">
                {bible.version}
              </span>
            </Button>
            <Badge
              tone={bible.published ? STATUS_TONE.SUCCESS : STATUS_TONE.NEUTRAL}
              label={translate(
                bible.published
                  ? 'bible.versions.published'
                  : 'bible.versions.draft',
              )}
            />
            {bible.id === activeId ? (
              <Badge
                tone={STATUS_TONE.ATTENTION}
                label={translate('bible.versions.active')}
              />
            ) : null}
            {bible.publishedAt === undefined ? null : (
              <span className="bible-version-list__when">
                {formatDateTime(bible.publishedAt, interfaceLanguage)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
