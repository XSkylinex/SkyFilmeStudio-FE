import { screen } from '@testing-library/react';
import { projectBibleVersionIdSchema } from 'sky-filme-studio-be/contracts';
import { BibleVersionList } from '@/features/bible/components/bible-version-list';
import { buildProjectBible } from '../../../../fixtures/project-bible.fixture';
import { renderInApp } from '../../../../render-in-app';

const DRAFT = buildProjectBible({
  id: projectBibleVersionIdSchema.parse('11111111-1111-4111-8111-111111111111'),
  version: 2,
  published: false,
});

const PUBLISHED = buildProjectBible({
  id: projectBibleVersionIdSchema.parse('22222222-2222-4222-8222-222222222222'),
  version: 1,
  published: true,
  publishedAt: '2026-08-22T00:00:00.000Z',
});

describe('BibleVersionList', () => {
  it('marks the version the orchestrator calls current, and not the draft above it', () => {
    renderInApp(
      <BibleVersionList
        versions={[DRAFT, PUBLISHED]}
        activeId={PUBLISHED.id}
        selectedId={DRAFT.id}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('marks nothing current when the project has no published version', () => {
    renderInApp(
      <BibleVersionList
        versions={[DRAFT]}
        activeId={undefined}
        selectedId={DRAFT.id}
        onSelect={() => undefined}
      />,
    );

    expect(screen.queryByText('Current')).not.toBeInTheDocument();
  });

  it('shows the newest version first, whatever order the orchestrator sent', () => {
    renderInApp(
      <BibleVersionList
        versions={[PUBLISHED, DRAFT]}
        activeId={PUBLISHED.id}
        selectedId={DRAFT.id}
        onSelect={() => undefined}
      />,
    );

    const [first] = screen.getAllByRole('button');
    expect(first).toHaveAccessibleName('Show version 2');
  });
});
