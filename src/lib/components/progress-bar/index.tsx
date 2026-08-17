import type { FC } from 'react';
import type {
  ProgressBarProps,
  ProgressFillStyle,
} from './progress-bar.interface';
import './progress-bar.css';

const PROGRESS_BAR_MIN = 0;
const PROGRESS_BAR_MAX = 100;

export const ProgressBar: FC<ProgressBarProps> = (props) => {
  const { label, tone } = props;

  if (props.indeterminate) {
    return (
      <div
        className="progress-bar"
        data-tone={tone}
        data-indeterminate="true"
        role="progressbar"
        aria-label={label}
      >
        <div className="progress-bar__fill" />
      </div>
    );
  }

  const { value } = props;
  const style: ProgressFillStyle = { '--progress-value': `${value}%` };

  return (
    <div
      className="progress-bar"
      data-tone={tone}
      role="progressbar"
      aria-label={label}
      aria-valuemin={PROGRESS_BAR_MIN}
      aria-valuemax={PROGRESS_BAR_MAX}
      aria-valuenow={value}
    >
      <div className="progress-bar__fill" style={style} />
    </div>
  );
};
