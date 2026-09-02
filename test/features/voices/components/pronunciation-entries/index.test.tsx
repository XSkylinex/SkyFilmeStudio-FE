import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  projectIdSchema,
  pronunciationDictionaryEntryIdSchema,
  pronunciationDictionaryIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { PronunciationDictionaryEntry } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PronunciationEntries } from '@/features/voices/components/pronunciation-entries';
import { buildPronunciationEntry } from '../../../../fixtures/voice-profile.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const DICTIONARY_ID = pronunciationDictionaryIdSchema.parse(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
);
const ENTRY_ID = pronunciationDictionaryEntryIdSchema.parse(
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
);
const HEBREW = 'he-IL';

const server = mockOrchestratorServer();

const entriesPath = API_PATH.pronunciationDictionaryEntries(
  PROJECT_ID,
  DICTIONARY_ID,
);
const entryPath = API_PATH.pronunciationDictionaryEntry(
  PROJECT_ID,
  DICTIONARY_ID,
  ENTRY_ID,
);

const renderEntries = (): void => {
  renderInApp(
    <PronunciationEntries
      projectId={PROJECT_ID}
      dictionaryId={DICTIONARY_ID}
      language={HEBREW}
    />,
  );
};

describe('PronunciationEntries', () => {
  it('removes the entry whose control was pressed, and shows it gone once the server answers', async () => {
    const user = userEvent.setup();
    const entry: PronunciationDictionaryEntry = buildPronunciationEntry({
      term: 'שלום',
      normalisedTerm: 'שלום',
    });
    let entries: PronunciationDictionaryEntry[] = [entry];
    let deleted: string | undefined;

    server.use(
      http.get(entriesPath, () => HttpResponse.json({ items: entries })),
      http.delete(entryPath, () => {
        deleted = ENTRY_ID;
        entries = [];
        return HttpResponse.json(entry);
      }),
    );

    renderEntries();

    await user.click(
      await screen.findByRole('button', {
        name: `Remove the entry ${entry.term}`,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText('This dictionary has no entries.'),
      ).toBeInTheDocument();
    });
    expect(deleted).toBe(ENTRY_ID);
  });

  it('does not remove the entry from the list before the server has answered', async () => {
    const user = userEvent.setup();
    const entry = buildPronunciationEntry({
      term: 'שלום',
      normalisedTerm: 'שלום',
    });
    let release: () => void = () => undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.get(entriesPath, () => HttpResponse.json({ items: [entry] })),
      http.delete(entryPath, async () => {
        await held;
        return HttpResponse.json(entry);
      }),
    );

    renderEntries();

    const control = await screen.findByRole('button', {
      name: `Remove the entry ${entry.term}`,
    });
    await user.click(control);

    expect(await screen.findByText('Removing…')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    release();
  });

  it('says the removal failed rather than leaving the list looking changed', async () => {
    const user = userEvent.setup();
    const entry = buildPronunciationEntry({
      term: 'שלום',
      normalisedTerm: 'שלום',
    });

    server.use(
      http.get(entriesPath, () => HttpResponse.json({ items: [entry] })),
      http.delete(entryPath, () =>
        HttpResponse.json(
          { statusCode: 500, message: 'unavailable' },
          { status: 500 },
        ),
      ),
    );

    renderEntries();

    await user.click(
      await screen.findByRole('button', {
        name: `Remove the entry ${entry.term}`,
      }),
    );

    expect(
      await screen.findByText('The entry was not removed'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('offers the add form even when the dictionary is empty', async () => {
    server.use(http.get(entriesPath, () => HttpResponse.json({ items: [] })));

    renderEntries();

    expect(
      await screen.findByText('This dictionary has no entries.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Term')).toBeInTheDocument();
  });
});
