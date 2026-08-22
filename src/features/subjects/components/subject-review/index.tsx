import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { subjectDetailQueryOptions } from '@/features/subjects/api/subject-detail.query';
import { CanonicalDraft } from '@/features/subjects/components/canonical-draft';
import { CanonicalSection } from '@/features/subjects/components/canonical-section';
import { SubjectIdentity } from '@/features/subjects/components/subject-identity';
import {
  SUBJECT_NARRATIVE_ROLE_LABEL_KEY,
  SUBJECT_SOURCE_MODE_LABEL_KEY,
  SUBJECT_TYPE_LABEL_KEY,
} from '@/features/subjects/subjects.constants';
import type { SubjectReviewProps } from './subject-review.interface';
import './subject-review.css';

export const SubjectReview: FC<SubjectReviewProps> = ({
  projectId,
  subjectId,
}) => {
  const translate = useTranslate();
  const subject = useQuery(subjectDetailQueryOptions(projectId, subjectId));

  if (subject.error) {
    const errorView = resolveRouteErrorView(subject.error);

    return (
      <ErrorState
        title={translate('subjectReview.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
        headingLevel={1}
      />
    );
  }

  if (subject.isPending) {
    return (
      <output className="subject-review__loading">
        {translate('subjectReview.loading')}
        <Skeleton shape="rect" />
      </output>
    );
  }

  return (
    <div className="subject-review">
      <h1 className="subject-review__title">
        <ContentText>{subject.data.displayName}</ContentText>
      </h1>

      <div className="subject-review__badges">
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(SUBJECT_TYPE_LABEL_KEY[subject.data.subjectType])}
        />
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(
            SUBJECT_SOURCE_MODE_LABEL_KEY[subject.data.sourceMode],
          )}
        />
        {subject.data.narrativeRole ? (
          <Badge
            tone={STATUS_TONE.NEUTRAL}
            label={translate(
              SUBJECT_NARRATIVE_ROLE_LABEL_KEY[subject.data.narrativeRole],
            )}
          />
        ) : null}
        {subject.data.active ? null : (
          <Badge
            tone={STATUS_TONE.STALE}
            label={translate('subjects.inactive')}
          />
        )}
      </div>

      <SubjectIdentity subject={subject.data} />

      <CanonicalSection projectId={projectId} subjectId={subjectId} />

      <CanonicalDraft
        projectId={projectId}
        subjectId={subjectId}
        subjectName={subject.data.displayName}
      />
    </div>
  );
};
