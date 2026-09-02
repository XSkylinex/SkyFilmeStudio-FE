import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectIdSchema,
  pronunciationDictionaryIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { PronunciationDictionaryEntry } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { DeletePronunciationDictionary } from '@/features/voices/components/delete-pronunciation-dictionary';
import { renderInApp } from '../../../../render-in-app';
import {
  buildPronunciationDictionary,
  buildPronunciationEntry,
} from '../../../../fixtures/voice-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const DICTIONARY_ID = pronunciationDictionaryIdSchema.parse(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
);

const serves = (entries: readonly PronunciationDictionaryEntry[]): void => {
  server.use(
    http.get(
      API_PATH.pronunciationDictionaryEntries(PROJECT_ID, DICTIONARY_ID),
      () => HttpResponse.json({ items: entries }),
    ),
  );
};

const render = (): void => {
  renderInApp(
    <DeletePronunciationDictionary
      projectId={PROJECT_ID}
      dictionaryId={DICTIONARY_ID}
      language="he-IL"
    />,
  );
};

describe('DeletePronunciationDictionary', () => {
  it('offers no delete while the dictionary still holds a term', async () => {
    serves([buildPronunciationEntry()]);
    render();

    expect(
      await screen.findByText(/its terms are left attached to it/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('names the dictionary in the control, not just "Delete"', async () => {
    serves([]);
    render();

    expect(
      await screen.findByRole('button', {
        name: 'Delete the he-IL pronunciation dictionary',
      }),
    ).toBeInTheDocument();
  });

  it('deletes an empty dictionary through the route that hides it', async () => {
    const user = userEvent.setup();
    const asked: string[] = [];

    serves([]);
    server.use(
      http.delete(
        API_PATH.pronunciationDictionary(PROJECT_ID, DICTIONARY_ID),
        ({ request }) => {
          asked.push(request.method);
          return HttpResponse.json(buildPronunciationDictionary());
        },
      ),
    );
    render();

    await user.click(await screen.findByRole('button', { name: /^Delete/ }));

    expect(asked).toStrictEqual(['DELETE']);
  });

  it('says why there is no delete when the term list cannot be read', async () => {
    server.use(
      http.get(
        API_PATH.pronunciationDictionaryEntries(PROJECT_ID, DICTIONARY_ID),
        () => new HttpResponse(null, { status: 500 }),
      ),
    );
    render();

    expect(
      await screen.findByText(/whether it is safe to delete is unknown/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
