import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { BibleSubjectRules } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EditBibleForm } from '@/features/bible/components/edit-bible-form';
import { buildProjectBible } from '../../../../fixtures/project-bible.fixture';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { buildSubject } from '../../../../fixtures/subject.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const MIRA_ID = subjectIdSchema.parse('11111111-1111-4111-8111-111111111111');

const server = mockOrchestratorServer(
  http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
    HttpResponse.json({
      items: [buildSubject({ id: MIRA_ID, displayName: 'Mira' })],
    }),
  ),
);

const MIRA_RULES: BibleSubjectRules = {
  subjectId: MIRA_ID,
  immutableVisualTraits: ['Short dark hair'],
  allowedVariations: [],
  prohibitedChanges: [],
  scaleRelationships: [],
  wardrobeVariants: [],
  speaks: false,
  voiceRules: [],
  relationships: [],
};

const styleLibraryServes = (): void => {
  server.use(
    http.get(API_PATH.styleProfiles(PROJECT_ID), () =>
      HttpResponse.json({ items: [buildStyleProfile()] }),
    ),
  );
};

describe('EditBibleForm', () => {
  it('refuses to submit an untouched form, because the orchestrator rejects an empty body', async () => {
    styleLibraryServes();
    const bible = buildProjectBible();

    renderInApp(
      <EditBibleForm
        projectId={PROJECT_ID}
        bible={bible}
        onClose={() => undefined}
      />,
    );

    expect(
      await screen.findByRole('button', { name: 'Save changes' }),
    ).toBeDisabled();
  });

  it('sends only the section the user touched', async () => {
    styleLibraryServes();
    const bible = buildProjectBible();

    let captured: unknown;
    server.use(
      http.patch(
        API_PATH.projectBible(PROJECT_ID, bible.id),
        async ({ request }) => {
          captured = await request.json();
          return HttpResponse.json(bible);
        },
      ),
    );

    renderInApp(
      <EditBibleForm
        projectId={PROJECT_ID}
        bible={bible}
        onClose={() => undefined}
      />,
    );

    await userEvent.type(await screen.findByLabelText('Tone'), 'Restrained');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(captured).toBeDefined();
    });
    expect(captured).toEqual({
      world: {
        tone: 'Restrained',
        contentBoundaries: [],
        recurringThemes: [],
        introOutroRules: [],
        continuityConstraints: [],
      },
    });
  });

  it('sends the whole subject list, and nothing else, when one subject’s rules change', async () => {
    const user = userEvent.setup();
    styleLibraryServes();
    const bible = buildProjectBible({ subjectRules: [MIRA_RULES] });

    let captured: unknown;
    server.use(
      http.patch(
        API_PATH.projectBible(PROJECT_ID, bible.id),
        async ({ request }) => {
          captured = await request.json();
          return HttpResponse.json(bible);
        },
      ),
    );

    renderInApp(
      <EditBibleForm
        projectId={PROJECT_ID}
        bible={bible}
        onClose={() => undefined}
      />,
    );

    await user.type(
      await screen.findByLabelText('Immutable visual traits'),
      '\nA chipped left horn',
    );
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(captured).toBeDefined();
    });
    expect(captured).toEqual({
      subjectRules: [
        {
          ...MIRA_RULES,
          immutableVisualTraits: ['Short dark hair', 'A chipped left horn'],
        },
      ],
    });
  });

  it('shows the subject a block belongs to by name', async () => {
    styleLibraryServes();

    renderInApp(
      <EditBibleForm
        projectId={PROJECT_ID}
        bible={buildProjectBible({ subjectRules: [MIRA_RULES] })}
        onClose={() => undefined}
      />,
    );

    expect(
      await screen.findByRole('option', { name: 'Mira', selected: true }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toHaveValue(MIRA_ID);
  });

  it('re-baselines on what the server returned, so a second edit is possible without a reload', async () => {
    styleLibraryServes();
    const bible = buildProjectBible();

    server.use(
      http.patch(API_PATH.projectBible(PROJECT_ID, bible.id), async () =>
        HttpResponse.json({
          ...bible,
          world: { ...bible.world, tone: 'Restrained' },
        }),
      ),
    );

    renderInApp(
      <EditBibleForm
        projectId={PROJECT_ID}
        bible={bible}
        onClose={() => undefined}
      />,
    );

    const tone = await screen.findByLabelText('Tone');
    await userEvent.type(tone, 'Restrained');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    const announcement = await screen.findByText('Saved.');

    expect(announcement).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();

    await userEvent.type(tone, ' and dry');

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });

  it('does not re-announce a save when a later edit is undone back to what was saved', async () => {
    styleLibraryServes();
    const bible = buildProjectBible();

    server.use(
      http.patch(API_PATH.projectBible(PROJECT_ID, bible.id), async () =>
        HttpResponse.json({
          ...bible,
          world: { ...bible.world, tone: 'Restrained' },
        }),
      ),
    );

    renderInApp(
      <EditBibleForm
        projectId={PROJECT_ID}
        bible={bible}
        onClose={() => undefined}
      />,
    );

    const tone = await screen.findByLabelText('Tone');
    await userEvent.type(tone, 'Restrained');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await screen.findByText('Saved.');

    await userEvent.type(tone, 'x');

    expect(screen.queryByText('Saved.')).not.toBeInTheDocument();

    await userEvent.type(tone, '{backspace}');

    expect(screen.queryByText('Saved.')).not.toBeInTheDocument();
    expect(tone).toHaveFocus();
  });

  it('offers no narrative fields on a kind that carries none, and says why', async () => {
    styleLibraryServes();
    const bible = buildProjectBible({ projectKind: 'MUSIC' });

    renderInApp(
      <EditBibleForm
        projectId={PROJECT_ID}
        bible={bible}
        onClose={() => undefined}
      />,
    );

    expect(await screen.findByLabelText('Genre')).toBeInTheDocument();
    expect(screen.queryByLabelText('Chronology')).not.toBeInTheDocument();
    expect(
      screen.getByText(/carries no narrative section/i),
    ).toBeInTheDocument();
  });
});
