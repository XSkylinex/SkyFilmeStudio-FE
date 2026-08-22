import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  projectIdSchema,
  pronunciationDictionaryIdSchema,
  subjectIdSchema,
  voiceProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import type {
  PronunciationDictionary,
  PronunciationDictionaryEntry,
  VoiceProfile,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { VoicesPage } from '@/features/voices/VoicesPage';
import { renderInApp } from '../../render-in-app';
import {
  buildPronunciationDictionary,
  buildPronunciationEntry,
  buildVoiceProfile,
} from '../../fixtures/voice-profile.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const DICTIONARY_ID = pronunciationDictionaryIdSchema.parse(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
);
const SUBJECT_ID = subjectIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);

const renderPage = (): void => {
  renderInApp(
    <MemoryRouter initialEntries={[`/projects/${PROJECT_ID}/voices`]}>
      <Routes>
        <Route path="/projects/:projectId/voices" element={<VoicesPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

const orchestratorServes = (
  voices: readonly VoiceProfile[],
  dictionaries: readonly PronunciationDictionary[] = [],
  entries: readonly PronunciationDictionaryEntry[] = [],
): void => {
  server.use(
    http.get(API_PATH.voiceProfiles(PROJECT_ID), () =>
      HttpResponse.json({ items: voices }),
    ),
    http.get(API_PATH.pronunciationDictionaries(PROJECT_ID), () =>
      HttpResponse.json({ items: dictionaries }),
    ),
    http.get(
      API_PATH.pronunciationDictionaryEntries(PROJECT_ID, DICTIONARY_ID),
      () => HttpResponse.json({ items: entries }),
    ),
  );
};

describe('VoicesPage', () => {
  it('separates a subject voice from a narrator voice', async () => {
    orchestratorServes([
      buildVoiceProfile({ displayName: 'Mira', subjectId: SUBJECT_ID }),
      buildVoiceProfile({
        id: voiceProfileIdSchema.parse('88888888-8888-4888-8888-888888888888'),
        displayName: 'Narrator',
      }),
    ]);

    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'Mira', level: 4 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Attached to a subject', level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Narrator and standalone',
        level: 3,
      }),
    ).toBeInTheDocument();
  });

  it('says a voice does not need a subject when there are none standalone', async () => {
    orchestratorServes([buildVoiceProfile({ subjectId: SUBJECT_ID })]);

    renderPage();

    expect(
      await screen.findByText(/A voice does not need a subject/),
    ).toBeInTheDocument();
  });

  it('says the one-per-subject limit is enforced at approval, not creation', async () => {
    orchestratorServes([buildVoiceProfile({ subjectId: SUBJECT_ID })]);

    renderPage();

    expect(
      await screen.findByText(
        /enforced when one is approved rather than when it is created/,
      ),
    ).toBeInTheDocument();
  });

  it('does not pretend a voice can be listened to', async () => {
    orchestratorServes([buildVoiceProfile()]);

    renderPage();

    expect(
      await screen.findByText(/publishes no synthesis preview route/),
    ).toBeInTheDocument();
  });

  it('shows a Hebrew term beside the different form it normalises to', async () => {
    orchestratorServes(
      [buildVoiceProfile()],
      [buildPronunciationDictionary()],
      [
        buildPronunciationEntry({
          term: 'שלום  עולם',
          normalisedTerm: 'שלום עולם',
        }),
      ],
    );

    renderPage();

    const label = await screen.findByText(/normalises to/);
    const row = label.closest('li');

    expect(row?.textContent).toContain('שלום  עולם');
    expect(label.textContent).toContain('שלום עולם');
  });

  it('says an entry cannot be edited, because no route exists for it', async () => {
    orchestratorServes(
      [buildVoiceProfile()],
      [buildPronunciationDictionary()],
      [buildPronunciationEntry()],
    );

    renderPage();

    expect(
      await screen.findByText(/deleting it and adding the replacement/),
    ).toBeInTheDocument();
  });
});
