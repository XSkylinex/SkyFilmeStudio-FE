import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectIdSchema,
  pronunciationDictionaryIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { AddPronunciationEntryForm } from '@/features/voices/components/add-pronunciation-entry-form';
import { buildPronunciationEntry } from '../../../../fixtures/voice-profile.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const DICTIONARY_ID = pronunciationDictionaryIdSchema.parse(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
);
const HEBREW = 'he-IL';
const ENGLISH = 'en-GB';

const server = mockOrchestratorServer(
  http.get(
    API_PATH.pronunciationDictionaryEntries(PROJECT_ID, DICTIONARY_ID),
    () => HttpResponse.json({ items: [] }),
  ),
);

const capturePost = (): { body: () => unknown } => {
  let captured: unknown;
  server.use(
    http.post(
      API_PATH.pronunciationDictionaryEntries(PROJECT_ID, DICTIONARY_ID),
      async ({ request }) => {
        captured = await request.json();
        return HttpResponse.json(buildPronunciationEntry());
      },
    ),
  );

  return { body: () => captured };
};

const renderForm = (language: string = HEBREW): void => {
  renderInApp(
    <AddPronunciationEntryForm
      projectId={PROJECT_ID}
      dictionaryId={DICTIONARY_ID}
      language={language}
    />,
  );
};

describe('AddPronunciationEntryForm', () => {
  it('sends the term and its phoneme override', async () => {
    const user = userEvent.setup();
    const posted = capturePost();
    renderForm();

    await user.type(screen.getByLabelText('Term'), 'שלום');
    await user.type(screen.getByLabelText('Phoneme override'), 'ʃaˈlom');
    await user.click(screen.getByRole('button', { name: 'Add an entry' }));

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).toStrictEqual({
      term: 'שלום',
      phonemeOverride: 'ʃaˈlom',
    });
  });

  it('omits a blank phoneme override rather than sending an empty string', async () => {
    const user = userEvent.setup();
    const posted = capturePost();
    renderForm();

    await user.type(screen.getByLabelText('Term'), 'שלום');
    await user.click(screen.getByRole('button', { name: 'Add an entry' }));

    await waitFor(() => {
      expect(posted.body()).toBeDefined();
    });
    expect(posted.body()).toStrictEqual({ term: 'שלום' });
  });

  it('starts the term field in the dictionary’s own direction, not the interface’s', () => {
    renderForm(HEBREW);

    expect(
      document.querySelector('.add-pronunciation-entry-form__term'),
    ).toHaveAttribute('dir', 'rtl');
    expect(
      document.querySelector('.add-pronunciation-entry-form__notation'),
    ).toHaveAttribute('dir', 'ltr');
  });

  it('takes that direction from the dictionary it belongs to, so an English one starts left to right', () => {
    renderForm(ENGLISH);

    expect(
      document.querySelector('.add-pronunciation-entry-form__term'),
    ).toHaveAttribute('dir', 'ltr');
  });

  it('leaves the field itself on auto, so a term in another script still reads correctly', () => {
    renderForm(HEBREW);

    expect(screen.getByLabelText('Term')).toHaveAttribute('dir', 'auto');
  });

  it('refuses an empty term against its own field and sends nothing', async () => {
    const user = userEvent.setup();
    const posted = capturePost();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Add an entry' }));

    expect(await screen.findByText('This needs a value.')).toBeInTheDocument();
    expect(screen.getByLabelText('Term')).toBeInvalid();
    expect(posted.body()).toBeUndefined();
  });

  it('clears the term and announces once the server answers', async () => {
    const user = userEvent.setup();
    capturePost();
    renderForm();

    await user.type(screen.getByLabelText('Term'), 'שלום');
    await user.click(screen.getByRole('button', { name: 'Add an entry' }));

    const announcement = await screen.findByText('Created.');

    expect(announcement.tagName).toBe('OUTPUT');
    expect(announcement).toHaveFocus();
    expect(screen.getByLabelText('Term')).toHaveValue('');
  });

  it('shows the refusal of a term that normalises onto one already there', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(
        API_PATH.pronunciationDictionaryEntries(PROJECT_ID, DICTIONARY_ID),
        () =>
          HttpResponse.json(
            {
              statusCode: 409,
              code: 'PRONUNCIATION_ENTRY_EXISTS',
              message: 'already normalises to the same term',
            },
            { status: 409 },
          ),
      ),
    );
    renderForm();

    await user.type(screen.getByLabelText('Term'), 'שלום');
    await user.click(screen.getByRole('button', { name: 'Add an entry' }));

    expect(
      await screen.findByText('The entry was not added'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/normalises to the same term as this one/),
    ).toBeInTheDocument();
  });
});
