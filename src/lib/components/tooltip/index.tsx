import type { FC } from 'react';
import { cloneElement, useId } from 'react';
import type { TooltipProps } from './tooltip.interface';
import './tooltip.css';

export const Tooltip: FC<TooltipProps> = ({ label, children }) => {
  const tipId = useId();
  const describedBy = [children.props['aria-describedby'], tipId]
    .filter((value) => value !== undefined)
    .join(' ');

  return (
    <span className="tooltip">
      {cloneElement(children, { 'aria-describedby': describedBy })}
      <span className="tooltip__tip" role="tooltip" id={tipId}>
        {label}
      </span>
    </span>
  );
};
