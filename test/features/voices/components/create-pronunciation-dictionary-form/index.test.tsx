import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreatePronunciationDictionaryForm } from '@/features/voices/components/create-pronunciation-dictionary-form';
import { buildPronunciationDictionary } from '../../../../fixtures/voice-profile.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const server = mockOrchestratorServer(
  http.get(API_PATH.pronunciationDictionaries(PROJECT_ID), () =>
    HttpResponse.json({ items: [] }),
  ),
);

const capturePost = (): { body: () => unknown } => {
  let captured: unknown;
  server.use(
    http.post(
      API_PATH.pronunciationDictionaries(PROJECT_ID),
      async ({ request }) => {
        captured = await request.json();
        return HttpResponse.json(buildPronunciationDictionary());
      },
    ),
  );

  return { body: () => captured };
};

describe('CreatePronunciationDictionaryForm', () => {
  it('sends the language tag that was typed', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(
      <CreatePronunciationDictionaryForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await user.type(screen.getByLabelText('Language tag'), 'he-IL');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).toStrictEqual({ language: 'he-IL' });
  });

  it('lets the contract refuse a value that is not a language tag', async () => {
    const user = userEvent.setup();
    const posted = capturePost();

    renderInApp(
      <CreatePronunciationDictionaryForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await user.type(screen.getByLabelText('Language tag'), 'not a tag');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(
      await screen.findByText('The contract will not accept this value.'),
    ).toBeInTheDocument();
    expect(posted.body()).toBeUndefined();
  });

  it('shows the refusal of a second dictionary for a language that has one', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(API_PATH.pronunciationDictionaries(PROJECT_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'PRONUNCIATION_DICTIONARY_EXISTS',
            message: 'one per language',
          },
          { status: 409 },
        ),
      ),
    );

    renderInApp(
      <CreatePronunciationDictionaryForm
        projectId={PROJECT_ID}
        onClose={() => undefined}
      />,
    );

    await user.type(screen.getByLabelText('Language tag'), 'he-IL');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(
      await screen.findByText('The dictionary was not created'),
    ).toBeInTheDocument();
    expect(screen.getByText(/there is one per language/)).toBeInTheDocument();
  });
});
