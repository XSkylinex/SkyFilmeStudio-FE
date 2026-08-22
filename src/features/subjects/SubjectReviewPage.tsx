import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { ErrorState } from '@/lib/components/error-state';
import { useTranslate } from '@/lib/i18n/use-translate';
import {
  PROJECT_ID_PARAM,
  SUBJECT_ID_PARAM,
  projectSubjectsPath,
} from '@/shell/routes/routes.constants';
import { SubjectReview } from '@/features/subjects/components/subject-review';
import './subject-review-page.css';

export const SubjectReviewPage: FC = () => {
  const translate = useTranslate();
  const params = useParams();
  const projectId = projectIdSchema.safeParse(params[PROJECT_ID_PARAM]);
  const subjectId = subjectIdSchema.safeParse(params[SUBJECT_ID_PARAM]);

  if (!projectId.success) {
    return (
      <ErrorState
        title={translate('project.invalidId.title')}
        description={translate('project.invalidId.description')}
      />
    );
  }

  if (!subjectId.success) {
    return (
      <ErrorState
        title={translate('subjectReview.invalidSubject.title')}
        description={translate('subjectReview.invalidSubject.description')}
      />
    );
  }

  return (
    <div className="subject-review-page">
      <Link
        className="subject-review-page__back"
        to={projectSubjectsPath(projectId.data)}
      >
        {translate('subjectReview.back')}
      </Link>
      <SubjectReview projectId={projectId.data} subjectId={subjectId.data} />
    </div>
  );
};
