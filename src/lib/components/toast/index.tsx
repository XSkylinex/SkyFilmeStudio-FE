import type { FC } from 'react';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { IconButton } from '@/lib/components/icon-button';
import { Icon } from '@/lib/components/icon';
import { useTranslate } from '@/lib/i18n/use-translate';
import type { ToastProps } from './toast.interface';
import './toast.css';

export const Toast: FC<ToastProps> = ({
  tone,
  title,
  description,
  onDismiss,
}) => {
  const translate = useTranslate();

  return (
    <div
      className="toast"
      data-tone={tone}
      role={tone === STATUS_TONE.DANGER ? 'alert' : 'status'}
    >
      <div className="toast__body">
        <p className="toast__title">{title}</p>
        {description ? (
          <p className="toast__description">{description}</p>
        ) : null}
      </div>
      {onDismiss ? (
        <IconButton
          variant="ghost"
          size="sm"
          label={translate('toast.dismiss')}
          onClick={onDismiss}
        >
          <Icon name="close" />
        </IconButton>
      ) : null}
    </div>
  );
};
