import type { FC } from 'react';
import { useEffect, useId, useRef } from 'react';
import type { DialogProps } from './dialog.interface';
import './dialog.css';

export const Dialog: FC<DialogProps> = ({
  open,
  title,
  onClose,
  children,
  footer,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) {
      return undefined;
    }

    if (open && !element.open) {
      element.showModal();
    } else if (!open && element.open) {
      element.close();
    }

    return undefined;
  }, [open]);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) {
      return undefined;
    }

    const handleCancel = (): void => {
      onClose();
    };
    const handleClose = (): void => {
      onClose();
    };

    element.addEventListener('cancel', handleCancel);
    element.addEventListener('close', handleClose);

    return () => {
      element.removeEventListener('cancel', handleCancel);
      element.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  return (
    <dialog className="dialog" ref={dialogRef} aria-labelledby={titleId}>
      <div className="dialog__header">
        <h2 className="dialog__title" id={titleId}>
          {title}
        </h2>
      </div>
      <div className="dialog__body">{children}</div>
      {footer ? <div className="dialog__footer">{footer}</div> : null}
    </dialog>
  );
};
