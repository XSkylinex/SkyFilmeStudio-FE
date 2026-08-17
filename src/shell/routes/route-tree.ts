import { redirect } from 'react-router-dom';
import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import { AppShell } from '@/shell/app-shell';
import { ProductionShell } from '@/shell/production-shell';
import { RouteErrorBoundary } from '@/shell/route-error-boundary';
import { RootErrorBoundary } from '@/shell/root-error-boundary';
import { ProjectListPage } from '@/features/projects/ProjectListPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { AssetsPage } from '@/features/assets/AssetsPage';
import { SubjectsPage } from '@/features/subjects/SubjectsPage';
import { SubjectReviewPage } from '@/features/subjects/SubjectReviewPage';
import { StylesPage } from '@/features/styles/StylesPage';
import { VoicesPage } from '@/features/voices/VoicesPage';
import { LocationsPage } from '@/features/locations/LocationsPage';
import { PropsPage } from '@/features/props/PropsPage';
import { ProductionListPage } from '@/features/productions/ProductionListPage';
import { PlannerPage } from '@/features/planner/PlannerPage';
import { RenderQueuePage } from '@/features/render-queue/RenderQueuePage';
import { SystemPage } from '@/features/system/SystemPage';
import { NotFoundPage } from './not-found-page';
import { RouteHydrateFallback } from './route-hydrate-fallback';
import type { RouteHandle } from '@/shell/interfaces/route-handle';
import {
  ASSETS_SEGMENT,
  AUDIO_SEGMENT,
  DESIGN_SYSTEM_SEGMENT,
  LOCATIONS_SEGMENT,
  PLAN_SEGMENT,
  PRODUCTIONS_SEGMENT,
  PRODUCTION_ID_PARAM,
  PROJECTS_SEGMENT,
  PROJECT_ID_PARAM,
  PROPS_SEGMENT,
  QUEUE_SEGMENT,
  ROOT_PATH,
  SHOTS_SEGMENT,
  SHOT_ID_PARAM,
  STORYBOARD_SEGMENT,
  STYLES_SEGMENT,
  SUBJECTS_SEGMENT,
  SUBJECT_ID_PARAM,
  SYSTEM_SEGMENT,
  TIMELINE_SEGMENT,
  VOICES_SEGMENT,
  productionPlanPath,
} from './routes.constants';

const routeHandle = (title: string): RouteHandle => ({ title });

const resolveProductionIndexRedirect = ({
  params,
}: LoaderFunctionArgs): Response => {
  const { projectId, productionId } = params;
  if (!projectId || !productionId) {
    throw new Response('Missing production route parameters', {
      status: 400,
    });
  }

  return redirect(productionPlanPath(projectId, productionId));
};

const productionRoutes: RouteObject[] = [
  {
    index: true,
    loader: resolveProductionIndexRedirect,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: PLAN_SEGMENT,
    Component: PlannerPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Plan'),
  },
  {
    path: STORYBOARD_SEGMENT,
    lazy: () =>
      import('@/features/storyboard/StoryboardPage').then((routeModule) => ({
        Component: routeModule.StoryboardPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Storyboard'),
  },
  {
    path: QUEUE_SEGMENT,
    Component: RenderQueuePage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Render queue'),
  },
  {
    path: SHOTS_SEGMENT,
    lazy: () =>
      import('@/features/shots/ShotsPage').then((routeModule) => ({
        Component: routeModule.ShotsPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Shots'),
  },
  {
    path: `${SHOTS_SEGMENT}/:${SHOT_ID_PARAM}`,
    lazy: () =>
      import('@/features/shots/ShotReviewPage').then((routeModule) => ({
        Component: routeModule.ShotReviewPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Shot review'),
  },
  {
    path: AUDIO_SEGMENT,
    lazy: () =>
      import('@/features/audio/AudioPage').then((routeModule) => ({
        Component: routeModule.AudioPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Audio'),
  },
  {
    path: TIMELINE_SEGMENT,
    lazy: () =>
      import('@/features/timeline/TimelinePage').then((routeModule) => ({
        Component: routeModule.TimelinePage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Timeline'),
  },
];

const projectRoutes: RouteObject[] = [
  {
    index: true,
    Component: DashboardPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Dashboard'),
  },
  {
    path: ASSETS_SEGMENT,
    Component: AssetsPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Assets'),
  },
  {
    path: SUBJECTS_SEGMENT,
    Component: SubjectsPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Subjects'),
  },
  {
    path: `${SUBJECTS_SEGMENT}/:${SUBJECT_ID_PARAM}`,
    Component: SubjectReviewPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Subject review'),
  },
  {
    path: STYLES_SEGMENT,
    Component: StylesPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Styles'),
  },
  {
    path: VOICES_SEGMENT,
    Component: VoicesPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Voices'),
  },
  {
    path: LOCATIONS_SEGMENT,
    Component: LocationsPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Locations'),
  },
  {
    path: PROPS_SEGMENT,
    Component: PropsPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Props'),
  },
  {
    path: PRODUCTIONS_SEGMENT,
    Component: ProductionListPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('Productions'),
  },
  {
    path: `${PRODUCTIONS_SEGMENT}/:${PRODUCTION_ID_PARAM}`,
    Component: ProductionShell,
    ErrorBoundary: RouteErrorBoundary,
    children: productionRoutes,
  },
];

export const routeTree: RouteObject[] = [
  {
    path: ROOT_PATH,
    Component: AppShell,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        Component: ProjectListPage,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('Projects'),
      },
      {
        path: DESIGN_SYSTEM_SEGMENT,
        lazy: () =>
          import('@/shell/design-system-preview').then((routeModule) => ({
            Component: routeModule.DesignSystemPreview,
          })),
        HydrateFallback: RouteHydrateFallback,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('Design system'),
      },
      {
        path: `${PROJECTS_SEGMENT}/:${PROJECT_ID_PARAM}`,
        ErrorBoundary: RouteErrorBoundary,
        children: projectRoutes,
      },
      {
        path: SYSTEM_SEGMENT,
        Component: SystemPage,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('System'),
      },
      {
        path: '*',
        Component: NotFoundPage,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('Page not found'),
      },
    ],
  },
];
