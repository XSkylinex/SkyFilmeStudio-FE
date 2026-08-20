import {
  productionListPath,
  projectAssetsPath,
  projectListPath,
  projectLocationsPath,
  projectPropsPath,
  projectStylesPath,
  projectSubjectsPath,
  projectVoicesPath,
  systemPath,
} from '@/shell/routes/routes.constants';
import type { AppShellNavLink } from '../app-shell.interface';

export const resolveAppShellNavLinks = (
  projectId: string | null,
): readonly AppShellNavLink[] => {
  const globalLinks: AppShellNavLink[] = [
    { to: projectListPath(), labelKey: 'page.projects.title' },
    { to: systemPath(), labelKey: 'page.system.title' },
  ];

  if (!projectId) {
    return globalLinks;
  }

  return [
    ...globalLinks,
    { to: projectAssetsPath(projectId), labelKey: 'page.assets.title' },
    { to: projectSubjectsPath(projectId), labelKey: 'page.subjects.title' },
    { to: projectStylesPath(projectId), labelKey: 'page.styles.title' },
    { to: projectVoicesPath(projectId), labelKey: 'page.voices.title' },
    { to: projectLocationsPath(projectId), labelKey: 'page.locations.title' },
    { to: projectPropsPath(projectId), labelKey: 'page.props.title' },
    { to: productionListPath(projectId), labelKey: 'page.productions.title' },
  ];
};
