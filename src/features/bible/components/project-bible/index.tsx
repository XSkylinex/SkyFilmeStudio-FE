import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bibleCarriesNarrative } from 'sky-filme-studio-be/contracts';
import type { ProjectBibleVersionId } from 'sky-filme-studio-be/contracts';
import { Button } from '@/lib/components/button';
import { Dialog } from '@/lib/components/dialog';
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
import { CreateBibleForm } from '@/features/bible/components/create-bible-form';
import { EditBibleForm } from '@/features/bible/components/edit-bible-form';
import {
  EMPTY_BIBLE_FORM_VALUES,
  bibleFormValuesFrom,
} from '@/features/bible/helpers/bible-form-values';
import { projectQueryOptions } from '@/features/projects/api/project.query';
import type { ProjectBibleViewProps } from './project-bible.interface';
import './project-bible.css';

export const ProjectBibleView: FC<ProjectBibleViewProps> = ({ projectId }) => {
  const translate = useTranslate();
  const [chosenId, setChosenId] = useState<ProjectBibleVersionId | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const versions = useQuery(projectBiblesQueryOptions(projectId));
  const active = useQuery(activeProjectBibleQueryOptions(projectId));
  const project = useQuery(projectQueryOptions(projectId));
  const carriesNarrative =
    project.data === undefined
      ? false
      : bibleCarriesNarrative(project.data.projectKind);

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

  const initialValues =
    selected === undefined
      ? EMPTY_BIBLE_FORM_VALUES
      : bibleFormValuesFrom(selected);

  const createButton = (
    <>
      <Button
        type="button"
        variant="primary"
        size="md"
        disabled={project.isPending}
        onClick={() => setCreating(true)}
      >
        {translate(
          items.length === 0 ? 'bible.create.action' : 'bible.create.next',
        )}
      </Button>

      {project.data === undefined && !project.isPending ? (
        <p className="project-bible__note">
          {translate('bible.form.kindUnreadable')}
        </p>
      ) : null}
    </>
  );

  const createDialog = (
    <Dialog
      open={creating}
      title={translate('bible.create.title')}
      onClose={() => setCreating(false)}
    >
      {creating ? (
        <CreateBibleForm
          projectId={projectId}
          carriesNarrative={carriesNarrative}
          initialValues={initialValues}
          carriedSubjectRules={selected?.subjectRules}
          prefilledFromVersion={selected?.version}
          onClose={() => setCreating(false)}
        />
      ) : null}
    </Dialog>
  );

  return (
    <section className="project-bible">
      <h1 className="project-bible__title">{translate('bible.title')}</h1>

      {selected === undefined ? (
        <EmptyState
          title={translate('bible.empty.title')}
          description={translate('bible.empty.description')}
          headingLevel={2}
        />
      ) : (
        <BibleVersionList
          versions={items}
          activeId={active.data?.id}
          selectedId={selected.id}
          onSelect={setChosenId}
        />
      )}

      {versions.data.nextCursor === undefined ? null : (
        <p className="project-bible__truncated">
          {translate('bible.versions.firstPageOnly')}
        </p>
      )}

      {selected === undefined ? null : (
        <div className="project-bible__sections">
          <BibleWorldSection world={selected.world} />
          <BibleNarrativeSection
            narrative={selected.narrative}
            projectKind={selected.projectKind}
          />
          <BibleAudioSection audio={selected.audio} />
          <BibleSubjectRulesSection subjectRules={selected.subjectRules} />
        </div>
      )}

      <div className="project-bible__actions">
        {createButton}
        {selected !== undefined && selected.published ? (
          <p className="project-bible__frozen">{translate('bible.frozen')}</p>
        ) : null}
        {selected !== undefined && !selected.published ? (
          <Button
            type="button"
            variant="secondary"
            size="md"
            aria-label={`${translate('bible.edit.action')} ${translate('bible.edit.context', { version: String(selected.version) })}`}
            onClick={() => setEditing(true)}
          >
            {translate('bible.edit.action')}
          </Button>
        ) : null}
      </div>

      {createDialog}

      <Dialog
        open={editing}
        title={translate('bible.edit.title')}
        onClose={() => setEditing(false)}
      >
        {editing && selected !== undefined ? (
          <EditBibleForm
            projectId={projectId}
            bible={selected}
            onClose={() => setEditing(false)}
          />
        ) : null}
      </Dialog>

      {selected === undefined ? null : (
        <BiblePublish projectId={projectId} bible={selected} />
      )}
      {selected === undefined ? null : (
        <BibleMarkdownPanel projectId={projectId} bibleId={selected.id} />
      )}
      <BibleGaps />
    </section>
  );
};
