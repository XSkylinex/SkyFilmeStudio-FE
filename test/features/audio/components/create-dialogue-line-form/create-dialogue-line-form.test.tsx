import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema, sceneIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { CreateDialogueLineForm } from '@/features/audio/components/create-dialogue-line-form';
import { buildDialogueLine } from '../../../../fixtures/dialogue-line.fixture';
import { buildVoiceProfile } from '../../../../fixtures/voice-profile.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';
import { renderInApp } from '../../../../render-in-app';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  '44444444-4444-4444-8444-444444444444',
);
const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const serveLibraries = (): void => {
  server.use(
    http.get(API_PATH.voiceProfiles(PROJECT_ID), () =>
      HttpResponse.json({ items: [buildVoiceProfile()] }),
    ),
    http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
      HttpResponse.json({ items: [] }),
    ),
  );
};

const renderForm = (): void => {
  renderInApp(
    <CreateDialogueLineForm
      projectId={PROJECT_ID}
      sceneId={SCENE_ID}
      nextOrder={3}
      onClose={() => undefined}
    />,
  );
};

describe('CreateDialogueLineForm', () => {
  it('marks the voice and the language required, and nothing the contract lets a person leave blank', async () => {
    serveLibraries();
    renderForm();

    expect(await screen.findByLabelText('Voice')).toHaveAttribute(
      'aria-required',
      'true',
    );
    expect(screen.getByLabelText('Language')).toHaveAttribute(
      'aria-required',
      'true',
    );
    expect(screen.getByLabelText('Text')).not.toHaveAttribute('aria-required');
  });

  it('refuses an empty submit before anything is sent, and lands focus on the summary', async () => {
    const user = userEvent.setup();
    let posts = 0;
    serveLibraries();
    server.use(
      http.post(API_PATH.sceneDialogueLines(SCENE_ID), () => {
        posts += 1;
        return HttpResponse.json(buildDialogueLine());
      }),
    );
    renderForm();
    await screen.findByLabelText('Voice');

    await user.click(screen.getByRole('button', { name: 'Add' }));

    const summary = await screen.findByRole('status');
    expect(summary).toHaveFocus();
    expect(summary).toHaveTextContent('Fields needing attention: 2');
    expect(posts).toBe(0);
  });

  it('sends exactly the request the contract expects, with the position it was opened at', async () => {
    const user = userEvent.setup();
    let body: unknown;
    serveLibraries();
    server.use(
      http.post(API_PATH.sceneDialogueLines(SCENE_ID), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(buildDialogueLine());
      }),
    );
    renderForm();
    const voice = await screen.findByLabelText('Voice');

    await user.type(screen.getByLabelText('Text'), 'Where did everyone go?');
    await user.type(screen.getByLabelText('Language'), 'en');
    await user.selectOptions(voice, buildVoiceProfile().id);
    await user.type(screen.getByLabelText('Emotion'), 'uneasy');
    await user.type(screen.getByLabelText('Pace'), 'slow');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      /The line was added/,
    );
    expect(body).toEqual({
      text: 'Where did everyone go?',
      language: 'en',
      voiceProfileId: buildVoiceProfile().id,
      order: 3,
      pronunciationOverrides: [],
      emotion: 'uneasy',
      pace: 'slow',
      pauseBeforeMs: 0,
      pauseAfterMs: 0,
    });
  });
});
