import type { FC } from 'react';
import type { BibleMarkdownViewProps } from './bible-markdown-view.interface';
import './bible-markdown-view.css';

export const BibleMarkdownView: FC<BibleMarkdownViewProps> = ({
  markdown,
  label,
}) => (
  <pre
    className="bible-markdown-view"
    dir="auto"
    role="region"
    aria-label={label}
    tabIndex={0}
  >
    {markdown}
  </pre>
);
