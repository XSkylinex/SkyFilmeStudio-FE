import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ProductionNav } from '@/shell/production-nav';
import {
  PRODUCTION_NARRATIVE_MODE_FIXTURE,
  PRODUCTION_STAGE_STATES_FIXTURE,
} from '@/shell/production-stages.fixture';
import './production-shell.css';

export const ProductionShell: FC = () => (
  <div className="production-shell">
    <div className="production-shell__nav">
      <ProductionNav
        mode={PRODUCTION_NARRATIVE_MODE_FIXTURE}
        stageStates={PRODUCTION_STAGE_STATES_FIXTURE}
      />
    </div>
    <div className="production-shell__content">
      <Outlet />
    </div>
  </div>
);
