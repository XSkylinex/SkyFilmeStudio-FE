import type { CSSProperties, FC } from 'react';
import type { ProgressBarProps } from './progress-bar.interface';
import './progress-bar.css';

const PROGRESS_BAR_MIN = 0;
const PROGRESS_BAR_MAX = 100;

interface ProgressFillStyle extends CSSProperties {
  '--progress-value': string;
}

export const ProgressBar: FC<ProgressBarProps> = (props) => {
  const { tone } = props;

  if (props.indeterminate) {
    return (
      <div
        className="progress-bar"
        data-tone={tone}
        data-indeterminate="true"
        role="progressbar"
      >
        <div className="progress-bar__fill" />
      </div>
    );
  }

  const { value } = props;

  return (
    <div
      className="progress-bar"
      data-tone={tone}
      role="progressbar"
      aria-valuemin={PROGRESS_BAR_MIN}
      aria-valuemax={PROGRESS_BAR_MAX}
      aria-valuenow={value}
    >
      <div
        className="progress-bar__fill"
        style={{ '--progress-value': `${value}%` } as ProgressFillStyle}
      />
    </div>
  );
};
