import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from '@/lib/components/badge';
import { resolveProductionStages } from '@/shell/helpers/resolve-production-stages';
import {
  PRODUCTION_STAGE_STATE_LABEL,
  PRODUCTION_STAGE_STATE_TONE,
} from '@/shell/navigation.constants';
import type { ProductionNavProps } from './production-nav.interface';
import './production-nav.css';

export const ProductionNav: FC<ProductionNavProps> = ({
  mode,
  stageStates,
}) => {
  const stages = resolveProductionStages(mode, stageStates);

  return (
    <nav className="production-nav" aria-label="Production stages">
      {stages.map((stage) => (
        <NavLink
          key={stage.id}
          to={stage.path}
          className="production-nav__stage"
          end
        >
          <span className="production-nav__stage-label">{stage.label}</span>
          <span className="production-nav__stage-state">
            <Badge
              tone={PRODUCTION_STAGE_STATE_TONE[stage.state]}
              label={PRODUCTION_STAGE_STATE_LABEL[stage.state]}
            />
          </span>
        </NavLink>
      ))}
    </nav>
  );
};
