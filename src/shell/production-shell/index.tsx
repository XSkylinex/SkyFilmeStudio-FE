import type { FC } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ProductionNav } from '@/shell/production-nav';
import { PRODUCTION_NARRATIVE_MODE_FIXTURE } from '@/shell/production-stages.fixture';
import {
  PRODUCTION_ID_PARAM,
  PROJECT_ID_PARAM,
  productionContinuityPath,
} from '@/shell/routes/routes.constants';
import type { ProductionStageStates } from '@/shell/interfaces/production-stage-states';
import './production-shell.css';

const UNVERIFIED_STAGE_STATES: ProductionStageStates = {};

export const ProductionShell: FC = () => {
  const params = useParams();
  const projectId = params[PROJECT_ID_PARAM];
  const productionId = params[PRODUCTION_ID_PARAM];

  return (
    <div className="production-shell">
      <div className="production-shell__nav">
        <ProductionNav
          mode={PRODUCTION_NARRATIVE_MODE_FIXTURE}
          stageStates={UNVERIFIED_STAGE_STATES}
          continuityPath={
            projectId === undefined || productionId === undefined
              ? undefined
              : productionContinuityPath(projectId, productionId)
          }
        />
      </div>
      <div className="production-shell__content">
        <Outlet />
      </div>
    </div>
  );
};
