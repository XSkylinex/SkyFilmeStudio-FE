import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { subjectReviewPath } from '@/shell/routes/routes.constants';
import {
  SUBJECT_NARRATIVE_ROLE_LABEL_KEY,
  SUBJECT_SOURCE_MODE_LABEL_KEY,
  SUBJECT_TYPE_LABEL_KEY,
} from '@/features/subjects/subjects.constants';
import type { SubjectCardProps } from './subject-card.interface';
import './subject-card.css';

export const SubjectCard: FC<SubjectCardProps> = ({ projectId, subject }) => {
  const translate = useTranslate();

  return (
    <li className="subject-card" data-active={subject.active}>
      <Link
        className="subject-card__link"
        to={subjectReviewPath(projectId, subject.id)}
      >
        <ContentText>{subject.displayName}</ContentText>
      </Link>

      <div className="subject-card__meta">
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(SUBJECT_TYPE_LABEL_KEY[subject.subjectType])}
        />
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(SUBJECT_SOURCE_MODE_LABEL_KEY[subject.sourceMode])}
        />
        {subject.narrativeRole ? (
          <Badge
            tone={STATUS_TONE.NEUTRAL}
            label={translate(
              SUBJECT_NARRATIVE_ROLE_LABEL_KEY[subject.narrativeRole],
            )}
          />
        ) : null}
        {subject.active ? null : (
          <Badge
            tone={STATUS_TONE.STALE}
            label={translate('subjects.inactive')}
          />
        )}
      </div>

      {subject.canonicalDescription ? (
        <p className="subject-card__description">
          <ContentText>{subject.canonicalDescription}</ContentText>
        </p>
      ) : null}
    </li>
  );
};
