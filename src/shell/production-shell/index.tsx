import type { FC } from 'react';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useShellState } from '@/shell/shell-state/use-shell-state';
import { ProductionNav } from '@/shell/production-nav';
import {
  PRODUCTION_NARRATIVE_MODE_FIXTURE,
  PRODUCTION_STAGE_STATES_FIXTURE,
} from '@/shell/production-stages.fixture';
import './production-shell.css';

export const ProductionShell: FC = () => {
  const { projectId, productionId } = useParams<'projectId' | 'productionId'>();
  const { setCurrentProjectId, setCurrentProductionId } = useShellState();

  useEffect(() => {
    setCurrentProjectId(projectId ?? null);
    setCurrentProductionId(productionId ?? null);

    return () => {
      setCurrentProjectId(null);
      setCurrentProductionId(null);
    };
  }, [projectId, productionId, setCurrentProjectId, setCurrentProductionId]);

  return (
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
};
