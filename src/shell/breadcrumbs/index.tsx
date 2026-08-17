import type { FC } from 'react';
import { Link, useMatches } from 'react-router-dom';
import { resolveBreadcrumbs } from '@/shell/helpers/resolve-breadcrumbs';
import './breadcrumbs.css';

export const Breadcrumbs: FC = () => {
  const matches = useMatches();
  const trail = resolveBreadcrumbs(matches);

  if (trail.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {trail.map((crumb, index) => {
          const isCurrent = index === trail.length - 1;

          return (
            <li key={crumb.pathname} className="breadcrumbs__item">
              {isCurrent ? (
                <span className="breadcrumbs__current" aria-current="page">
                  {crumb.title}
                </span>
              ) : (
                <Link className="breadcrumbs__link" to={crumb.pathname}>
                  {crumb.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
