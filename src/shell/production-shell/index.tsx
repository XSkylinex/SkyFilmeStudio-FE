import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ProductionNav } from '@/shell/production-nav';
import { PRODUCTION_NARRATIVE_MODE_FIXTURE } from '@/shell/production-stages.fixture';
import type { ProductionStageStates } from '@/shell/interfaces/production-stage-states';
import './production-shell.css';

const UNVERIFIED_STAGE_STATES: ProductionStageStates = {};

export const ProductionShell: FC = () => (
  <div className="production-shell">
    <div className="production-shell__nav">
      <ProductionNav
        mode={PRODUCTION_NARRATIVE_MODE_FIXTURE}
        stageStates={UNVERIFIED_STAGE_STATES}
      />
    </div>
    <div className="production-shell__content">
      <Outlet />
    </div>
  </div>
);
