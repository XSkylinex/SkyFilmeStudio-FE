import type { FC } from 'react';
import type { MarkdownViewProps } from './markdown-view.interface';
import './markdown-view.css';

export const MarkdownView: FC<MarkdownViewProps> = ({ markdown, label }) => (
  <pre
    className="markdown-view"
    dir="auto"
    role="region"
    aria-label={label}
    tabIndex={0}
  >
    {markdown}
  </pre>
);
