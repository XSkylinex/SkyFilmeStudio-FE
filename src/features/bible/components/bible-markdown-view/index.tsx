import type { FC } from 'react';
import type { BibleMarkdownViewProps } from './bible-markdown-view.interface';
import './bible-markdown-view.css';

export const BibleMarkdownView: FC<BibleMarkdownViewProps> = ({ markdown }) => (
  <pre className="bible-markdown-view" dir="ltr">
    {markdown}
  </pre>
);
