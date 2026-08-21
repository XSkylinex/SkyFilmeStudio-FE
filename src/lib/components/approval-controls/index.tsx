import type { FC } from 'react';
import { useId } from 'react';
import { Button } from '@/lib/components/button';
import { useTranslate } from '@/lib/i18n/use-translate';
import type { ApprovalControlsProps } from './approval-controls.interface';
import './approval-controls.css';

export const ApprovalControls: FC<ApprovalControlsProps> = ({
  onApprove,
  onReject,
  regenerationModes,
  onRegenerate,
  pending,
  decided,
}) => {
  const translate = useTranslate();
  const descriptionBaseId = useId();
  const decisionDisabled = pending || decided;

  return (
    <div className="approval-controls">
      <div className="approval-controls__decision">
        <Button
          variant="primary"
          size="md"
          disabled={decisionDisabled}
          onClick={onApprove}
        >
          {translate('approval.approve')}
        </Button>
        <Button
          variant="danger"
          size="md"
          disabled={decisionDisabled}
          onClick={onReject}
        >
          {translate('approval.reject')}
        </Button>
      </div>
      {regenerationModes.length > 0 ? (
        <div className="approval-controls__modes">
          {regenerationModes.map((mode) => {
            const descriptionId = `${descriptionBaseId}-${mode.id}`;

            return (
              <div key={mode.id} className="approval-controls__mode">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pending}
                  aria-describedby={descriptionId}
                  onClick={() => onRegenerate(mode.id)}
                >
                  <span className="approval-controls__mode-label">
                    {mode.label}
                  </span>
                </Button>
                <span
                  className="approval-controls__mode-description"
                  id={descriptionId}
                >
                  {mode.description}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
