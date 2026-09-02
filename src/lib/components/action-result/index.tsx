import type { FC } from 'react';
import { focusWhenShown } from '@/lib/helpers/focus-when-shown';
import type { ActionResultProps } from './action-result.interface';
import './action-result.css';

export const ActionResult: FC<ActionResultProps> = ({ message, attempt }) => (
  <output key={attempt} className="action-result" ref={focusWhenShown} tabIndex={-1}>
    {message}
  </output>
);
