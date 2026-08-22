import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { projectSubjectsQueryOptions } from '@/features/subjects/api/project-subjects.query';
import { SubjectCard } from '@/features/subjects/components/subject-card';
import { SUBJECT_LIST_SKELETON_COUNT } from '@/features/subjects/subjects.constants';
import type { SubjectListProps } from './subject-list.interface';
import './subject-list.css';

export const SubjectList: FC<SubjectListProps> = ({ projectId }) => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(
    projectSubjectsQueryOptions(projectId),
  );

  if (error) {
    const errorView = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('subjects.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
      />
    );
  }

  if (isPending) {
    return (
      <div className="subject-list">
        <output className="subject-list__loading">
          {translate('subjects.loading')}
        </output>
        <ul className="subject-list__items">
          {Array.from({ length: SUBJECT_LIST_SKELETON_COUNT }, (_, index) => (
            <li key={index}>
              <Skeleton shape="rect" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        title={translate('subjects.empty.title')}
        description={translate('subjects.empty.description')}
        headingLevel={2}
      />
    );
  }

  return (
    <ul className="subject-list__items">
      {data.items.map((subject) => (
        <SubjectCard key={subject.id} projectId={projectId} subject={subject} />
      ))}
    </ul>
  );
};
