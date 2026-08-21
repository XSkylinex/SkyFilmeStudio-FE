import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { projectsQueryOptions } from '@/features/projects/api/projects.query';
import { ProjectCard } from '@/features/projects/components/project-card';
import { PROJECT_LIST_SKELETON_COUNT } from '@/features/projects/projects.constants';
import './project-list-page.css';

export const ProjectListPage: FC = () => {
  const translate = useTranslate();
  const { data, error, isPending } = useQuery(projectsQueryOptions());

  if (error) {
    const view = resolveRouteErrorView(error);

    return (
      <ErrorState
        title={translate('projects.error.title')}
        description={composeRouteErrorDescription(view, translate)}
        detail={view.detail}
        headingLevel={1}
      />
    );
  }

  if (isPending) {
    return (
      <section className="project-list">
        <h1 className="project-list__title">
          {translate('page.projects.title')}
        </h1>
        <output className="project-list__loading">
          {translate('projects.loading')}
        </output>
        <ul className="project-list__items">
          {Array.from({ length: PROJECT_LIST_SKELETON_COUNT }, (_, index) => (
            <li key={index} className="project-list__placeholder">
              <Skeleton shape="text" />
              <Skeleton shape="text" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        title={translate('projects.empty.title')}
        description={translate('projects.empty.description')}
        headingLevel={1}
      />
    );
  }

  return (
    <section className="project-list">
      <h1 className="project-list__title">
        {translate('page.projects.title')}
      </h1>
      <ul className="project-list__items">
        {data.items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </section>
  );
};
