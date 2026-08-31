import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { replace } from 'react-router-dom';
import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import { AppShell } from '@/shell/app-shell';
import { ProductionShell } from '@/shell/production-shell';
import { RouteErrorBoundary } from '@/shell/route-error-boundary';
import { RootErrorBoundary } from '@/shell/root-error-boundary';
import { ProjectListPage } from '@/features/projects/ProjectListPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { AssetsPage } from '@/features/assets/AssetsPage';
import { SubjectsPage } from '@/features/subjects/SubjectsPage';
import { StylesPage } from '@/features/styles/StylesPage';
import { VoicesPage } from '@/features/voices/VoicesPage';
import { LocationsPage } from '@/features/locations/LocationsPage';
import { PropsPage } from '@/features/props/PropsPage';
import { BiblePage } from '@/features/bible/BiblePage';
import { ProductionListPage } from '@/features/productions/ProductionListPage';
import { RenderQueuePage } from '@/features/render-queue/RenderQueuePage';
import { NotFoundPage } from './not-found-page';
import { RouteHydrateFallback } from './route-hydrate-fallback';
import type { RouteHandle } from '@/shell/interfaces/route-handle';
import {
  ASSETS_SEGMENT,
  ASSET_ID_PARAM,
  AUDIO_SEGMENT,
  BIBLE_SEGMENT,
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

const routeHandle = (titleKey: TranslationKey): RouteHandle => ({ titleKey });

const resolveProductionIndexRedirect = ({
  params,
}: LoaderFunctionArgs): Response => {
  const { projectId, productionId } = params;
  if (!projectId || !productionId) {
    throw new Response('Missing production route parameters', {
      status: 400,
    });
  }

  return replace(productionPlanPath(projectId, productionId));
};

const productionRoutes: RouteObject[] = [
  {
    index: true,
    loader: resolveProductionIndexRedirect,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: PLAN_SEGMENT,
    lazy: () =>
      import('@/features/planner/PlannerPage').then((routeModule) => ({
        Component: routeModule.PlannerPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.planner.title'),
  },
  {
    path: STORYBOARD_SEGMENT,
    lazy: () =>
      import('@/features/storyboard/StoryboardPage').then((routeModule) => ({
        Component: routeModule.StoryboardPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.storyboard.title'),
  },
  {
    path: QUEUE_SEGMENT,
    Component: RenderQueuePage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.renderQueue.title'),
  },
  {
    path: SHOTS_SEGMENT,
    lazy: () =>
      import('@/features/shots/ShotsPage').then((routeModule) => ({
        Component: routeModule.ShotsPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.shots.title'),
  },
  {
    path: `${SHOTS_SEGMENT}/:${SHOT_ID_PARAM}`,
    lazy: () =>
      import('@/features/shots/ShotReviewPage').then((routeModule) => ({
        Component: routeModule.ShotReviewPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.shotReview.title'),
  },
  {
    path: AUDIO_SEGMENT,
    lazy: () =>
      import('@/features/audio/AudioPage').then((routeModule) => ({
        Component: routeModule.AudioPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.audio.title'),
  },
  {
    path: TIMELINE_SEGMENT,
    lazy: () =>
      import('@/features/timeline/TimelinePage').then((routeModule) => ({
        Component: routeModule.TimelinePage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.timeline.title'),
  },
];

const projectRoutes: RouteObject[] = [
  {
    index: true,
    Component: DashboardPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.dashboard.title'),
  },
  {
    path: ASSETS_SEGMENT,
    Component: AssetsPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.assets.title'),
  },
  {
    path: `${ASSETS_SEGMENT}/:${ASSET_ID_PARAM}`,
    lazy: () =>
      import('@/features/assets/AssetDetailPage').then((routeModule) => ({
        Component: routeModule.AssetDetailPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.assetDetail.title'),
  },
  {
    path: SUBJECTS_SEGMENT,
    Component: SubjectsPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.subjects.title'),
  },
  {
    path: `${SUBJECTS_SEGMENT}/:${SUBJECT_ID_PARAM}`,
    lazy: () =>
      import('@/features/subjects/SubjectReviewPage').then((routeModule) => ({
        Component: routeModule.SubjectReviewPage,
      })),
    HydrateFallback: RouteHydrateFallback,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.subjectReview.title'),
  },
  {
    path: STYLES_SEGMENT,
    Component: StylesPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.styles.title'),
  },
  {
    path: VOICES_SEGMENT,
    Component: VoicesPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.voices.title'),
  },
  {
    path: LOCATIONS_SEGMENT,
    Component: LocationsPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.locations.title'),
  },
  {
    path: PROPS_SEGMENT,
    Component: PropsPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.props.title'),
  },
  {
    path: BIBLE_SEGMENT,
    Component: BiblePage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.bible.title'),
  },
  {
    path: PRODUCTIONS_SEGMENT,
    Component: ProductionListPage,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('page.productions.title'),
  },
  {
    path: `${PRODUCTIONS_SEGMENT}/:${PRODUCTION_ID_PARAM}`,
    Component: ProductionShell,
    ErrorBoundary: RouteErrorBoundary,
    handle: routeHandle('route.production'),
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
        handle: routeHandle('page.projects.title'),
      },
      {
        path: DESIGN_SYSTEM_SEGMENT,
        lazy: () =>
          import('@/shell/design-system-preview').then((routeModule) => ({
            Component: routeModule.DesignSystemPreview,
          })),
        HydrateFallback: RouteHydrateFallback,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('page.designSystem.title'),
      },
      {
        path: `${PROJECTS_SEGMENT}/:${PROJECT_ID_PARAM}`,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('route.project'),
        children: projectRoutes,
      },
      {
        path: SYSTEM_SEGMENT,
        lazy: () =>
          import('@/features/system/SystemPage').then((routeModule) => ({
            Component: routeModule.SystemPage,
          })),
        HydrateFallback: RouteHydrateFallback,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('page.system.title'),
      },
      {
        path: '*',
        Component: NotFoundPage,
        ErrorBoundary: RouteErrorBoundary,
        handle: routeHandle('page.notFound.title'),
      },
    ],
  },
];
