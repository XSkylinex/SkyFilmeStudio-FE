import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { formatDateTime } from '@/lib/format/format-date-time';
import { useTranslate } from '@/lib/i18n/use-translate';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import { projectDashboardPath } from '@/shell/routes/routes.constants';
import { PROJECT_KIND_LABEL_KEY } from '@/features/projects/projects.constants';
import type { ProjectCardProps } from './project-card.interface';
import './project-card.css';

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);

  return (
    <li className="project-card">
      <Link
        className="project-card__link"
        to={projectDashboardPath(project.id)}
        aria-label={translate('projects.open', { title: project.title })}
      >
        <h2 className="project-card__title">
          <ContentText language={project.primaryLanguage}>
            {project.title}
          </ContentText>
        </h2>
      </Link>
      {project.description ? (
        <p className="project-card__description">
          <ContentText language={project.primaryLanguage}>
            {project.description}
          </ContentText>
        </p>
      ) : null}
      <div className="project-card__meta">
        <Badge
          tone={STATUS_TONE.NEUTRAL}
          label={translate(PROJECT_KIND_LABEL_KEY[project.projectKind])}
        />
        <span className="project-card__language" dir="ltr">
          {project.primaryLanguage}
        </span>
        <span className="project-card__created">
          {translate('projects.created', {
            date: formatDateTime(project.createdAt, interfaceLanguage),
          })}
        </span>
      </div>
    </li>
  );
};
