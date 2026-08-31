import { screen } from '@testing-library/react';
import { BibleMarkdownView } from '@/features/bible/components/bible-markdown-view';
import { renderInApp } from '../../../../render-in-app';

const DOCUMENT = '## World rules\n- Genre: תעודה קצרה\n  - ללא אלימות גרפית';

describe('BibleMarkdownView', () => {
  it('holds the document to one direction, so its bullets and indentation survive an RTL interface', () => {
    renderInApp(<BibleMarkdownView markdown={DOCUMENT} />);

    const view = screen.getByText(/World rules/u);

    expect(view).toHaveAttribute('dir', 'ltr');
  });

  it('keeps the document exactly as the orchestrator wrote it', () => {
    renderInApp(<BibleMarkdownView markdown={DOCUMENT} />);

    expect(screen.getByText(/World rules/u).textContent).toBe(DOCUMENT);
  });
});
