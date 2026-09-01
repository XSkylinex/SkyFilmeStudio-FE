import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreateBibleForm } from '@/features/bible/components/create-bible-form';
import { EMPTY_BIBLE_FORM_VALUES } from '@/features/bible/helpers/bible-form-values';
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

const capturePost = (): { body: () => unknown } => {
  let captured: unknown;
  server.use(
    http.post(API_PATH.projectBibles(PROJECT_ID), async ({ request }) => {
      captured = await request.json();
      return HttpResponse.json(buildProjectBible());
    }),
  );

  return { body: () => captured };
};

describe('CreateBibleForm', () => {
  it('offers no narrative fields at all when the project kind carries none', async () => {
    styleLibraryServes();

    renderInApp(
      <CreateBibleForm
        projectId={PROJECT_ID}
        carriesNarrative={false}
        initialValues={EMPTY_BIBLE_FORM_VALUES}
        onClose={() => undefined}
      />,
    );

    expect(await screen.findByLabelText('Genre')).toBeInTheDocument();
    expect(screen.queryByLabelText('Chronology')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Narrative rules', { selector: 'legend' }),
    ).not.toBeInTheDocument();
  });

  it('offers them when it does', async () => {
    styleLibraryServes();

    renderInApp(
      <CreateBibleForm
        projectId={PROJECT_ID}
        carriesNarrative
        initialValues={EMPTY_BIBLE_FORM_VALUES}
        onClose={() => undefined}
      />,
    );

    expect(await screen.findByLabelText('Chronology')).toBeInTheDocument();
  });

  it('omits an untouched narrative section rather than sending an empty one', async () => {
    styleLibraryServes();
    const posted = capturePost();

    renderInApp(
      <CreateBibleForm
        projectId={PROJECT_ID}
        carriesNarrative
        initialValues={EMPTY_BIBLE_FORM_VALUES}
        onClose={() => undefined}
      />,
    );

    await userEvent.type(await screen.findByLabelText('Genre'), 'Documentary');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).not.toHaveProperty('narrative');
    expect(posted.body()).toMatchObject({ world: { genre: 'Documentary' } });
  });

  it('splits a rule list on newlines, so one box records several rules', async () => {
    styleLibraryServes();
    const posted = capturePost();

    renderInApp(
      <CreateBibleForm
        projectId={PROJECT_ID}
        carriesNarrative
        initialValues={EMPTY_BIBLE_FORM_VALUES}
        onClose={() => undefined}
      />,
    );

    await userEvent.type(
      await screen.findByLabelText('Content boundaries'),
      'No graphic violence\nNo real brand names',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).toMatchObject({
      world: {
        contentBoundaries: ['No graphic violence', 'No real brand names'],
      },
    });
  });

  it('shows the refusal against the field that caused it, not silently doing nothing', async () => {
    styleLibraryServes();
    const posted = capturePost();

    renderInApp(
      <CreateBibleForm
        projectId={PROJECT_ID}
        carriesNarrative
        initialValues={EMPTY_BIBLE_FORM_VALUES}
        onClose={() => undefined}
      />,
    );

    await userEvent.type(
      await screen.findByLabelText('Languages'),
      'not a tag',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(posted.body()).toBeUndefined();
    expect(
      await screen.findByText('The contract will not accept this value.'),
    ).toBeInTheDocument();
  });

  it('announces the created draft and puts focus on the announcement', async () => {
    styleLibraryServes();
    capturePost();

    renderInApp(
      <CreateBibleForm
        projectId={PROJECT_ID}
        carriesNarrative
        initialValues={EMPTY_BIBLE_FORM_VALUES}
        onClose={() => undefined}
      />,
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Add' }));

    const announcement = await screen.findByText('Created.');

    expect(announcement).toBeInTheDocument();
    expect(announcement).toHaveFocus();
  });
});
