import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ProjectBibleVersionId } from 'sky-filme-studio-be/contracts';
import { EmptyState } from '@/lib/components/empty-state';
import { ErrorState } from '@/lib/components/error-state';
import { Skeleton } from '@/lib/components/skeleton';
import { useTranslate } from '@/lib/i18n/use-translate';
import { composeRouteErrorDescription } from '@/shell/helpers/compose-route-error-description';
import { resolveRouteErrorView } from '@/shell/helpers/resolve-route-error-view';
import { activeProjectBibleQueryOptions } from '@/features/bible/api/active-project-bible.query';
import { projectBiblesQueryOptions } from '@/features/bible/api/project-bibles.query';
import { BibleAudioSection } from '@/features/bible/components/bible-audio-section';
import { BibleGaps } from '@/features/bible/components/bible-gaps';
import { BibleMarkdownPanel } from '@/features/bible/components/bible-markdown-panel';
import { BibleNarrativeSection } from '@/features/bible/components/bible-narrative-section';
import { BiblePublish } from '@/features/bible/components/bible-publish';
import { BibleSubjectRulesSection } from '@/features/bible/components/bible-subject-rules';
import { BibleVersionList } from '@/features/bible/components/bible-version-list';
import { BibleWorldSection } from '@/features/bible/components/bible-world-section';
import type { ProjectBibleViewProps } from './project-bible.interface';
import './project-bible.css';

export const ProjectBibleView: FC<ProjectBibleViewProps> = ({ projectId }) => {
  const translate = useTranslate();
  const [chosenId, setChosenId] = useState<ProjectBibleVersionId | null>(null);
  const versions = useQuery(projectBiblesQueryOptions(projectId));
  const active = useQuery(activeProjectBibleQueryOptions(projectId));

  if (versions.error) {
    const errorView = resolveRouteErrorView(versions.error);

    return (
      <ErrorState
        title={translate('bible.error.title')}
        description={composeRouteErrorDescription(errorView, translate)}
        detail={errorView.detail}
        headingLevel={1}
      />
    );
  }

  if (versions.isPending || active.isPending) {
    return (
      <section className="project-bible">
        <output>{translate('bible.loading')}</output>
        <Skeleton shape="rect" />
      </section>
    );
  }

  const items = versions.data.items;
  const selected =
    items.find((bible) => bible.id === chosenId) ?? active.data ?? items[0];

  if (selected === undefined) {
    return (
      <section className="project-bible">
        <h1 className="project-bible__title">{translate('bible.title')}</h1>
        <EmptyState
          title={translate('bible.empty.title')}
          description={translate('bible.empty.description')}
          headingLevel={2}
        />
        <BibleGaps />
      </section>
    );
  }

  return (
    <section className="project-bible">
      <h1 className="project-bible__title">{translate('bible.title')}</h1>

      <BibleVersionList
        versions={items}
        activeId={active.data?.id}
        selectedId={selected.id}
        onSelect={setChosenId}
      />

      {versions.data.nextCursor === undefined ? null : (
        <p className="project-bible__truncated">
          {translate('bible.versions.firstPageOnly')}
        </p>
      )}

      <div className="project-bible__sections">
        <BibleWorldSection world={selected.world} />
        <BibleNarrativeSection
          narrative={selected.narrative}
          projectKind={selected.projectKind}
        />
        <BibleAudioSection audio={selected.audio} />
        <BibleSubjectRulesSection subjectRules={selected.subjectRules} />
      </div>

      <BiblePublish projectId={projectId} bible={selected} />
      <BibleMarkdownPanel projectId={projectId} bibleId={selected.id} />
      <BibleGaps />
    </section>
  );
};
