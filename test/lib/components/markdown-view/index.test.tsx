import { screen } from '@testing-library/react';
import { MarkdownView } from '@/lib/components/markdown-view';
import { renderInApp } from '../../../render-in-app';

const DOCUMENT = '## World rules\n- Genre: תעודה קצרה\n  - ללא אלימות גרפית';

describe('MarkdownView', () => {
  it('resolves direction per line, so a Hebrew line keeps its own sentence order', () => {
    renderInApp(
      <MarkdownView markdown={DOCUMENT} label="Generated view" />,
    );

    expect(
      screen.getByRole('region', { name: 'Generated view' }),
    ).toHaveAttribute('dir', 'auto');
  });

  it('is reachable by keyboard, because it is a scroll container', () => {
    renderInApp(
      <MarkdownView markdown={DOCUMENT} label="Generated view" />,
    );

    expect(
      screen.getByRole('region', { name: 'Generated view' }),
    ).toHaveAttribute('tabindex', '0');
  });

  it('keeps the document exactly as the orchestrator wrote it', () => {
    renderInApp(
      <MarkdownView markdown={DOCUMENT} label="Generated view" />,
    );

    expect(
      screen.getByRole('region', { name: 'Generated view' }).textContent,
    ).toBe(DOCUMENT);
  });
});
