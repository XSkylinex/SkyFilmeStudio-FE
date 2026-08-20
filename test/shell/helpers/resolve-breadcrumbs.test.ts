import type { UIMatch } from 'react-router-dom';
import { resolveBreadcrumbs } from '@/shell/helpers/resolve-breadcrumbs';

const match = (pathname: string, title?: string): UIMatch =>
  ({
    id: pathname,
    pathname,
    params: {},
    data: undefined,
    handle: title === undefined ? undefined : { title },
  }) as UIMatch;

describe('resolveBreadcrumbs', () => {
  it('builds the trail from the matches that name themselves', () => {
    const trail = resolveBreadcrumbs([
      match('/'),
      match('/projects/p1', 'Project'),
      match('/projects/p1/productions/pr1', 'Production'),
      match('/projects/p1/productions/pr1/plan', 'Plan'),
    ]);

    expect(trail).toStrictEqual([
      { title: 'Project', pathname: '/projects/p1' },
      { title: 'Production', pathname: '/projects/p1/productions/pr1' },
      { title: 'Plan', pathname: '/projects/p1/productions/pr1/plan' },
    ]);
  });

  it('drops the root match, which the primary navigation already reaches', () => {
    const trail = resolveBreadcrumbs([
      match('/', 'Projects'),
      match('/system', 'System'),
    ]);

    expect(trail).toStrictEqual([{ title: 'System', pathname: '/system' }]);
  });

  it('keeps one crumb per path, so a layout and its index do not both appear', () => {
    const trail = resolveBreadcrumbs([
      match('/'),
      match('/projects/p1', 'Project'),
      match('/projects/p1', 'Dashboard'),
    ]);

    expect(trail).toStrictEqual([
      { title: 'Dashboard', pathname: '/projects/p1' },
    ]);
  });

  it('ignores a match whose handle is not a route handle', () => {
    const trail = resolveBreadcrumbs([
      match('/'),
      { ...match('/projects/p1'), handle: { notATitle: 1 } } as UIMatch,
      match('/projects/p1/assets', 'Assets'),
    ]);

    expect(trail).toStrictEqual([
      { title: 'Assets', pathname: '/projects/p1/assets' },
    ]);
  });
});
