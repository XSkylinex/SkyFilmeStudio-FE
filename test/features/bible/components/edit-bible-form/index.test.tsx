import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { EditBibleForm } from '@/features/bible/components/edit-bible-form';
import { buildProjectBible } from '../../../../fixtures/project-bible.fixture';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

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
