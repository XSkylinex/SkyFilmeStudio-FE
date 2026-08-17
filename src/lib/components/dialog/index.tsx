import type { FC } from 'react';
import { useEffect, useId, useRef } from 'react';
import { HEADING_TAG } from '@/lib/heading-level.constants';
import type { DialogProps } from './dialog.interface';
import './dialog.css';

const DIALOG_DEFAULT_HEADING_LEVEL = 2;

export const Dialog: FC<DialogProps> = ({
  open,
  title,
  onClose,
  children,
  footer,
  headingLevel = DIALOG_DEFAULT_HEADING_LEVEL,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closedByPropRef = useRef(false);
  const titleId = useId();
  const Heading = HEADING_TAG[headingLevel];

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) {
      return undefined;
    }

    if (open && !element.open) {
      element.showModal();
    } else if (!open && element.open) {
      closedByPropRef.current = true;
      element.close();
    }

    return undefined;
  }, [open]);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) {
      return undefined;
    }

    const handleClose = (): void => {
      if (closedByPropRef.current) {
        closedByPropRef.current = false;
        return;
      }
      onClose();
    };

    element.addEventListener('close', handleClose);

    return () => {
      element.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  return (
    <dialog className="dialog" ref={dialogRef} aria-labelledby={titleId}>
      <div className="dialog__header">
        <Heading className="dialog__title" id={titleId}>
          {title}
        </Heading>
      </div>
      <div className="dialog__body">{children}</div>
      {footer ? <div className="dialog__footer">{footer}</div> : null}
    </dialog>
  );
};
